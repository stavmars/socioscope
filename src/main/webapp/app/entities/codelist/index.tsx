import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Codelist from './codelist';
import CodelistDetail from './codelist-detail';
import CodelistUpdate from './codelist-update';
import CodelistDeleteDialog from './codelist-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={CodelistUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={CodelistUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={CodelistDetail} />
      <ErrorBoundaryRoute path={match.url} component={Codelist} />
    </Switch>
    <ErrorBoundaryRoute path={`${match.url}/:id/delete`} component={CodelistDeleteDialog} />
  </>
);

export default Routes;
