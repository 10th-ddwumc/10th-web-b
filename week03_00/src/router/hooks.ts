import { useState, useEffect } from 'react';

export const PUSHSTATE_EVENT = 'pushstate_change';

export const getCurrentPath = () => window.location.pathname;

export const navigateTo = (to: string) => {
  window.history.pushState({}, '', to); 
  const navigationEvent = new Event(PUSHSTATE_EVENT);
  window.dispatchEvent(navigationEvent); 
};

export const useCurrentPath = () => {
  const [path, setPath] = useState(getCurrentPath());

  useEffect(() => {
    const handlePathChange = () => setPath(getCurrentPath());

    window.addEventListener(PUSHSTATE_EVENT, handlePathChange);

    window.addEventListener('popstate', handlePathChange);

    return () => {
      window.removeEventListener(PUSHSTATE_EVENT, handlePathChange);
      window.removeEventListener('popstate', handlePathChange);
    };
  }, []);

  return path;
};