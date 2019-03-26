import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Dimension from './dimension';
import DimensionDetail from './dimension-detail';
import DimensionUpdate from './dimension-update';
import DimensionDeleteDialog from './dimension-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={DimensionUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={DimensionUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={DimensionDetail} />
      <ErrorBoundaryRoute path={match.url} component={Dimension} />
    </Switch>
    <ErrorBoundaryRoute path={`${match.url}/:id/delete`} component={DimensionDeleteDialog} />
  </>
);

export default Routes;
