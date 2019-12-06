import React from 'react';
import { RouteComponentProps, Switch, withRouter } from 'react-router-dom';
import Loadable from 'react-loadable';

import Login from 'app/modules/login/login';
import Register from 'app/modules/account/register/register';
import Activate from 'app/modules/account/activate/activate';
import PasswordResetInit from 'app/modules/account/password-reset/init/password-reset-init';
import PasswordResetFinish from 'app/modules/account/password-reset/finish/password-reset-finish';
import Logout from 'app/modules/login/logout';
import Home from 'app/modules/home/home';
import About from 'app/modules/about/about';
import Entities from 'app/entities';
import DataSetPage from 'app/modules/dataset-page';
import PrivateRoute from 'app/shared/auth/private-route';
import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';
import { AUTHORITIES } from 'app/config/constants';
import { hideTopicsMenu, showTopicsMenu, hideMobileMenu } from 'app/shared/reducers/header';
import { connect } from 'react-redux';
import Blog from 'app/modules/blog';

// tslint:disable:space-in-parens
const Account = Loadable({
  loader: () => import(/* webpackChunkName: "account" */ 'app/modules/account'),
  loading: () => <div>loading ...</div>
});

const Admin = Loadable({
  loader: () => import(/* webpackChunkName: "administration" */ 'app/modules/administration'),
  loading: () => <div>loading ...</div>
});
// tslint:enable

export interface IRoutesProps extends DispatchProps, RouteComponentProps<any> {}

export class Routes extends React.Component<IRoutesProps> {
  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.props.hideTopicsMenu();
      this.props.hideMobileMenu();
    }
  }

  render() {
    return (
      <div className="view-routes">
        <ErrorBoundaryRoute path="/login" component={Login} />
        <Switch>
          <ErrorBoundaryRoute path="/logout" component={Logout} />
          <ErrorBoundaryRoute path="/register" component={Register} />
          <ErrorBoundaryRoute path="/activate/:key?" component={Activate} />
          <ErrorBoundaryRoute path="/reset/request" component={PasswordResetInit} />
          <ErrorBoundaryRoute path="/reset/finish/:key?" component={PasswordResetFinish} />
          <PrivateRoute path="/admin" component={Admin} hasAnyAuthorities={[AUTHORITIES.ADMIN]} />
          <PrivateRoute path="/account" component={Account} hasAnyAuthorities={[AUTHORITIES.ADMIN, AUTHORITIES.USER]} />
          <PrivateRoute path="/entity" component={Entities} hasAnyAuthorities={[AUTHORITIES.USER]} />
          <ErrorBoundaryRoute path="/dataset" component={DataSetPage} />
          <ErrorBoundaryRoute path="/about" component={About} />
          <ErrorBoundaryRoute path="/blog" component={Blog} />
          <ErrorBoundaryRoute path="/" component={Home} />
        </Switch>
      </div>
    );
  }
}

const mapDispatchToProps = { hideTopicsMenu, hideMobileMenu };

type DispatchProps = typeof mapDispatchToProps;

export default withRouter(
  connect(
    null,
    mapDispatchToProps
  )(Routes)
);
