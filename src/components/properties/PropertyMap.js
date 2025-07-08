import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import GoogleMapsLoader, { useGoogleMaps, MapContainer, MapLoadingUI, MapErrorUI, useMapState } from '../shared/GoogleMapsLoader';
import { endpoints } from '../../services/api';
import axios from 'axios';

const isEmbedUrl = (url) => /google\.com\/maps\/embed\?pb=/.test(url);

const PropertyMapContent = React.memo(({ locationUrl, village, city, governate }) => {
  const mapRef = useRef(null);
  const [mapError, setMapError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [debugCoords, setDebugCoords] = useState(null);
  const { isLoaded, error: mapsError, maps } = useGoogleMaps();
  
  const mapId = useMemo(() => {
    return `property-map-${[locationUrl, village, city, governate].filter(Boolean).join('-').replace(/[^a-zA-Z0-9-]/g, '')}`;
  }, [locationUrl, village, city, governate]);
  
  const { isInitialized, setInitialized, mapInstance, setMapInstance } = useMapState(mapId);
  
  const markerRef = useRef(null);
  const mountedRef = useRef(true);
  const hasInitializedRef = useRef(false);
  const initializationPromiseRef = useRef(null);

  const cleanup = useCallback(() => {
    if (!mountedRef.current) return;

    console.log('PropertyMapContent: Running cleanup');
    if (markerRef.current) {
      markerRef.current.setMap(null);
      markerRef.current = null;
    }
    if (mapInstance) {
      setMapInstance(null);
    }
    setInitialized(false);
    hasInitializedRef.current = false;
  }, [mapInstance, setMapInstance, setInitialized]);

  const createMap = useCallback((coords) => {
    if (!mountedRef.current || !maps) {
      console.log('PropertyMapContent: Component unmounted or Maps not available, skipping map creation');
      return null;
    }

    if (hasInitializedRef.current || mapInstance) {
      console.log('PropertyMapContent: Map already initialized, skipping creation');
      return mapInstance;
    }

    console.log('PropertyMapContent: Creating map with coords:', coords);
    
    if (!mapRef.current || !coords?.lat || !coords?.lng) {
      console.error('PropertyMapContent: Map creation prerequisites not met:', {
        hasMapRef: !!mapRef.current,
        hasCoords: !!(coords?.lat && coords?.lng),
        coords
      });
      return null;
    }

    try {
      const mapOptions = {
        center: coords,
        zoom: 15,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
        zoomControl: true,
        gestureHandling: 'cooperative',
        mapTypeId: maps.MapTypeId.ROADMAP
      };

      const map = new maps.Map(mapRef.current, mapOptions);
      console.log('PropertyMapContent: Map instance created');

      const marker = new maps.Marker({
        map,
        position: coords,
        title: [village, city, governate].filter(Boolean).join(', ') || 'Property Location',
        animation: maps.Animation.DROP
      });

      console.log('PropertyMapContent: Marker created');
      markerRef.current = marker;

      if (mountedRef.current) {
        setIsMapLoading(false);
        setInitialized(true);
        hasInitializedRef.current = true;
      }

      return map;
    } catch (error) {
      console.error('PropertyMapContent: Error creating map:', error);
      if (mountedRef.current) {
        setMapError(true);
        setErrorMessage(error.message);
        setIsMapLoading(false);
      }
      return null;
    }
  }, [village, city, governate, setInitialized, mapInstance, maps]);

  const initializeMap = useCallback(async () => {
    if (!mountedRef.current || hasInitializedRef.current || !isLoaded || !locationUrl || !maps) {
      console.log('PropertyMapContent: Skipping initialization:', {
        mounted: mountedRef.current,
        alreadyInitialized: hasInitializedRef.current,
        isLoaded,
        hasLocationUrl: !!locationUrl,
        hasMaps: !!maps
      });
      return;
    }

    // If already initializing, return existing promise
    if (initializationPromiseRef.current) {
      console.log('PropertyMapContent: Already initializing, waiting for completion');
      return initializationPromiseRef.current;
    }

    console.log('PropertyMapContent: Starting map initialization');

    initializationPromiseRef.current = (async () => {
      try {
        const response = await endpoints.maps.extractCoordinates(locationUrl);
        
        if (!mountedRef.current) {
          console.log('PropertyMapContent: Component unmounted during coordinates fetch');
          return;
        }

        if (response.data?.success && response.data?.data) {
          const coords = response.data.data;
          setDebugCoords(coords);
          console.log('PropertyMapContent: Coordinates extracted:', coords);
          
          if (mountedRef.current && mapRef.current && !hasInitializedRef.current) {
            const map = createMap(coords);
            if (map) {
              setMapInstance(map);
            }
          }
        } else {
          throw new Error('Failed to extract coordinates from location URL');
        }
      } catch (error) {
        console.error('PropertyMapContent: Error initializing map:', error);
        if (mountedRef.current) {
          setMapError(true);
          setErrorMessage(error.response?.data?.error || error.message);
          setIsMapLoading(false);
        }
      } finally {
        initializationPromiseRef.current = null;
      }
    })();

    return initializationPromiseRef.current;
  }, [locationUrl, isLoaded, createMap, setMapInstance, maps]);

  useEffect(() => {
    mountedRef.current = true;

    if (isLoaded && !hasInitializedRef.current && !mapError && mapRef.current && maps) {
      console.log('PropertyMapContent: Initial initialization check');
      initializeMap();
    }

    return () => {
      console.log('PropertyMapContent: Component unmounting, cleaning up');
      mountedRef.current = false;
      initializationPromiseRef.current = null;
      cleanup();
    };
  }, [cleanup, mapError, isLoaded, initializeMap, maps]);

  // Hide component if URL not embed or on error
  if (!isEmbedUrl(locationUrl) || mapsError || mapError) {
    return null;
  }

  return (
    <MapContainer>
      <div 
        ref={mapRef} 
        style={{ 
          width: '100%', 
          height: '400px',
          position: 'relative',
          overflow: 'hidden'
        }}
      />
      {(!isLoaded || isMapLoading) && <MapLoadingUI />}
    </MapContainer>
  );
});

const PropertyMap = React.memo(({ locationUrl, village, city, governate }) => {
  // Only render the map when a valid Google Maps embed URL is provided
  if (!locationUrl || !isEmbedUrl(locationUrl)) return null;

  return (
    <GoogleMapsLoader>
      <PropertyMapContent 
        key={locationUrl} // Add key to force remount when location changes
        locationUrl={locationUrl}
        village={village}
        city={city}
        governate={governate}
      />
    </GoogleMapsLoader>
  );
});

export default PropertyMap;
