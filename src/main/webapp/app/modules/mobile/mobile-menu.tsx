import './mobile-menu.scss';
import React from 'react';
import { translate, Translate } from 'react-jhipster';
import { Image, List, Icon, Header, Menu } from 'semantic-ui-react';
import { NavLink as Link } from 'react-router-dom';

export const MobileMenu = () => (
  <div className="mobile-menu">
    <List className="mobile-menu-list">
      <List.Item>
        <Image src="/content/images/Assets/mobile-menu-icon.png" style={{ padding: '16px 0 0 14px' }} />
        <Image src={`/content/images/Assets/Search-black.svg`} alt="search button" style={{ padding: '19px 0 0 200px' }} />
        <Icon name="cancel" size="big" style={{ padding: '19px 30px 0 0' }} />
      </List.Item>
      <List.Item>
        <Menu text className="mobile-menu-list-item">
          <Menu.Item style={{ paddingLeft: '60px' }}>
            <Translate contentKey="global.menu.topics">Topics</Translate>
          </Menu.Item>
        </Menu>
      </List.Item>
    </List>
  </div>
);
