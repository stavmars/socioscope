import React from 'react';
import Header from 'app/shared/layout/header/header';
import { Image, List } from 'semantic-ui-react';
import { NavLink as Link } from 'react-router-dom';

export const TopicsMegaMenu = () => (
  <div className="topics-mega-menu">
    <Header isFixed={false} />
    <div className="topics-mega-menu-list">
      <List selection verticalAlign="middle">
        <List.Item className="topics-mega-menu-list-item color-scheme-1" as={Link} to="/dataset/greek-election-results">
          <div className="topics-mega-menu-img">
            <Image centered src="/content/images/Assets/Protests.svg" />
          </div>
          Κοινωνικές αντιπαραθέσεις και διαμαρτυρία
          <span className="topics-mega-menu-list-item-discover color-scheme-1">ΕΞΕΡΕΥΝΗΣΤΕ ΤΑ ΔΕΔΟΜΕΝΑ</span>
        </List.Item>
        <List.Item className="topics-mega-menu-list-item color-scheme-3" as={Link} to="/dataset/greek-election-results">
          <div className="topics-mega-menu-img">
            <Image centered src="/content/images/Assets/Criminality.svg" />
          </div>
          Το Εγκληματικό Φαινόμενο
          <span className="topics-mega-menu-list-item-discover color-scheme-3">ΕΞΕΡΕΥΝΗΣΤΕ ΤΑ ΔΕΔΟΜΕΝΑ</span>
        </List.Item>
        <List.Item className="topics-mega-menu-list-item color-scheme-2" as={Link} to="/dataset/greek-election-results">
          <div className="topics-mega-menu-img">
            <Image centered src="/content/images/Assets/Poverty.svg" />
          </div>
          Φτώχεια και Κοινωνικός Αποκλεισμός
          <span className="topics-mega-menu-list-item-discover color-scheme-2">ΕΞΕΡΕΥΝΗΣΤΕ ΤΑ ΔΕΔΟΜΕΝΑ</span>
        </List.Item>
        <List.Item className="topics-mega-menu-list-item color-scheme-1" as={Link} to="/dataset/greek-election-results">
          <div className="topics-mega-menu-img">
            <Image centered src="/content/images/Assets/Elections.svg" />
          </div>
          Εκλογικά Αποτελέσματα(1996-2015)
          <span className="topics-mega-menu-list-item-discover color-scheme-1">ΕΞΕΡΕΥΝΗΣΤΕ ΤΑ ΔΕΔΟΜΕΝΑ</span>
        </List.Item>
        <List.Item className="topics-mega-menu-list-item color-scheme-2" as={Link} to="/dataset/greek-election-results">
          <div className="topics-mega-menu-img">
            <Image centered src="/content/images/Assets/Politicians.svg" />
          </div>
          Πολιτικό Προσωπικό
          <span className="topics-mega-menu-list-item-discover color-scheme-2">ΕΞΕΡΕΥΝΗΣΤΕ ΤΑ ΔΕΔΟΜΕΝΑ</span>
        </List.Item>
        <List.Item className="topics-mega-menu-list-item color-scheme-3" as={Link} to="/dataset/greek-election-results">
          <div className="topics-mega-menu-img">
            <Image centered src="/content/images/Assets/Teenagers.svg" />
          </div>
          Στάσεις και Αντιλήψεις μαθητών Γυμνασίου
          <span className="topics-mega-menu-list-item-discover color-scheme-3">ΕΞΕΡΕΥΝΗΣΤΕ ΤΑ ΔΕΔΟΜΕΝΑ</span>
        </List.Item>
      </List>
    </div>
  </div>
);
