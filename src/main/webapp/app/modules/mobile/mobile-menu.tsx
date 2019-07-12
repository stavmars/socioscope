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
            <Image src={`/content/images/Assets/Search-black.svg`} alt="search button" style={{ padding: '19px 0 0 160px' }} />
            <Icon onClick={this.props.toggleMobileMenu} name="cancel" size="big" style={{ padding: '19px 0 0 0' }} />
          </List.Item>
          <List.Item>
            <List.Content>
              <List.Header className="mobile-menu-item">ΘΕΜΑΤΙΚΕΣ</List.Header>
              <div className="mobile-menu-list">
                <List.Item>
                  <Container text className="mobile-menu-list-item color-scheme-1" as={Link} to="/dataset/greek-election-results">
                    <Image className="mobile-menu-list-image" src="/content/images/Assets/Protests.svg" />
                    {translate('home.dataset.categories.social')}
                  </Container>
                </List.Item>
                <List.Item>
                  <Container text className="mobile-menu-list-item color-scheme-3" as={Link} to="/dataset/greek-election-results">
                    <Image className="mobile-menu-list-image" src="/content/images/Assets/Criminality.svg" />
                    {translate('home.dataset.categories.criminality')}
                  </Container>
                </List.Item>
                <List.Item>
                  <Container text className="mobile-menu-list-item color-scheme-2" as={Link} to="/dataset/greek-election-results">
                    <Image className="mobile-menu-list-image" src="/content/images/Assets/Poverty.svg" />
                    {translate('home.dataset.categories.poverty')}
                  </Container>
                </List.Item>
                <List.Item>
                  <Container text className="mobile-menu-list-item color-scheme-1" as={Link} to="/dataset/greek-election-results">
                    <Image className="mobile-menu-list-image" src="/content/images/Assets/Elections.svg" />
                    {translate('home.dataset.categories.elections')}
                  </Container>
                </List.Item>
                <List.Item>
                  <Container text className="mobile-menu-list-item color-scheme-2" as={Link} to="/dataset/greek-election-results">
                    <Image className="mobile-menu-list-image" src="/content/images/Assets/Politicians.svg" />
                    {translate('home.dataset.categories.politics')}
                  </Container>
                </List.Item>
                <List.Item>
                  <Container text className="mobile-menu-list-item color-scheme-3" as={Link} to="/dataset/greek-election-results">
                    <Image className="mobile-menu-list-image" src="/content/images/Assets/Teenagers.svg" />
                    {translate('home.dataset.categories.schools')}
                  </Container>
                </List.Item>
              </div>
            </List.Content>
            <List.Content>
              <List.Header className="mobile-menu-item" as={Link} to="/about">
                ΣΧΕΤΙΚΑ
              </List.Header>
            </List.Content>
            <List.Content>
              <List.Header className="mobile-menu-item">DEVELOPERS</List.Header>
            </List.Content>
            <List.Content>
              <List.Header className="mobile-menu-item">ΟΡΟΙ ΧΡΗΣΗΣ</List.Header>
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
