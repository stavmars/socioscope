import './mobile-menu.scss';
import React from 'react';
import { translate } from 'react-jhipster';
import { Container, Image, List } from 'semantic-ui-react';
import { NavLink as Link, NavLink } from 'react-router-dom';
import { toggleMobileMenu } from 'app/shared/reducers/header';
import { connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';
import { translateEntityField } from 'app/shared/util/entity-utils';
import _ from 'lodash';
import { IDataSet } from 'app/shared/model/data-set.model';

export interface IMobileMenuProps extends StateProps, DispatchProps {}

export class MobileMenu extends React.Component<IMobileMenuProps> {
  render() {
    const { dataSetsById } = this.props;

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
                {_.at(dataSetsById, ['greek-election-results', 'deputies', 'adolescents', 'claims']).map((dataset: IDataSet) => (
                  <List.Item className={`mobile-menu-list-line ${dataset.colorScheme}`}>
                    <Container>
                      <Image className="mobile-menu-list-line-image" src={`/content/images/Assets/${dataset.id}.svg`} />
                      <Container
                        text
                        className={`mobile-menu-list-line-item ${dataset.colorScheme}`}
                        as={Link}
                        to={`/dataset/${dataset.id}`}
                      >
                        {translateEntityField(dataset.name)}
                        <i />
                      </Container>
                    </Container>
                  </List.Item>
                ))}
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
