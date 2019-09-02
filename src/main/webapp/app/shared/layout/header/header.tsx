import './header.scss';

import React from 'react';
import { Storage, Translate } from 'react-jhipster';
import { Image, Menu, Responsive, Icon } from 'semantic-ui-react';
import { AccountMenu, AdminMenu, EntitiesMenu } from './menus';
import { NavLink } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { IRootState } from 'app/shared/reducers';
import { hasAnyAuthority } from 'app/shared/auth/private-route';
import { AUTHORITIES } from 'app/config/constants';
import { setLocale } from 'app/shared/reducers/locale';
import { connect } from 'react-redux';
import { toggleTopicsMenu, toggleMobileMenu } from 'app/shared/reducers/header';

export interface IHeaderProps extends StateProps, DispatchProps {
  isFixed: boolean;
  className?: string;
}

export class Header extends React.Component<IHeaderProps, {}> {
  handleLocaleChange = () => {
    const langKey = this.props.currentLocale === 'el' ? 'en' : 'el';
    Storage.session.set('locale', langKey);
    this.props.setLocale(langKey);
  };

  isMenuItemActive = match => match && !this.props.isTopicsMenuVisible;

  render() {
    const { currentLocale, isAuthenticated, isAdmin, isSwaggerEnabled, isFixed, className } = this.props;
    const color = className === 'home-page-header' ? 'white' : 'black';
    const mobileAboutPage = className === 'about-page-header' ? 'top' : null;
    const localeIcon =
      currentLocale === 'el' ? `/content/images/Assets/Lang-EN-${color}.svg` : `/content/images/Assets/Lang-EL-${color}.svg`;

    return (
      <div>
        <Responsive {...Responsive.onlyMobile}>
          {className && className.includes('color-scheme') ? (
            <Menu
              inverted
              pointing
              secondary
              fixed={mobileAboutPage}
              style={{ backgroundColor: mobileAboutPage ? 'white' : null, borderStyle: 'none' }}
            >
              <Menu.Item position="left" header as="a" href="/" style={{ padding: '18px 0 17px 15px' }}>
                <Image src="/content/images/Assets/icon-white.svg" />
              </Menu.Item>
              <Menu.Item onClick={this.props.toggleMobileMenu} style={{ padding: '21px 20px 21px 18px' }}>
                <Image src="/content/images/Assets/Mobile-Sidebar-white.svg" />
              </Menu.Item>
            </Menu>
          ) : (
            <Menu
              inverted
              pointing
              secondary
              fixed={mobileAboutPage}
              style={{ backgroundColor: mobileAboutPage ? 'white' : null, borderStyle: 'none' }}
            >
              <Menu.Item position="left" header as="a" href="/" style={{ padding: '18px 0 17px 15px' }}>
                <Image src={`/content/images/Assets/Logo-${color}.png`} alt="Socioscope Logo" style={{ height: '35', width: '144px' }} />
              </Menu.Item>
              <Menu.Item onClick={this.handleLocaleChange} style={{ padding: '14px 0 13px 60px' }}>
                <Image src={localeIcon} alt="language switcher" style={{ width: '27px', height: '27px' }} />
              </Menu.Item>
              <Menu.Item onClick={this.props.toggleMobileMenu} style={{ padding: '21px 20px 21px 18px' }}>
                <Image src={`/content/images/Assets/Mobile-Sidebar-${color}.svg`} />
              </Menu.Item>
            </Menu>
          )}
        </Responsive>
        <Responsive minWidth={Responsive.onlyTablet.minWidth}>
          <div className={`app-header ${className || ''}`}>
            <Menu className={`app-header-menu ${className || ''}`} text fixed={isFixed ? 'top' : null}>
              <Menu.Item position="left" header as="a" href="/" style={{ padding: '20px 0 20px 0' }}>
                <Image src={`/content/images/Assets/Logo-${color}.png`} alt="Socioscope Logo" style={{ height: '40px', width: 'auto' }} />
              </Menu.Item>
              <Menu.Item as={NavLink} to="/" exact isActive={this.isMenuItemActive}>
                <Translate contentKey="global.menu.home">Home</Translate>
              </Menu.Item>
              <Menu.Item onClick={this.props.toggleTopicsMenu} active={this.props.isTopicsMenuVisible}>
                <Translate contentKey="global.menu.topics">Topics</Translate>
              </Menu.Item>
              <Menu.Item as={HashLink} to="/about#project" exact isActive={this.isMenuItemActive}>
                <Translate contentKey="global.menu.about">About</Translate>
              </Menu.Item>
              {isAuthenticated && <EntitiesMenu />}
              {isAuthenticated && isAdmin && <AdminMenu showSwagger={isSwaggerEnabled} />}
              {isAuthenticated && <AccountMenu />}
              <Menu.Item>
                <Image src={`/content/images/Assets/Search-${color}.svg`} alt="search button" style={{ width: '32.5px', height: 'auto' }} />
              </Menu.Item>
              <Menu.Item onClick={this.handleLocaleChange}>
                <Image src={localeIcon} alt="language switcher" style={{ width: '40px', height: 'auto' }} />
              </Menu.Item>
            </Menu>
          </div>
        </Responsive>
      </div>
    );
  }
}

const mapStateToProps = ({ authentication, applicationProfile, locale, header }: IRootState) => ({
  currentLocale: locale.currentLocale,
  isAuthenticated: authentication.isAuthenticated,
  isAdmin: hasAnyAuthority(authentication.account.authorities, [AUTHORITIES.ADMIN]),
  isSwaggerEnabled: applicationProfile.isSwaggerEnabled,
  isTopicsMenuVisible: header.isTopicsMenuVisible
});

const mapDispatchToProps = { setLocale, toggleTopicsMenu, toggleMobileMenu };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);
