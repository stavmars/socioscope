import React from 'react';
import { Translate } from 'react-jhipster';

import { UncontrolledDropdown, DropdownToggle, DropdownMenu, NavItem, NavLink, NavbarBrand } from 'reactstrap';
import { NavLink as Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import appConfig from 'app/config/constants';

export const NavDropdown = props => (
  <UncontrolledDropdown nav inNavbar id={props.id}>
    <DropdownToggle nav caret className="d-flex align-items-center">
      <FontAwesomeIcon icon={props.icon} />
      <span>{props.name}</span>
    </DropdownToggle>
    <DropdownMenu right style={props.style}>
      {props.children}
    </DropdownMenu>
  </UncontrolledDropdown>
);

export const BrandIcon = props => (
  <div {...props} className="brand-icon">
    <img src="/content/images/Logo-white.svg" alt="Logo" />
  </div>
);

export const Brand = props => (
  <NavbarBrand tag={Link} to="/" className="brand-logo">
    <BrandIcon />
  </NavbarBrand>
);

export const Home = props => (
  <NavItem>
    <NavLink tag={Link} to="/" className="d-flex align-items-center">
      <span>
        <Translate contentKey="global.menu.home">Home</Translate>
      </span>
    </NavLink>
  </NavItem>
);
