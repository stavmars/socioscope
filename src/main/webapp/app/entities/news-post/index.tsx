import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import NewsPost from './news-post';
import NewsPostDetail from './news-post-detail';
import NewsPostUpdate from './news-post-update';
import NewsPostDeleteDialog from './news-post-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={NewsPostUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={NewsPostUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={NewsPostDetail} />
      <ErrorBoundaryRoute path={match.url} component={NewsPost} />
    </Switch>
    <ErrorBoundaryRoute path={`${match.url}/:id/delete`} component={NewsPostDeleteDialog} />
  </>
);

export default Routes;
