import React from 'react';
import Header from 'app/shared/layout/header/header';
import { List } from 'semantic-ui-react';

export const TopicsMegaMenu = () => (
  <div>
    <Header isFixed={false} />
    {/*<span>{translate('global.menu.topics')}</span>*/}
    <List>
      <List.Item>Κοινωνικές δντιπαραθέσεις και διαμαρτυρία</List.Item>
      <List.Item>Το Εγκληματικό Φαινόμενο</List.Item>
      <List.Item>Φτώχεια και Κοινωνικός Αποκλεισμός</List.Item>
      <List.Item>Εκλογικά Αποτελέσματα(1996-2015)</List.Item>
      <List.Item>Πολιτικό Προσωπικό</List.Item>
      <List.Item>Στάσεις και Ατνιλήψεις μαθητών Γυμνασίου</List.Item>
    </List>
  </div>
);
