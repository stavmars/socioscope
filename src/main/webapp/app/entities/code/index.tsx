import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Code from './code';
import CodeDetail from './code-detail';
import CodeUpdate from './code-update';
import CodeDeleteDialog from './code-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={CodeUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={CodeUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={CodeDetail} />
      <ErrorBoundaryRoute path={match.url} component={Code} />
    </Switch>
    <ErrorBoundaryRoute path={`${match.url}/:id/delete`} component={CodeDeleteDialog} />
  </>
);

export default Routes;
