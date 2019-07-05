import 'semantic-ui-css/semantic.min.css';
import 'react-toastify/dist/ReactToastify.css';
import './app.scss';

import React from 'react';
import { connect } from 'react-redux';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import { toast, ToastContainer, ToastPosition } from 'react-toastify';
import { IRootState } from 'app/shared/reducers';
import { getSession } from 'app/shared/reducers/authentication';
import { getProfile } from 'app/shared/reducers/application-profile';
import { setLocale } from 'app/shared/reducers/locale';
import Footer from 'app/shared/layout/footer/footer';
import { hasAnyAuthority } from 'app/shared/auth/private-route';
import ErrorBoundary from 'app/shared/error/error-boundary';
import { AUTHORITIES } from 'app/config/constants';
import AppRoutes from 'app/routes';
import LoadingBar from 'react-redux-loading-bar';
import { Translate } from 'react-jhipster';
import { Dimmer, Loader, Sidebar } from 'semantic-ui-react';
import { hideHeader, hideTopicsMenu } from 'app/shared/reducers/header';
import Header from 'app/shared/layout/header/header';
import { getEntities } from 'app/entities/data-set/data-set.reducer';
import { TopicsMegaMenu } from 'app/shared/layout/header/topics-mega-menu';

export interface IAppProps extends StateProps, DispatchProps {}

export class App extends React.Component<IAppProps> {
  componentDidMount() {
    this.props.getSession();
    this.props.getProfile();
    this.props.getEntities();
  }

  renderDevRibbon = () =>
    this.props.isInProduction === false ? (
      <div className="ribbon dev">
        <a href="">
          <Translate contentKey={`global.ribbon.${this.props.ribbonEnv}`} />
        </a>
      </div>
    ) : null;

  // tslint:disable:jsx-no-lambda
  render() {
    if (this.props.loadingDatasets) {
      return (
        <Dimmer active>
          <Loader />
        </Dimmer>
      );
    } else {
      return (
        <Router>
          <div>
            {this.props.isHeaderVisible &&
              !this.props.isTopicsMenuVisible && (
                <Switch>
                  <Route path="/about" render={() => <Header isFixed className="about-page-header" />} />
                  <Route path="/" render={() => <Header isFixed />} />
                </Switch>
              )}
            <Sidebar.Pushable>
              <Sidebar animation="overlay" direction="top" onHide={this.props.hideTopicsMenu} visible={this.props.isTopicsMenuVisible}>
                <TopicsMegaMenu />
              </Sidebar>
              <Sidebar.Pusher>
                <div className="app-container">
                  {this.renderDevRibbon()}
                  <LoadingBar className="loading-bar" />
                  <ToastContainer
                    position={toast.POSITION.TOP_LEFT as ToastPosition}
                    className="toastify-container"
                    toastClassName="toastify-toast"
                  />
                  <ErrorBoundary>
                    <AppRoutes {...this.props} />
                  </ErrorBoundary>
                  <Footer />
                </div>
              </Sidebar.Pusher>
            </Sidebar.Pushable>
          </div>
        </Router>
      );
    }
  }
}

const mapStateToProps = ({ authentication, applicationProfile, locale, header, dataSet }: IRootState) => ({
  currentLocale: locale.currentLocale,
  isAuthenticated: authentication.isAuthenticated,
  isAdmin: hasAnyAuthority(authentication.account.authorities, [AUTHORITIES.ADMIN]),
  ribbonEnv: applicationProfile.ribbonEnv,
  isInProduction: applicationProfile.inProduction,
  isHeaderVisible: header.isHeaderVisible,
  isTopicsMenuVisible: header.isTopicsMenuVisible,
  loadingDatasets: dataSet.loading
});

const mapDispatchToProps = { setLocale, getSession, getProfile, hideTopicsMenu, hideHeader, getEntities };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
