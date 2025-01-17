import React from 'react';

export default function usePersistedState(key, defaultValue) {
  const [state, setState] = React.useState(() => {
    const persistedState = localStorage.getItem(key);
    return persistedState ? JSON.parse(persistedState) : defaultValue;
  });
  React.useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(state));
  }, [state, key]);
  return [state, setState];
}


export function getPersistedState(key,defaultValue){
    const persistedState = localStorage.getItem(key);
    return persistedState ? JSON.parse(persistedState) : defaultValue;
}

export function setPersistedState(key, value){
    window.localStorage.setItem(key, JSON.stringify(value));
}