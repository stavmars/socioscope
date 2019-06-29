import React from 'react';
import { NavLink as Link } from 'react-router-dom';
import { Translate, translate } from 'react-jhipster';
import { Dropdown } from 'semantic-ui-react';

export const AccountMenu = () => (
  <Dropdown item simple text={translate('global.menu.account.main')} id="account-menu">
    <Dropdown.Menu>
      <Dropdown.Item as={Link} to="/account/settings" icon="wrench" text={translate('global.menu.account.settings')} />
      <Dropdown.Item as={Link} to="/account/password" icon="clock" text={translate('global.menu.account.password')} />
      <Dropdown.Item as={Link} to="/logout" icon="sign-out" text={translate('global.menu.account.logout')} />
    </Dropdown.Menu>
  </Dropdown>
);

export default AccountMenu;
