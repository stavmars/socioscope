import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import DatasetPage from './dataset-page';
import DatasetPageAbout from './dataset-page-about';
import DatasetPageHighlights from './dataset-page-highlights';

const Routes = ({ match }) => (
  <>
    <ErrorBoundaryRoute path={`${match.url}/:id`} component={DatasetPage} />
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/:id/data`} component={DatasetPage} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/`} component={DatasetPageHighlights} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/about`} component={DatasetPageAbout} />
    </Switch>
  </>
);

export default Routes;
