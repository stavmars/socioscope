import './footer.scss';

import React from 'react';
import { translate } from 'react-jhipster';
import { Grid, Image, List, Responsive } from 'semantic-ui-react';
import { localeImage } from 'app/shared/util/entity-utils';
import { NavLink } from 'react-router-dom';

const Footer = () => (
  <div>
    <Responsive {...Responsive.onlyMobile}>
      <div className="app-footer">
        <Grid rows={4}>
          <Grid.Row centered className="app-footer-logo">
            <Image src="/content/images/Assets/Logo-white.svg" as="a" href="/" />
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
                <Image
                  src="/content/images/Assets/ekke.png"
                  style={{ height: '36px', width: '36px', marginRight: 20, marginLeft: 30 }}
                  as="a"
                  href="https://www.ekke.gr"
                />
                <Image
                  src="/content/images/Assets/athena.png"
                  style={{ height: '36px', width: '36px', marginLeft: 20 }}
                  as="a"
                  href="https://www.athena-innovation.gr"
                />
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
            <Image className="app-footer-logo" centered src={localeImage()} />
          </Grid.Row>
          <Grid.Row centered columns="1" style={{ padding: '0' }}>
            <a href="https://www.roleplay.gr/" target="_blank" style={{ color: '#ededed', fontSize: '10px' }}>
              {translate('footer.design')}: <span style={{ color: 'orange', fontSize: '10px' }}>ROLEPLAY</span>
            </a>
          </Grid.Row>
        </Grid>
      </div>
    </Responsive>
    <Responsive minWidth={Responsive.onlyTablet.minWidth}>
      <div id="app-footer">
        <Grid stackable>
          <Grid.Row>
            <Grid.Column computer={window.innerWidth > 1920 ? 4 : 6} tablet={6}>
              <Image id="app-footer-logo" src="/content/images/Assets/Logo-white.svg" as="a" href="/" />
              <div>
                <List id="app-footer-links" horizontal bulleted>
                  <List.Item as={NavLink} to="/blog" exact>
                    BLOG
                  </List.Item>
                  <List.Item as={NavLink} to={{ pathname: '/about', hash: '#project' }}>
                    {translate('footer.about')}
                  </List.Item>
                  <List.Item as="a" href="https://www.roleplay.gr/" target="_blank" style={{ color: '#ededed' }}>
                    {translate('footer.design')}: <span style={{ color: 'orange' }}>ROLEPLAY</span>
                  </List.Item>
                </List>
              </div>
            </Grid.Column>
            <Grid.Column computer={4} tablet={4}>
              <div style={{ height: 40 }}>{translate('footer.collaboration')}</div>
              <Image.Group>
                <Image
                  src="/content/images/Assets/ekke.png"
                  style={{ marginRight: 20 }}
                  as="a"
                  href="https://www.ekke.gr"
                  target="_blank"
                />
                <Image src="/content/images/Assets/athena.png" as="a" href="https://www.athena-innovation.gr" target="_blank" />
              </Image.Group>
            </Grid.Column>
            <Grid.Column computer={2} tablet={3}>
              <div style={{ height: 40 }}>CC BY 4.0</div>
              <Image.Group>
                <Image src="/content/images/Assets/cc.png" />
                <Image src="/content/images/Assets/person.png" />
              </Image.Group>
            </Grid.Column>
            <Grid.Column computer={4} tablet={3}>
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
