import React, { useState, useEffect, useRef, useMemo } from 'react';
import GoogleMapsLoader, { useGoogleMaps, useMapState, MapContainer, MapLoadingUI, MapErrorUI } from '../shared/GoogleMapsLoader';

const MapContent = React.memo(({ 
  className = '',
  height = '400px',
  showControls = true,
  markers = [],
  center = { lat: 33.8938, lng: 35.5018 }, // Beirut coordinates
  zoom = 12
}) => {
  const mapRef = useRef(null);
  const [error, setError] = useState(null);
  const { isLoaded } = useGoogleMaps();
  const [mapReady, setMapReady] = useState(false);
  
  // Use only the numeric center coordinates for a stable mapId and dependency tracking
  const mapId = useMemo(() => `contact-map-${center.lat}-${center.lng}`, [center.lat, center.lng]);

  const { isInitialized, setInitialized, mapInstance, setMapInstance } = useMapState(mapId);
  const markersRef = useRef([]);

  // Create a stable key that only changes when the logical set of markers changes
  // (lat/lng pairs). This prevents the marker-update effect from running solely
  // because a new [] reference was created by the calling component on each
  // render.
  const markersKey = useMemo(() => {
    if (!markers || markers.length === 0) return '';
    // Order does not matter for a single default marker scenario but for safety
    // we keep original order; join lat/lng pairs into a string.
    return markers.map(m => `${m.lat}-${m.lng}`).join('|');
  }, [markers]);

  // Cleanup function
  const cleanup = () => {
    if (markersRef.current) {
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];
    }
    if (mapInstance) {
      setMapInstance(null);
    }
    setInitialized(false);
  };

  useEffect(() => {
    if (!mapRef.current || !isLoaded || !window.google?.maps || isInitialized) return;

    try {
      console.log('Initializing map with:', {
        center,
        zoom,
        ref: mapRef.current
      });

      // Create map instance
      const map = new window.google.maps.Map(mapRef.current, {
        center,
        zoom,
        zoomControl: showControls,
        mapTypeControl: showControls,
        scaleControl: showControls,
        streetViewControl: showControls,
        rotateControl: showControls,
        fullscreenControl: showControls
      });

      setMapInstance(map);

      // Add markers using standard Marker instead of AdvancedMarkerElement
      const newMarkers = markers.map(marker => {
        try {
          return new window.google.maps.Marker({
            map,
            position: { lat: marker.lat, lng: marker.lng },
            title: marker.title,
            animation: window.google.maps.Animation.DROP
          });
        } catch (markerError) {
          console.error('Error creating marker:', markerError);
          return null;
        }
      }).filter(Boolean);

      // Add default office marker if no markers provided
      if (markers.length === 0) {
        try {
          newMarkers.push(new window.google.maps.Marker({
            map,
            position: center,
            title: 'Our Office',
            animation: window.google.maps.Animation.DROP
          }));
        } catch (markerError) {
          console.error('Error creating default marker:', markerError);
        }
      }

      markersRef.current = newMarkers;
      setInitialized(true);
      setMapReady(true);

    } catch (err) {
      console.error('Error initializing map:', err);
      setError(err);
      cleanup();
    }

    return cleanup;
  }, [center.lat, center.lng, zoom, showControls, isLoaded]);

  // Update markers when they change
  useEffect(() => {
    if (!mapInstance || !isInitialized) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Add new markers
    const newMarkers = markers.map(marker => {
      try {
        return new window.google.maps.Marker({
          map: mapInstance,
          position: { lat: marker.lat, lng: marker.lng },
          title: marker.title
        });
      } catch (markerError) {
        console.error('Error updating marker:', markerError);
        return null;
      }
    }).filter(Boolean);

    // Add default marker if needed
    if (markers.length === 0) {
      try {
        newMarkers.push(new window.google.maps.Marker({
          map: mapInstance,
          position: center,
          title: 'Our Office'
        }));
      } catch (markerError) {
        console.error('Error updating default marker:', markerError);
      }
    }

    markersRef.current = newMarkers;
  }, [markersKey, mapInstance, isInitialized, center.lat, center.lng]);

  // Always render MapContainer and the inner div so the ref is available
  return (
    <MapContainer className={className}>
      <div
        ref={mapRef}
        style={{ width: '100%', height, position: 'relative', overflow: 'hidden' }}
      />
      {(!isLoaded || !mapReady) && <MapLoadingUI />}
      {error && <MapErrorUI error={error} />}
    </MapContainer>
  );
});

const Map = React.memo((props) => (
  <GoogleMapsLoader>
    <MapContent {...props} />
  </GoogleMapsLoader>
));

export default Map;
