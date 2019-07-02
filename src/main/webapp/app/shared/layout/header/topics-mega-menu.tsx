import React from 'react';
import Header from 'app/shared/layout/header/header';
import { Image, List } from 'semantic-ui-react';

export const TopicsMegaMenu = () => (
  <div className="topics-mega-menu">
    <Header isFixed={false} />
    <div className="topics-mega-menu-list">
      <List selection verticalAlign="middle">
        <List.Item className="topics-mega-menu-list-item color-scheme-1">
          <div className="topics-mega-menu-img">
            <Image centered src="/content/images/Assets/Protests.svg" />
          </div>
          Κοινωνικές αντιπαραθέσεις και διαμαρτυρία
        </List.Item>
        <List.Item className="topics-mega-menu-list-item color-scheme-3">
          <div className="topics-mega-menu-img">
            <Image centered src="/content/images/Assets/Criminality.svg" />
          </div>
          Το Εγκληματικό Φαινόμενο
        </List.Item>
        <List.Item className="topics-mega-menu-list-item color-scheme-2">
          <div className="topics-mega-menu-img">
            <Image centered src="/content/images/Assets/Poverty.svg" />
          </div>
          Φτώχεια και Κοινωνικός Αποκλεισμός
        </List.Item>
        <List.Item className="topics-mega-menu-list-item color-scheme-1">
          <div className="topics-mega-menu-img">
            <Image centered src="/content/images/Assets/Elections.svg" />
          </div>
          Εκλογικά Αποτελέσματα(1996-2015)
        </List.Item>
        <List.Item className="topics-mega-menu-list-item color-scheme-2">
          <div className="topics-mega-menu-img">
            <Image centered src="/content/images/Assets/Politicians.svg" />
          </div>
          Πολιτικό Προσωπικό
        </List.Item>
        <List.Item className="topics-mega-menu-list-item color-scheme-3">
          <div className="topics-mega-menu-img">
            <Image centered src="/content/images/Assets/Teenagers.svg" />
          </div>
          Στάσεις και Αντιλήψεις μαθητών Γυμνασίου
        </List.Item>
      </List>
    </div>
  </div>
);
