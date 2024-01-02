'use client'
import { createContext, useContext, useReducer } from 'react';

// Define the initial state and reducer function
const initialState = {
  data: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_DATA':
      return { ...state, data: action.payload };
    default:
      return state;
  }
};

const GlobalStateContext = createContext();

const GlobalStateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <GlobalStateContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = () => useContext(GlobalStateContext);

export default GlobalStateProvider;
