import React, { useEffect } from 'react';
import { Route, RouteProps } from 'react-router-dom';
import ErrorBoundary from 'app/shared/error/error-boundary';
import { createBrowserHistory } from 'history';

export const ErrorBoundaryRoute = ({ component: Component, ...rest }: RouteProps) => {
  const customHistory = createBrowserHistory();

  useEffect(
    () => {
      const unlisten = customHistory.listen(() => {
        setTimeout(() => {
          window.scrollTo(0, 0);
        }, 0);
      });

      return () => {
        unlisten();
      };
    },
    [customHistory]
  );

  const encloseInErrorBoundary = props => (
    <ErrorBoundary>
      <Component {...props} />
    </ErrorBoundary>
  );

  if (!Component) throw new Error(`A component needs to be specified for path ${(rest as any).path}`);

  return <Route {...rest} render={encloseInErrorBoundary} />;
};

export default ErrorBoundaryRoute;
