'use client';

import { createContext, useContext, useReducer, useEffect, useState } from 'react';

const initialState = {
  data: null,
  isAuthenticated: false,
  appTheme: 'dark', // 'dark' | 'light'
};

const STORAGE_KEY = 'devlinks_state';

function loadState() {
  if (typeof window === 'undefined') return initialState;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;
    const parsed = JSON.parse(raw);
    return {
      ...initialState,
      ...parsed,
    };
  } catch {
    return initialState;
  }
}

function saveState(state) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Failed to persist state:', e);
  }
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_DATA':
      return { ...state, data: action.payload };
    case 'LOG_IN':
      return { ...state, isAuthenticated: true };
    case 'LOG_OUT':
      return { ...state, isAuthenticated: false, data: null };
    case 'TOGGLE_APP_THEME':
      return { ...state, appTheme: state.appTheme === 'dark' ? 'light' : 'dark' };
    case 'SET_APP_THEME':
      return { ...state, appTheme: action.payload };
    default:
      return state;
  }
};

const GlobalStateContext = createContext();

const GlobalStateProvider = ({ children }) => {
  // Hydration-safe: start with initialState, then load from localStorage after mount
  const [state, dispatch] = useReducer(reducer, initialState);
  const [hydrated, setHydrated] = useState(false);

  // On mount, load persisted state
  useEffect(() => {
    const persisted = loadState();
    if (persisted.isAuthenticated || persisted.appTheme !== 'dark' || persisted.data) {
      if (persisted.data) {
        dispatch({ type: 'SET_DATA', payload: persisted.data });
      }
      if (persisted.isAuthenticated) {
        dispatch({ type: 'LOG_IN' });
      }
      if (persisted.appTheme) {
        dispatch({ type: 'SET_APP_THEME', payload: persisted.appTheme });
      }
    }
    setHydrated(true);
  }, []);

  // Persist state to localStorage whenever it changes
  useEffect(() => {
    if (!hydrated) return;
    saveState(state);
  }, [state, hydrated]);

  // Sync html element class with appTheme
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      if (state.appTheme === 'dark') {
        root.classList.add('dark');
        root.classList.remove('light');
      } else {
        root.classList.add('light');
        root.classList.remove('dark');
      }
    }
  }, [state.appTheme]);

  return (
    <GlobalStateContext.Provider value={{ state, dispatch, hydrated }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = () => useContext(GlobalStateContext);

export default GlobalStateProvider;
