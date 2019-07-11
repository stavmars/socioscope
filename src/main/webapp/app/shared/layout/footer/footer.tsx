import './footer.scss';

import React from 'react';
import { translate } from 'react-jhipster';
import { Grid, Image, List, Responsive } from 'semantic-ui-react';
import { localeImage } from 'app/shared/util/entity-utils';

const Footer = () => (
  <div>
    <Responsive {...Responsive.onlyMobile}>
      <div id="app-footer">
        <Grid>
          <Grid.Row>
            <Image id="app-footer-logo" src="/content/images/Assets/Logo-white.png" />
          </Grid.Row>
          <Grid.Row>
            <Grid.Column textAlign="justified">
              <p id="app-footer-colab">{translate('footer.collaboration')}</p>
            </Grid.Column>
            <Grid.Column textAlign="justified">
              <p id="app-footer-cc">CC BY 4.0</p>
            </Grid.Column>
          </Grid.Row>
          {/* <Grid.Row>
            <Grid.Column>
              <Image.Group>
                <Image src="/content/images/Assets/ekke.png" />
                <Image src="/content/images/Assets/athena.png" />
              </Image.Group>
            </Grid.Column>
            <Grid.Column>
              <Image.Group>
                <Image src="/content/images/Assets/cc.png" />
                <Image src="/content/images/Assets/person.png" />
              </Image.Group>
            </Grid.Column>
          </Grid.Row> */}
        </Grid>
      </div>
    </Responsive>
    <Responsive minWidth={Responsive.onlyTablet.minWidth}>
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
              <Image id="app-footer-logo" src="/content/images/Assets/Logo-white.png" />
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
