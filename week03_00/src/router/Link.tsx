import React from 'react';
import type { MouseEvent } from 'react';

import { getCurrentPath, navigateTo } from './hooks';

interface LinkProps {
  to: string;
  children: React.ReactNode;
}

export const Link = ({ to, children }: LinkProps) => {
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    
    if (getCurrentPath() === to) return; 
    
    navigateTo(to);
  };

  return (
    <a href={to} onClick={handleClick}>
      {children}
    </a>
  );
};