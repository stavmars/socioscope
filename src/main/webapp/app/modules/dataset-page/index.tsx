import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import DatasetPage from './dataset-page';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/:id/data`} component={DatasetPage} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/about`} component={DatasetPage} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={DatasetPage} />
    </Switch>
  </>
);

export default Routes;
