import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const ThemeContext = createContext();

// Theme constants
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  AUTO: 'auto'
};

// Color schemes
export const COLOR_SCHEMES = {
  DEFAULT: 'default',
  BLUE: 'blue',
  GREEN: 'green',
  PURPLE: 'purple',
  ORANGE: 'orange'
};

// Font sizes
export const FONT_SIZES = {
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large'
};

// Action types
const THEME_ACTIONS = {
  SET_THEME: 'SET_THEME',
  SET_COLOR_SCHEME: 'SET_COLOR_SCHEME',
  SET_FONT_SIZE: 'SET_FONT_SIZE',
  SET_SYSTEM_THEME: 'SET_SYSTEM_THEME',
  TOGGLE_THEME: 'TOGGLE_THEME',
  RESET_THEME: 'RESET_THEME'
};

// Initial state
const initialState = {
  theme: THEMES.LIGHT,
  colorScheme: COLOR_SCHEMES.DEFAULT,
  fontSize: FONT_SIZES.MEDIUM,
  systemTheme: THEMES.LIGHT,
  isDark: false
};

// Reducer
const themeReducer = (state, action) => {
  switch (action.type) {
    case THEME_ACTIONS.SET_THEME:
      const newTheme = action.payload;
      const isDark = newTheme === THEMES.AUTO 
        ? state.systemTheme === THEMES.DARK
        : newTheme === THEMES.DARK;
      
      return {
        ...state,
        theme: newTheme,
        isDark
      };

    case THEME_ACTIONS.SET_COLOR_SCHEME:
      return {
        ...state,
        colorScheme: action.payload
      };

    case THEME_ACTIONS.SET_FONT_SIZE:
      return {
        ...state,
        fontSize: action.payload
      };

    case THEME_ACTIONS.SET_SYSTEM_THEME:
      const systemTheme = action.payload;
      const isDarkWithSystem = state.theme === THEMES.AUTO 
        ? systemTheme === THEMES.DARK
        : state.isDark;
      
      return {
        ...state,
        systemTheme,
        isDark: isDarkWithSystem
      };

    case THEME_ACTIONS.TOGGLE_THEME:
      const toggledTheme = state.theme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK;
      return {
        ...state,
        theme: toggledTheme,
        isDark: toggledTheme === THEMES.DARK
      };

    case THEME_ACTIONS.RESET_THEME:
      return {
        ...initialState,
        systemTheme: state.systemTheme
      };

    default:
      return state;
  }
};

