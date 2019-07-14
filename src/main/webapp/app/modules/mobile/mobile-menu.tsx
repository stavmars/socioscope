import './mobile-menu.scss';
import React from 'react';
import { translate, Translate } from 'react-jhipster';
import { Image, List, Icon, Header, Menu, Segment, Container, Button } from 'semantic-ui-react';
import { NavLink as Link } from 'react-router-dom';
import { toggleMobileMenu } from 'app/shared/reducers/header';
import { connect } from 'react-redux';

export class MobileMenu extends React.Component<DispatchProps> {
  render() {
    return (
      <div className="mobile-menu">
        <List relaxed="very">
          <List.Item>
            <Image
              onClick={this.props.toggleMobileMenu}
              src="/content/images/Assets/mobile-menu-icon.png"
              style={{ padding: '16px 0 0 14px' }}
            />
            {/* <Image src={`/content/images/Assets/Search-black.svg`} alt="search button" style={{ padding: '19px 0 0 160px' }} /> */}
            <Icon onClick={this.props.toggleMobileMenu} name="cancel" size="big" style={{ padding: '19px 0 0 0' }} />
          </List.Item>
          <List.Item>
            <List.Content>
              <List.Header className="mobile-menu-item">{translate('global.menu.topics')}</List.Header>
              <div className="mobile-menu-list">
                <List.Item className="mobile-menu-list-line color-scheme-1">
                  <Container>
                    <Image className="mobile-menu-list-line-image" src="/content/images/Assets/Protests.svg" />
                    <Container text className="mobile-menu-list-line-item color-scheme-1" as={Link} to="/dataset/greek-election-results">
                      {translate('home.dataset.categories.social')}
                      <i />
                    </Container>
                  </Container>
                </List.Item>
                <List.Item className="mobile-menu-list-line color-scheme-3">
                  <Container>
                    <Image className="mobile-menu-list-line-image" src="/content/images/Assets/Criminality.svg" />
                    <Container text className="mobile-menu-list-line-item color-scheme-3" as={Link} to="/dataset/greek-election-results">
                      {translate('home.dataset.categories.criminality')}
                      <i />
                    </Container>
                  </Container>
                </List.Item>
                <List.Item className="mobile-menu-list-line color-scheme-2">
                  <Container>
                    <Image className="mobile-menu-list-line-image" src="/content/images/Assets/Poverty.svg" />
                    <Container text className="mobile-menu-list-line-item color-scheme-2" as={Link} to="/dataset/greek-election-results">
                      {translate('home.dataset.categories.poverty')}
                      <i />
                    </Container>
                  </Container>
                </List.Item>
                <List.Item className="mobile-menu-list-line color-scheme-1">
                  <Container>
                    <Image className="mobile-menu-list-line-image" src="/content/images/Assets/Elections.svg" />
                    <Container text className="mobile-menu-list-line-item color-scheme-1" as={Link} to="/dataset/greek-election-results">
                      {translate('home.dataset.categories.elections')}
                      <i />
                    </Container>
                  </Container>
                </List.Item>
                <List.Item className="mobile-menu-list-line color-scheme-2">
                  <Container>
                    <Image className="mobile-menu-list-line-image" src="/content/images/Assets/Politicians.svg" />
                    <Container text className="mobile-menu-list-line-item color-scheme-2" as={Link} to="/dataset/greek-election-results">
                      {translate('home.dataset.categories.politics')}
                      <i />
                    </Container>
                  </Container>
                </List.Item>
                <List.Item className="mobile-menu-list-line color-scheme-3">
                  <Container>
                    <Image className="mobile-menu-list-line-image" src="/content/images/Assets/Teenagers.svg" />
                    <Container text className="mobile-menu-list-line-item color-scheme-3" as={Link} to="/dataset/greek-election-results">
                      {translate('home.dataset.categories.schools')}
                      <i />
                    </Container>
                  </Container>
                </List.Item>
              </div>
            </List.Content>
            <List.Content>
              <List.Header as={Link} className="mobile-menu-item" to="/about">
                {translate('global.menu.about')}
              </List.Header>
            </List.Content>
            <List.Content>
              <List.Header className="mobile-menu-item">{translate('footer.developers')}</List.Header>
            </List.Content>
            <List.Content>
              <List.Header className="mobile-menu-item">{translate('footer.terms')}</List.Header>
            </List.Content>
            <List.Content>
              <List.Header className="mobile-menu-item">{translate('footer.policy')}</List.Header>
            </List.Content>
          </List.Item>
        </List>
      </div>
    );
  }
}

const mapDispatchToProps = { toggleMobileMenu };

type DispatchProps = typeof mapDispatchToProps;

export default connect(
  null,
  mapDispatchToProps
)(MobileMenu);
