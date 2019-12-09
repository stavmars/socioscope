import React from 'react';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';
import Blog from './blog';

const Routes = ({ match }) => (
  <>
    <ErrorBoundaryRoute path={`${match.url}`} component={Blog} />
  </>
);

export default Routes;