// Provider component
export const ThemeProvider = ({ children }) => {
  const [storedTheme, setStoredTheme] = useLocalStorage('theme', THEMES.LIGHT);
  const [storedColorScheme, setStoredColorScheme] = useLocalStorage('colorScheme', COLOR_SCHEMES.DEFAULT);
  const [storedFontSize, setStoredFontSize] = useLocalStorage('fontSize', FONT_SIZES.MEDIUM);
  
  const [state, dispatch] = useReducer(themeReducer, {
    ...initialState,
    theme: storedTheme,
    colorScheme: storedColorScheme,
    fontSize: storedFontSize
  });

  // Detect system theme preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const systemTheme = mediaQuery.matches ? THEMES.DARK : THEMES.LIGHT;
    
    dispatch({ type: THEME_ACTIONS.SET_SYSTEM_THEME, payload: systemTheme });

    const handleChange = (e) => {
      const newSystemTheme = e.matches ? THEMES.DARK : THEMES.LIGHT;
      dispatch({ type: THEME_ACTIONS.SET_SYSTEM_THEME, payload: newSystemTheme });
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    
    // Remove existing theme classes
    root.classList.remove('theme-light', 'theme-dark');
    root.classList.remove('color-default', 'color-blue', 'color-green', 'color-purple', 'color-orange');
    root.classList.remove('font-small', 'font-medium', 'font-large');
    
    // Apply current theme
    root.classList.add(`theme-${state.isDark ? 'dark' : 'light'}`);
    root.classList.add(`color-${state.colorScheme}`);
    root.classList.add(`font-${state.fontSize}`);
    
    // Set CSS custom properties
    root.style.setProperty('--theme-mode', state.isDark ? 'dark' : 'light');
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', state.isDark ? '#1a1a1a' : '#ffffff');
    }
  }, [state.isDark, state.colorScheme, state.fontSize]);

  // Set theme
  const setTheme = (theme) => {
    dispatch({ type: THEME_ACTIONS.SET_THEME, payload: theme });
    setStoredTheme(theme);
  };

  // Set color scheme
  const setColorScheme = (colorScheme) => {
    dispatch({ type: THEME_ACTIONS.SET_COLOR_SCHEME, payload: colorScheme });
    setStoredColorScheme(colorScheme);
  };

  // Set font size
  const setFontSize = (fontSize) => {
    dispatch({ type: THEME_ACTIONS.SET_FONT_SIZE, payload: fontSize });
    setStoredFontSize(fontSize);
  };

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = state.theme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK;
    setTheme(newTheme);
  };

  // Reset to default theme
  const resetTheme = () => {
    dispatch({ type: THEME_ACTIONS.RESET_THEME });
    setStoredTheme(THEMES.LIGHT);
    setStoredColorScheme(COLOR_SCHEMES.DEFAULT);
    setStoredFontSize(FONT_SIZES.MEDIUM);
  };

  // Get theme colors
  const getThemeColors = () => {
    const colors = {
      [COLOR_SCHEMES.DEFAULT]: {
        primary: state.isDark ? '#007bff' : '#0056b3',
        secondary: state.isDark ? '#6c757d' : '#495057',
        success: state.isDark ? '#28a745' : '#155724',
        danger: state.isDark ? '#dc3545' : '#721c24',
        warning: state.isDark ? '#ffc107' : '#856404',
        info: state.isDark ? '#17a2b8' : '#0c5460',
        background: state.isDark ? '#121212' : '#ffffff',
        surface: state.isDark ? '#1e1e1e' : '#f8f9fa',
        text: state.isDark ? '#ffffff' : '#212529'
      },
      [COLOR_SCHEMES.BLUE]: {
        primary: state.isDark ? '#2196f3' : '#1976d2',
        secondary: state.isDark ? '#90caf9' : '#42a5f5',
        background: state.isDark ? '#0d1421' : '#f3f8ff',
        surface: state.isDark ? '#1a2332' : '#e3f2fd',
        text: state.isDark ? '#e3f2fd' : '#1565c0'
      },
      [COLOR_SCHEMES.GREEN]: {
        primary: state.isDark ? '#4caf50' : '#388e3c',
        secondary: state.isDark ? '#a5d6a7' : '#66bb6a',
        background: state.isDark ? '#0f1b0f' : '#f1f8e9',
        surface: state.isDark ? '#1b2e1b' : '#e8f5e8',
        text: state.isDark ? '#c8e6c9' : '#2e7d32'
      },
      [COLOR_SCHEMES.PURPLE]: {
        primary: state.isDark ? '#9c27b0' : '#7b1fa2',
        secondary: state.isDark ? '#ce93d8' : '#ab47bc',
        background: state.isDark ? '#1a0e1a' : '#fce4ec',
        surface: state.isDark ? '#2e1b2e' : '#f3e5f5',
        text: state.isDark ? '#e1bee7' : '#6a1b9a'
      },
      [COLOR_SCHEMES.ORANGE]: {
        primary: state.isDark ? '#ff9800' : '#f57c00',
        secondary: state.isDark ? '#ffcc02' : '#ffb74d',
        background: state.isDark ? '#1f1611' : '#fff8e1',
        surface: state.isDark ? '#332a1f' : '#ffecb3',
        text: state.isDark ? '#ffe0b2' : '#e65100'
      }
    };

    return colors[state.colorScheme] || colors[COLOR_SCHEMES.DEFAULT];
  };

  // Check if user prefers reduced motion
  const prefersReducedMotion = () => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  };

  // Get contrast ratio for accessibility
  const getContrastRatio = (color1, color2) => {
    const getLuminance = (color) => {
      const rgb = parseInt(color.slice(1), 16);
      const r = (rgb >> 16) & 0xff;
      const g = (rgb >> 8) & 0xff;
      const b = (rgb >> 0) & 0xff;
      
      const [rs, gs, bs] = [r, g, b].map(c => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      
      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    };

    const lum1 = getLuminance(color1);
    const lum2 = getLuminance(color2);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    
    return (brightest + 0.05) / (darkest + 0.05);
  };

  const value = {
    // State
    ...state,
    
    // Constants
    THEMES,
    COLOR_SCHEMES,
    FONT_SIZES,
    
    // Actions
    setTheme,
    setColorScheme,
    setFontSize,
    toggleTheme,
    resetTheme,
    
    // Utilities
    getThemeColors,
    prefersReducedMotion,
    getContrastRatio
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook to use theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Higher-order component for theme-aware components
export const withTheme = (Component) => {
  return function ThemedComponent(props) {
    const theme = useTheme();
    return <Component {...props} theme={theme} />;
  };
};