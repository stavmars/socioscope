import React from 'react';
import { NavLink as Link } from 'react-router-dom';
import { Translate, translate } from 'react-jhipster';
import { Dropdown, Icon } from 'semantic-ui-react';

const adminMenuItems = (
  <>
    <Dropdown.Item as={Link} to="/admin/user-management">
      <Icon name="user" />
      <Translate contentKey="global.menu.account.settings">User management</Translate>
    </Dropdown.Item>
    <Dropdown.Item as={Link} to="/admin/metrics">
      <Icon name="tachometer alternate" />
      <Translate contentKey="global.menu.admin.metrics">Metrics</Translate>
    </Dropdown.Item>
    <Dropdown.Item as={Link} to="/admin/health">
      <Icon name="heart" />
      <Translate contentKey="global.menu.admin.health">Health</Translate>
    </Dropdown.Item>
    <Dropdown.Item as={Link} to="/admin/configuration">
      <Icon name="list" />
      <Translate contentKey="global.menu.admin.configuration">Configuration</Translate>
    </Dropdown.Item>
    <Dropdown.Item as={Link} to="/admin/audits">
      <Icon name="bell" />
      <Translate contentKey="global.menu.admin.audits">Audits</Translate>
    </Dropdown.Item>
    <Dropdown.Item as={Link} to="/admin/logs">
      <Icon name="tasks" />
      <Translate contentKey="global.menu.admin.logs">Logs</Translate>
    </Dropdown.Item>
  </>
);

const swaggerItem = (
  <Dropdown.Item as={Link} to="/admin/docs">
    <Icon name="book" />
    <Translate contentKey="global.menu.admin.apidocs">API</Translate>
  </Dropdown.Item>
);

export const AdminMenu = ({ showSwagger }) => (
  <Dropdown item simple icon="user-plus" text={translate('global.menu.admin.main')} id="admin-menu">
    <Dropdown.Menu>
      {adminMenuItems}
      {showSwagger && swaggerItem}
    </Dropdown.Menu>
  </Dropdown>
);

export default AdminMenu;
