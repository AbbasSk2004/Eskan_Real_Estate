import React, { useEffect, useState, createContext, useContext, useMemo, useRef } from 'react';

// Create contexts for map loading and map state
const GoogleMapsContext = createContext({
  isLoaded: false,
  error: null,
  maps: null
});

const MapStateContext = createContext({
  isInitialized: false,
  setInitialized: () => {},
  mapInstance: null,
  setMapInstance: () => {}
});

// Reusable components for maps
export const MapLoadingUI = React.memo(() => (
  <div style={{
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
    padding: '20px'
  }}>
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Loading map...</span>
    </div>
    <p style={{ marginTop: '10px', color: '#666' }}>Loading map...</p>
  </div>
));

export const MapErrorUI = React.memo(({ error, debugInfo }) => (
  <div style={{
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
    padding: '20px',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '4px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  }}>
    <h3 style={{ margin: '0 0 10px 0' }}>Google Maps Error</h3>
    <p style={{ margin: '0 0 10px 0', color: '#d32f2f' }}>{error.message}</p>
    {error.message.includes('API key') && (
      <div style={{ fontSize: '0.9em', color: '#666' }}>
        <p style={{ margin: '5px 0' }}>Please check:</p>
        <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
          <li>Your .env file exists in the project root</li>
          <li>REACT_APP_GOOGLE_MAPS_API_KEY is set to a valid API key</li>
          <li>You have restarted your development server after updating .env</li>
        </ul>
      </div>
    )}
    {debugInfo && (
      <pre style={{ margin: '10px 0 0 0', fontSize: '12px', color: '#666' }}>
        {JSON.stringify(debugInfo, null, 2)}
      </pre>
    )}
  </div>
));

export const MapContainer = React.memo(({ children, className }) => (
  <div 
    style={{
      width: '100%',
      height: '400px',
      borderRadius: '8px',
      overflow: 'hidden',
      position: 'relative',
      backgroundColor: '#f5f5f5',
      border: '1px solid #e0e0e0'
    }}
    className={`map-container ${className || ''}`}
  >
    {children}
  </div>
));

// Global state singleton
const GlobalMapsState = {
  isInitialized: false,
  isLoading: false,
  maps: null,
  error: null,
  scriptElement: null,
  loadPromise: null,
  
  async initialize() {
    if (this.isInitialized && window.google?.maps) {
      console.log('GoogleMapsLoader: Already initialized');
      return window.google.maps;
    }

    if (this.loadPromise) {
      console.log('GoogleMapsLoader: Already loading, waiting...');
      return this.loadPromise;
    }

    console.log('GoogleMapsLoader: Starting initialization...');
    
    this.loadPromise = new Promise((resolve, reject) => {
      try {
        const envApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_API_KEY;
        
        if (!envApiKey) {
          throw new Error('Google Maps API key is missing');
        }

        console.log('GoogleMapsLoader: Checking API key:', {
          exists: !!envApiKey,
          length: envApiKey?.length,
          startsWithAIza: envApiKey?.startsWith('AIza')
        });

        // Check for existing script
        if (!this.scriptElement) {
          this.scriptElement = document.getElementById('google-maps-script');
        }

        // If script exists and Maps is loaded, resolve immediately
        if (this.scriptElement && window.google?.maps) {
          console.log('GoogleMapsLoader: Maps API already available');
          this.isInitialized = true;
          this.maps = window.google.maps;
          resolve(window.google.maps);
          return;
        }

        // Create callback
        const callbackName = `initGoogleMaps_${Date.now()}`;
        window[callbackName] = () => {
          if (!window.google?.maps) {
            const error = new Error('Google Maps failed to load properly');
            this.error = error;
            this.isInitialized = false;
            delete window[callbackName];
            reject(error);
            return;
          }

          console.log('GoogleMapsLoader: Maps API loaded successfully');
          this.isInitialized = true;
          this.maps = window.google.maps;
          delete window[callbackName];
          resolve(window.google.maps);
        };

        if (!this.scriptElement) {
          console.log('GoogleMapsLoader: Creating new script tag');
          const script = document.createElement('script');
          script.src = `https://maps.googleapis.com/maps/api/js?key=${envApiKey}&libraries=places&callback=${callbackName}&loading=async`;
          script.async = true;
          script.defer = true;
          script.id = 'google-maps-script';

          script.onerror = (e) => {
            const error = new Error('Failed to load Google Maps script');
            this.error = error;
            this.isInitialized = false;
            script.remove();
            this.scriptElement = null;
            delete window[callbackName];
            reject(error);
          };

          document.head.appendChild(script);
          this.scriptElement = script;
          console.log('GoogleMapsLoader: Script tag added to document');
        }
      } catch (error) {
        this.error = error;
        this.isInitialized = false;
        reject(error);
      }
    }).finally(() => {
      this.loadPromise = null;
    });

    return this.loadPromise;
  },

  cleanup() {
    if (this.scriptElement) {
      this.scriptElement.remove();
      this.scriptElement = null;
    }
    this.isInitialized = false;
    this.maps = null;
    this.error = null;
    this.loadPromise = null;
  }
};

// MapStateProvider with better state management
export const MapStateProvider = React.memo(({ children }) => {
  const [mapStates] = useState(() => new Map()); // Use Map to store multiple map states
  
  const value = useMemo(() => ({
    getMapState: (id = 'default') => {
      if (!mapStates.has(id)) {
        mapStates.set(id, {
          isInitialized: false,
          mapInstance: null
        });
      }
      return mapStates.get(id);
    },
    setMapState: (id = 'default', state) => {
      const currentState = mapStates.get(id) || {};
      mapStates.set(id, { ...currentState, ...state });
    }
  }), [mapStates]);

  return (
    <MapStateContext.Provider value={value}>
      {children}
    </MapStateContext.Provider>
  );
});

// Updated hook to use map state
export const useMapState = (mapId = 'default') => {
  const context = useContext(MapStateContext);
  if (context === undefined) {
    throw new Error('useMapState must be used within a MapStateProvider');
  }
  
  const mapState = context.getMapState(mapId);
  
  return {
    isInitialized: mapState.isInitialized,
    mapInstance: mapState.mapInstance,
    setInitialized: (value) => context.setMapState(mapId, { isInitialized: value }),
    setMapInstance: (instance) => context.setMapState(mapId, { mapInstance: instance })
  };
};

// Provider component
export const GoogleMapsProvider = React.memo(({ children }) => {
  const [state, setState] = useState({
    isLoaded: GlobalMapsState.isInitialized,
    error: GlobalMapsState.error,
    maps: GlobalMapsState.maps
  });

  useEffect(() => {
    let mounted = true;

    const initMaps = async () => {
      if (GlobalMapsState.isInitialized) {
        console.log('GoogleMapsProvider: Using existing initialization');
        setState({
          isLoaded: true,
          error: null,
          maps: GlobalMapsState.maps
        });
        return;
      }

      try {
        const maps = await GlobalMapsState.initialize();
        if (mounted) {
          setState({
            isLoaded: true,
            error: null,
            maps
          });
        }
      } catch (error) {
        console.error('GoogleMapsProvider: Error loading Maps:', error);
        if (mounted) {
          setState({
            isLoaded: false,
            error,
            maps: null
          });
        }
      }
    };

    initMaps();

    return () => {
      mounted = false;
    };
  }, []);

  const value = useMemo(() => ({
    isLoaded: state.isLoaded,
    error: state.error,
    maps: state.maps
  }), [state]);

  return (
    <GoogleMapsContext.Provider value={value}>
      {children}
    </GoogleMapsContext.Provider>
  );
});

// Update useGoogleMaps hook
export const useGoogleMaps = () => {
  const context = useContext(GoogleMapsContext);
  if (context === undefined) {
    throw new Error('useGoogleMaps must be used within a GoogleMapsProvider');
  }
  return context;
};

// Main component
const GoogleMapsLoader = React.memo(({ children }) => {
  return (
    <MapStateProvider>
      <GoogleMapsProvider>
        {children}
      </GoogleMapsProvider>
    </MapStateProvider>
  );
});

export default GoogleMapsLoader; 