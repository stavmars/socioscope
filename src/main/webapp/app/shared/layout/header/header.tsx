import './header.scss';

import React from 'react';
import { Storage, Translate } from 'react-jhipster';
import { Image, Menu } from 'semantic-ui-react';
import { AccountMenu, AdminMenu, EntitiesMenu } from './menus';
import { NavLink as Link } from 'react-router-dom';
import { IRootState } from 'app/shared/reducers';
import { hasAnyAuthority } from 'app/shared/auth/private-route';
import { AUTHORITIES } from 'app/config/constants';
import { setLocale } from 'app/shared/reducers/locale';
import { connect } from 'react-redux';

export interface IHeaderProps extends StateProps, DispatchProps {
  isFixed: boolean;
  className?: string;
}

export interface IHeaderState {
  menuOpen: boolean;
}

export class Header extends React.Component<IHeaderProps, IHeaderState> {
  state: IHeaderState = {
    menuOpen: false
  };

  handleLocaleChange = () => {
    const langKey = this.props.currentLocale === 'el' ? 'en' : 'el';
    Storage.session.set('locale', langKey);
    this.props.setLocale(langKey);
  };

  render() {
    const { currentLocale, isAuthenticated, isAdmin, isSwaggerEnabled, isFixed, className } = this.props;
    const color = className === 'home-page-header' ? 'white' : 'black';
    const localeIcon =
      currentLocale === 'el' ? `/content/images/Assets/Lang-EN-${color}.svg` : `/content/images/Assets/Lang-EL-${color}.svg`;

    return (
      <div className={`app-header ${className || ''}`}>
        <Menu className="app-header-menu" text fixed={isFixed ? 'top' : null}>
          <Menu.Item position="left" header as="a" href="/" style={{ padding: '20px 0 20px 0' }}>
            <Image src={`/content/images/Assets/Logo-${color}.png`} alt="Socioscope Logo" style={{ height: '40px', width: 'auto' }} />
          </Menu.Item>
          <Menu.Item as={Link} to="/">
            <Translate contentKey="global.menu.home">Home</Translate>
          </Menu.Item>
          {/*<TopicsMenu/>*/}
          <Menu.Item as={Link} to="/about">
            <Translate contentKey="global.menu.about">About</Translate>
          </Menu.Item>
          {isAuthenticated && <EntitiesMenu />}
          {isAuthenticated && isAdmin && <AdminMenu showSwagger={isSwaggerEnabled} />}
          {isAuthenticated && <AccountMenu />}
          <Menu.Item style={{ paddingLeft: '60px' }}>
            <Image src={`/content/images/Assets/Search-${color}.svg`} alt="search button" style={{ width: '32.5px', height: 'auto' }} />
          </Menu.Item>
          <Menu.Item onClick={this.handleLocaleChange} style={{ paddingLeft: '60px' }}>
            <Image src={localeIcon} alt="language switcher" style={{ width: '40px', height: 'auto' }} />
          </Menu.Item>
        </Menu>
      </div>
    );
  }
}

const mapStateToProps = ({ authentication, applicationProfile, locale, header }: IRootState) => ({
  currentLocale: locale.currentLocale,
  isAuthenticated: authentication.isAuthenticated,
  isAdmin: hasAnyAuthority(authentication.account.authorities, [AUTHORITIES.ADMIN]),
  isSwaggerEnabled: applicationProfile.isSwaggerEnabled
});

const mapDispatchToProps = { setLocale };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);
