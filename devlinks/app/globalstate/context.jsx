'use client';

import { createContext, useContext, useReducer, useEffect } from 'react';

const initialState = {
  data: null,
  isAuthenticated: false,
  appTheme: 'dark', // 'dark' | 'light'
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_DATA':
      return { ...state, data: action.payload };
    case 'LOG_IN':
      return { ...state, isAuthenticated: true };
    case 'LOG_OUT':
      return { ...state, isAuthenticated: false };
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
  const [state, dispatch] = useReducer(reducer, initialState);

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
    <GlobalStateContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = () => useContext(GlobalStateContext);

export default GlobalStateProvider;
