import 'semantic-ui-css/semantic.min.css';
import 'react-toastify/dist/ReactToastify.css';
import './app.scss';

import React from 'react';
import { connect } from 'react-redux';
import { HashRouter as Router, Route, Switch, NavLink as Link } from 'react-router-dom';
import { toast, ToastContainer, ToastPosition } from 'react-toastify';
import { IRootState } from 'app/shared/reducers';
import { getSession } from 'app/shared/reducers/authentication';
import { getProfile } from 'app/shared/reducers/application-profile';
import { setLocale } from 'app/shared/reducers/locale';
import Footer from 'app/shared/layout/footer/footer';
import CookieConsent from 'react-cookie-consent';
import { hasAnyAuthority } from 'app/shared/auth/private-route';
import ErrorBoundary from 'app/shared/error/error-boundary';
import { AUTHORITIES } from 'app/config/constants';
import AppRoutes from 'app/routes';
import LoadingBar from 'react-redux-loading-bar';
import { Storage, Translate, translate } from 'react-jhipster';
import { Dimmer, Loader, Sidebar, Responsive, Menu, Icon, Image } from 'semantic-ui-react';
import {
  hideHeader,
  hideTopicsMenu,
  hideMobileMenu,
  toggleMobileMenu,
  hideMobileVisMenu,
  toggleMobileVisMenu
} from 'app/shared/reducers/header';
import Header from 'app/shared/layout/header/header';
import { getEntities } from 'app/entities/data-set/data-set.reducer';
import { TopicsMegaMenu } from 'app/shared/layout/header/topics-mega-menu';
import { MobileMenu } from './modules/mobile/mobile-menu';
import { MobileVisMenu } from './modules/mobile/mobile-vis-menu';

export interface IAppProps extends StateProps, DispatchProps {}

export class App extends React.Component<IAppProps> {
  componentDidMount() {
    this.props.getSession();
    this.props.getProfile();
    this.props.getEntities();
  }

  handleLocaleChange = () => {
    const langKey = this.props.currentLocale === 'el' ? 'en' : 'el';
    Storage.session.set('locale', langKey);
    this.props.setLocale(langKey);
  };

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
      const localeIcon =
        this.props.currentLocale === 'el' ? `/content/images/Assets/Lang-EN-white.svg` : `/content/images/Assets/Lang-EL-white.svg`;
      return (
        <Router>
          <div>
            {this.props.isHeaderVisible &&
              !this.props.isTopicsMenuVisible &&
              !this.props.isMobileMenuVisible && (
                <Switch>
                  <Route path="/about" render={() => <Header isFixed className="about-page-header" />} />
                  <Route path="/dataset" render={() => <div />} />
                  <Route path="/" render={() => <Header isFixed />} />
                </Switch>
              )}
            <Sidebar.Pushable>
              <Responsive {...Responsive.onlyMobile}>
                <Sidebar
                  as={Menu}
                  animation="overlay"
                  onHide={this.props.hideMobileMenu}
                  vertical
                  visible={this.props.isMobileMenuVisible}
                  style={{ width: '100%' }}
                >
                  <MobileMenu toggleMobileMenu={this.props.toggleMobileMenu} />
                </Sidebar>
                <Sidebar
                  as={Menu}
                  animation="overlay"
                  onHide={this.props.hideMobileVisMenu}
                  vertical
                  visible={this.props.isMobieleVisMenuVisible}
                  style={{ width: '100%' }}
                >
                  <MobileVisMenu toggleMobileVisMenu={this.props.toggleMobileVisMenu} />
                </Sidebar>
              </Responsive>
              <Responsive minWidth={Responsive.onlyTablet.minWidth}>
                <Sidebar animation="overlay" direction="top" onHide={this.props.hideTopicsMenu} visible={this.props.isTopicsMenuVisible}>
                  <TopicsMegaMenu />
                </Sidebar>
              </Responsive>
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
            <CookieConsent
              location="bottom"
              buttonText={translate('cookie.dismiss')}
              cookieName="myAwesomeCookieName2"
              style={{ background: '#2B373B' }}
              buttonStyle={{ color: '#4e503b', fontSize: '13px' }}
              expires={150}
            >
              {translate('cookie.message')}{' '}
              <a href="http://ec.europa.eu/ipg/basics/legal/cookies/index_en.htm">{translate('cookie.link')}</a>
            </CookieConsent>
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
  isMobileMenuVisible: header.isMobileMenuVisible,
  isMobieleVisMenuVisible: header.isMobileVisMenuVisible,
  loadingDatasets: dataSet.loading
});

const mapDispatchToProps = {
  setLocale,
  getSession,
  getProfile,
  hideTopicsMenu,
  hideHeader,
  hideMobileMenu,
  toggleMobileMenu,
  hideMobileVisMenu,
  toggleMobileVisMenu,
  getEntities
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
