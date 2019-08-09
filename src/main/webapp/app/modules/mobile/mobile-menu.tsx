import './mobile-menu.scss';
import React from 'react';
import { translate, Translate } from 'react-jhipster';
import { Image, List, Icon, Header, Menu, Segment, Container, Button } from 'semantic-ui-react';
import { NavLink as Link, NavLink } from 'react-router-dom';
import { toggleMobileMenu } from 'app/shared/reducers/header';
import { connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';
import { translateEntityField } from 'app/shared/util/entity-utils';

export interface IMobileMenuProps extends StateProps, DispatchProps {}

export class MobileMenu extends React.Component<IMobileMenuProps> {
  render() {
    const { dataSetsById } = this.props;
    const elections = dataSetsById['greek-election-results'];
    const deputies = dataSetsById['deputies'];
    const adolescents = dataSetsById['adolescents'];
    const claims = dataSetsById['claims'];

    return (
      <div className="mobile-menu">
        <List relaxed="very">
          <List.Item>
            <Image as="a" href="/" src="/content/images/Assets/mobile-menu-icon.png" style={{ padding: '16px 0 0 14px' }} />
            {/* <Image src={`/content/images/Assets/Search-black.svg`} alt="search button" style={{ padding: '19px 0 0 160px' }} /> */}
            <List.Icon onClick={this.props.toggleMobileMenu} name="cancel" size="big" style={{ marginTop: '-8%' }} />
          </List.Item>
          <List.Item>
            <List.Content>
              <List.Header className="mobile-menu-item">{translate('global.menu.topics')}</List.Header>
              <div className="mobile-menu-list">
                <List.Item className={`mobile-menu-list-line ${claims.colorScheme}`}>
                  <Container>
                    <Image className="mobile-menu-list-line-image" src="/content/images/Assets/Protests.svg" />
                    <Container text className={`mobile-menu-list-line-item ${claims.colorScheme}`} as={Link} to="/dataset/claims">
                      {translateEntityField(claims.name)}
                      <i />
                    </Container>
                  </Container>
                </List.Item>
                {/* <List.Item className="mobile-menu-list-line color-scheme-3">
                  <Container>
                    <Image className="mobile-menu-list-line-image" src="/content/images/Assets/Criminality.svg" />
                    <Container text className="mobile-menu-list-line-item color-scheme-3" as={Link} to="/dataset/criminaltiy">
                      {translate('home.dataset.categories.criminality')}
                      <i />
                    </Container>
                  </Container>
                </List.Item>
                <List.Item className="mobile-menu-list-line color-scheme-2">
                  <Container>
                    <Image className="mobile-menu-list-line-image" src="/content/images/Assets/Poverty.svg" />
                    <Container text className="mobile-menu-list-line-item color-scheme-2" as={Link} to="/dataset/poverty">
                      {translate('home.dataset.categories.poverty')}
                      <i />
                    </Container>
                  </Container>
                </List.Item> */}
                <List.Item className={`mobile-menu-list-line ${elections.colorScheme}`}>
                  <Container>
                    <Image className="mobile-menu-list-line-image" src="/content/images/Assets/Elections.svg" />
                    <Container
                      text
                      className={`mobile-menu-list-line-item ${elections.colorScheme}`}
                      as={Link}
                      to="/dataset/greek-election-results"
                    >
                      {translateEntityField(elections.name)}
                      <i />
                    </Container>
                  </Container>
                </List.Item>
                <List.Item className={`mobile-menu-list-line ${deputies.colorScheme}`}>
                  <Container>
                    <Image className="mobile-menu-list-line-image" src="/content/images/Assets/Politicians.svg" />
                    <Container text className={`mobile-menu-list-line-item ${deputies.colorScheme}`} as={Link} to="/dataset/deputies">
                      {translateEntityField(deputies.name)}
                      <i />
                    </Container>
                  </Container>
                </List.Item>
                <List.Item className={`mobile-menu-list-line ${adolescents.colorScheme}`}>
                  <Container>
                    <Image className="mobile-menu-list-line-image" src="/content/images/Assets/Teenagers.svg" />
                    <Container text className={`mobile-menu-list-line-item ${adolescents.colorScheme}`} as={Link} to="/dataset/adolescents">
                      {translateEntityField(adolescents.name)}
                      <i />
                    </Container>
                  </Container>
                </List.Item>
              </div>
            </List.Content>
            <div className="mobile-menu-items">
              <List.Content>
                <List.Header>
                  <NavLink className="mobile-menu-item" to="/about">
                    {translate('global.menu.about')}
                  </NavLink>
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
            </div>
          </List.Item>
        </List>
      </div>
    );
  }
}

const mapStateToProps = ({ dataSet }: IRootState) => ({
  dataSetsById: dataSet.entitiesById
});

const mapDispatchToProps = { toggleMobileMenu };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MobileMenu);
