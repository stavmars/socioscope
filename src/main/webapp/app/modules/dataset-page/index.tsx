import React from 'react';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import DatasetPage from './dataset-page';
import { Switch } from 'react-router';
import DatasetPageVis from 'app/modules/dataset-page/dataset-page-vis';
import DatasetPageHighlights from 'app/modules/dataset-page/dataset-page-highlights';
import DatasetPageAbout from 'app/modules/dataset-page/dataset-page-about';

const Routes = ({ match }) => (
  <>
    <ErrorBoundaryRoute path={`${match.url}/:id`} component={DatasetPage} />
  </>
);

export default Routes;
