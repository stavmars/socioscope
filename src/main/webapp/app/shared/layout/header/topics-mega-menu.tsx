import React from 'react';
import Header from 'app/shared/layout/header/header';
import { translate } from 'react-jhipster';
import { Image, List } from 'semantic-ui-react';
import { NavLink as Link } from 'react-router-dom';

export const TopicsMegaMenu = () => (
  <div className="topics-mega-menu">
    <Header isFixed={false} />
    <div className="topics-mega-menu-list">
      <List selection verticalAlign="middle">
        <List.Item className="topics-mega-menu-list-item color-scheme-1" as={Link} to="/dataset/protests">
          <div className="topics-mega-menu-img">
            <Image centered src="/content/images/Assets/Protests.svg" />
          </div>
          {translate('home.dataset.categories.social')}
          <span className="topics-mega-menu-list-item-discover color-scheme-1">{translate('home.dataset.explore')}</span>
        </List.Item>
        <List.Item className="topics-mega-menu-list-item color-scheme-3" as={Link} to="/dataset/criminality">
          <div className="topics-mega-menu-img">
            <Image centered src="/content/images/Assets/Criminality.svg" />
          </div>
          {translate('home.dataset.categories.criminality')}
          <span className="topics-mega-menu-list-item-discover color-scheme-3">{translate('home.dataset.explore')}</span>
        </List.Item>
        <List.Item className="topics-mega-menu-list-item color-scheme-2" as={Link} to="/dataset/poverty">
          <div className="topics-mega-menu-img">
            <Image centered src="/content/images/Assets/Poverty.svg" />
          </div>
          {translate('home.dataset.categories.poverty')}
          <span className="topics-mega-menu-list-item-discover color-scheme-2">{translate('home.dataset.explore')}</span>
        </List.Item>
        <List.Item className="topics-mega-menu-list-item color-scheme-1" as={Link} to="/dataset/greek-election-results">
          <div className="topics-mega-menu-img">
            <Image centered src="/content/images/Assets/Elections.svg" />
          </div>
          {translate('home.dataset.categories.elections')}
          <span className="topics-mega-menu-list-item-discover color-scheme-1">{translate('home.dataset.explore')}</span>
        </List.Item>
        <List.Item className="topics-mega-menu-list-item color-scheme-2" as={Link} to="/dataset/politics">
          <div className="topics-mega-menu-img">
            <Image centered src="/content/images/Assets/Politicians.svg" />
          </div>
          {translate('home.dataset.categories.politics')}
          <span className="topics-mega-menu-list-item-discover color-scheme-2">{translate('home.dataset.explore')}</span>
        </List.Item>
        <List.Item className="topics-mega-menu-list-item color-scheme-3" as={Link} to="/dataset/teenagers">
          <div className="topics-mega-menu-img">
            <Image centered src="/content/images/Assets/Teenagers.svg" />
          </div>
          {translate('home.dataset.categories.schools')}
          <span className="topics-mega-menu-list-item-discover color-scheme-3">{translate('home.dataset.explore')}</span>
        </List.Item>
      </List>
    </div>
  </div>
);
