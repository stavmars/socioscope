import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import DataSet from './data-set';
import DataSetDetail from './data-set-detail';
import DataSetUpdate from './data-set-update';
import DataSetDeleteDialog from './data-set-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={DataSetUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={DataSetUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={DataSetDetail} />
      <ErrorBoundaryRoute path={match.url} component={DataSet} />
    </Switch>
    <ErrorBoundaryRoute path={`${match.url}/:id/delete`} component={DataSetDeleteDialog} />
  </>
);

export default Routes;
