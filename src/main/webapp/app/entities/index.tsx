import React from 'react';
import { Switch } from 'react-router-dom';

// tslint:disable-next-line:no-unused-variable
import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import DataSet from './data-set';
import Dimension from './dimension';
import Measure from './measure';
import DimensionCode from './dimension-code';
/* jhipster-needle-add-route-import - JHipster will add routes here */

const Routes = ({ match }) => (
  <div>
    <Switch>
      {/* prettier-ignore */}
      <ErrorBoundaryRoute path={`${match.url}/data-set`} component={DataSet} />
      <ErrorBoundaryRoute path={`${match.url}/dimension`} component={Dimension} />
      <ErrorBoundaryRoute path={`${match.url}/measure`} component={Measure} />
      <ErrorBoundaryRoute path={`${match.url}/dimension-code`} component={DimensionCode} />
      {/* jhipster-needle-add-route-path - JHipster will routes here */}
    </Switch>
  </div>
);

export default Routes;
