import React, { Children, cloneElement, useMemo, isValidElement } from 'react';
import type { ReactElement } from 'react'; 
import { useCurrentPath } from './hooks';

interface RouteProps {
  path: string;
  component: React.ComponentType;
}

export const Route = ({ component: Component }: RouteProps) => {
  return <Component />;
};

interface RoutesProps {
  children: React.ReactNode;
}

export const Routes = ({ children }: RoutesProps) => {
  const currentPath = useCurrentPath();

  const activeRoute = useMemo(() => {
    const routes = Children.toArray(children).filter(isValidElement) as ReactElement<RouteProps>[];

    return routes.find((route) => route.props.path === currentPath);
  }, [children, currentPath]);

  if (!activeRoute) return null; 
  
  return cloneElement(activeRoute);
};