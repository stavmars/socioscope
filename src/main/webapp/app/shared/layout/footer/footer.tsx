import './footer.scss';

import React from 'react';
import { translate } from 'react-jhipster';
import { Card, CardBody, Col, Row } from 'reactstrap';
import { Grid, Image, List } from 'semantic-ui-react';

const Footer = props => (
  <div id="app-footer">
    <Grid stackable>
      <Grid.Row>
        <Grid.Column width={8}>
          <List id="app-footer-links" horizontal bulleted>
            <List.Item as="a">{translate('footer.about')}</List.Item>
            <List.Item as="a">{translate('footer.terms')}</List.Item>
            <List.Item as="a">{translate('footer.policy')}</List.Item>
            <List.Item as="a">{translate('footer.developers')}</List.Item>
          </List>
          <Image src="/content/images/Assets/Logo-white-footer.png" />
        </Grid.Column>
        <Grid.Column width={2}>
          <div style={{ height: 40 }}>{translate('footer.collaboration')}</div>
          <Image.Group>
            <Image src="/content/images/Assets/ekke.png" style={{ marginRight: 20 }} />
            <Image src="/content/images/Assets/athena.png" style={{ marginLeft: 20 }} />
          </Image.Group>
        </Grid.Column>
        <Grid.Column width={2}>
          <div style={{ height: 40 }}>CC BY 4.0</div>
          <Image.Group>
            <Image src="/content/images/Assets/cc.png" />
            <Image src="/content/images/Assets/person.png" />
          </Image.Group>
        </Grid.Column>
        <Grid.Column width={4}>
          <Image.Group>
            <Image src="/content/images/Assets/eu.png" style={{ margin: 0 }} />
            <Image src="/content/images/Assets/nsrf.png" style={{ margin: 0 }} />
          </Image.Group>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  </div>
);

export default Footer;
