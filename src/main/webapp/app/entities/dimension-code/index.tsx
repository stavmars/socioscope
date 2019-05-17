import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import DimensionCode from './dimension-code';
import DimensionCodeDetail from './dimension-code-detail';
import DimensionCodeUpdate from './dimension-code-update';
import DimensionCodeDeleteDialog from './dimension-code-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={DimensionCodeUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={DimensionCodeUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={DimensionCodeDetail} />
      <ErrorBoundaryRoute path={match.url} component={DimensionCode} />
    </Switch>
    <ErrorBoundaryRoute path={`${match.url}/:id/delete`} component={DimensionCodeDeleteDialog} />
  </>
);

export default Routes;
