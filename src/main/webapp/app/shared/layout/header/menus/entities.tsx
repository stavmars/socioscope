import React from 'react';
import { Translate, translate } from 'react-jhipster';
import { NavLink as Link } from 'react-router-dom';
import { Dropdown } from 'semantic-ui-react';

export const EntitiesMenu = props => (
  <Dropdown item simple text={translate('global.menu.entities.main')} id="entity-menu">
    <Dropdown.Menu>
      <Dropdown.Item as={Link} to="/entity/data-set">
        <Translate contentKey="global.menu.entities.dataSet" />
      </Dropdown.Item>
      <Dropdown.Item as={Link} to="/entity/dimension">
        <Translate contentKey="global.menu.entities.dimension" />
      </Dropdown.Item>
      <Dropdown.Item as={Link} to="/entity/measure">
        <Translate contentKey="global.menu.entities.measure" />
      </Dropdown.Item>
      <Dropdown.Item as={Link} to="/entity/dimension-code">
        <Translate contentKey="global.menu.entities.dimensionCode" />
      </Dropdown.Item>
    </Dropdown.Menu>
  </Dropdown>
);
