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
  
  // Create unique map ID based on center coordinates and markers
  const mapId = useMemo(() => {
    const coords = markers.length > 0 ? markers[0] : center;
    return `contact-map-${coords.lat}-${coords.lng}`;
  }, [center, markers]);

  const { isInitialized, setInitialized, mapInstance, setMapInstance } = useMapState(mapId);
  const markersRef = useRef([]);

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
  }, [center, zoom, showControls, markers, isLoaded, isInitialized, setMapInstance, setInitialized]);

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
  }, [markers, mapInstance, isInitialized, center]);

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
