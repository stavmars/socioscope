import React from 'react';
import { Route, RouteProps } from 'react-router-dom';
import ErrorBoundary from 'app/shared/error/error-boundary';
import { createBrowserHistory } from 'history';

export const ErrorBoundaryRoute = ({ component: Component, ...rest }: RouteProps) => {
  const encloseInErrorBoundary = props => (
    <ErrorBoundary>
      <Component {...props} />
    </ErrorBoundary>
  );

  if (!Component) throw new Error(`A component needs to be specified for path ${(rest as any).path}`);

  return (
    <Route
      history={createBrowserHistory().listen(location => {
        setTimeout(() => {
          window.scrollTo(0, 0);
        });
      })}
      {...rest}
      render={encloseInErrorBoundary}
    />
  );
};

export default ErrorBoundaryRoute;
