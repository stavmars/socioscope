import './footer.scss';

import React from 'react';
import { translate } from 'react-jhipster';
import { Grid, Image, List, Responsive, Menu, Container } from 'semantic-ui-react';
import { localeImage } from 'app/shared/util/entity-utils';

const Footer = () => (
  <div>
    <Responsive {...Responsive.onlyMobile}>
      <div className="app-footer">
        <Grid rows={4}>
          <Grid.Row centered className="app-footer-logo">
            <Image src="/content/images/Assets/Logo-white.png" />
          </Grid.Row>
          <Grid.Row className="app-footer-text" columns={2}>
            <Grid.Column textAlign="center" style={{ padding: '28px 0 0 38px' }}>
              <span>{translate('footer.collaboration')}</span>
            </Grid.Column>
            <Grid.Column textAlign="center" style={{ padding: '28px 37px 0 0' }}>
              <span>CC BY 4.0</span>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row centered columns={2}>
            <Grid.Column>
              <Image.Group>
                <Image src="/content/images/Assets/ekke.png" style={{ height: '36px', width: '36px', marginRight: 20, marginLeft: 30 }} />
                <Image src="/content/images/Assets/athena.png" style={{ height: '36px', width: '36px', marginLeft: 20 }} />
              </Image.Group>
            </Grid.Column>
            <Grid.Column>
              <Image.Group>
                <Image src="/content/images/Assets/cc.png" style={{ height: '36px', width: '36px', marginRight: 20 }} />
                <Image src="/content/images/Assets/person.png" style={{ height: '36px', width: '36px', marginLeft: 20 }} />
              </Image.Group>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row centered>
            <Image className="app-footer-logo" src={localeImage()} />
          </Grid.Row>
        </Grid>
      </div>
    </Responsive>
    <Responsive minWidth={Responsive.onlyTablet.minWidth}>
      <div id="app-footer">
        <Grid stackable>
          <Grid.Row>
            <Grid.Column compiter={6} tablet={6}>
              <List id="app-footer-links" horizontal bulleted>
                <List.Item as="a">{translate('footer.about')}</List.Item>
                <List.Item as="a">{translate('footer.terms')}</List.Item>
                <List.Item as="a">{translate('footer.policy')}</List.Item>
                <List.Item as="a">{translate('footer.developers')}</List.Item>
              </List>
              <Image id="app-footer-logo" src="/content/images/Assets/Logo-white.png" />
            </Grid.Column>
            <Grid.Column compiter={4} tablet={4}>
              <div style={{ height: 40 }}>{translate('footer.collaboration')}</div>
              <Image.Group>
                <Image src="/content/images/Assets/ekke.png" style={{ marginRight: 20 }} />
                <Image src="/content/images/Assets/athena.png" />
              </Image.Group>
            </Grid.Column>
            <Grid.Column compiter={2} tablet={3}>
              <div style={{ height: 40 }}>CC BY 4.0</div>
              <Image.Group>
                <Image src="/content/images/Assets/cc.png" />
                <Image src="/content/images/Assets/person.png" />
              </Image.Group>
            </Grid.Column>
            <Grid.Column compiter={4} tablet={3}>
              <div style={{ height: 25 }} />
              <Image src={localeImage()} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    </Responsive>
  </div>
);

export default Footer;
