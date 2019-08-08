import React from 'react';
import Header from 'app/shared/layout/header/header';
import { translate } from 'react-jhipster';
import { Image, List } from 'semantic-ui-react';
import { NavLink as Link } from 'react-router-dom';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { translateEntityField } from 'app/shared/util/entity-utils';
import { toggleTopicsMenu } from 'app/shared/reducers/header';

export interface ITopicsMegaMenuProps extends StateProps, DispatchProps {}

export class TopicsMegaMenu extends React.Component<ITopicsMegaMenuProps> {
  render() {
    const { dataSetsById } = this.props;
    const elections = dataSetsById['greek-election-results'];
    const deputies = dataSetsById['deputies'];
    const adolescents = dataSetsById['adolescents'];
    const claims = dataSetsById['claims'];

    return (
      <div className="topics-mega-menu">
        <Header isFixed={false} />
        <div className="topics-mega-menu-list">
          <List selection verticalAlign="middle">
            <List.Item className={`topics-mega-menu-list-item ${claims.colorScheme}`} as={Link} to="/dataset/claims">
              <div className="topics-mega-menu-img">
                <Image centered src="/content/images/Assets/Protests.svg" />
              </div>
              {translateEntityField(claims.name)}
              <span className={`topics-mega-menu-list-item-discover ${claims.colorScheme}`}>{translate('home.dataset.explore')}</span>
            </List.Item>
            {/* <List.Item className="topics-mega-menu-list-item color-scheme-3" as={Link} to="/dataset/criminality">
              <div className="topics-mega-menu-img">
                <Image centered src="/content/images/Assets/Criminality.svg" />
              </div>
              {translate('home.dataset.categories.criminality')}
              <span className="topics-mega-menu-list-item-discover color-scheme-3">{translate('home.dataset.explore')}</span>
            </List.Item>
            <List.Item className="topics-mega-menu-list-item color-scheme-2" as={Link} to="/dataset/poverty">
              <div className="topics-mega-menu-img">
                <Image centered src="/content/images/Assets/Poverty.svg" />
              </div>
              {translate('home.dataset.categories.poverty')}
              <span className="topics-mega-menu-list-item-discover color-scheme-2">{translate('home.dataset.explore')}</span>
            </List.Item> */}
            <List.Item className={`topics-mega-menu-list-item ${elections.colorScheme}`} as={Link} to="/dataset/greek-election-results">
              <div className="topics-mega-menu-img">
                <Image centered src="/content/images/Assets/Elections.svg" />
              </div>
              {translateEntityField(elections.name)}
              <span className={`topics-mega-menu-list-item-discover ${elections.colorScheme}`}>{translate('home.dataset.explore')}</span>
            </List.Item>
            <List.Item className={`topics-mega-menu-list-item ${deputies.colorScheme}`} as={Link} to="/dataset/deputies">
              <div className="topics-mega-menu-img">
                <Image centered src="/content/images/Assets/Politicians.svg" />
              </div>
              {translateEntityField(deputies.name)}
              <span className={`topics-mega-menu-list-item-discover ${deputies.colorScheme}`}>{translate('home.dataset.explore')}</span>
            </List.Item>
            <List.Item className={`topics-mega-menu-list-item ${adolescents.colorScheme}`} as={Link} to="/dataset/adolescents">
              <div className="topics-mega-menu-img">
                <Image centered src="/content/images/Assets/Teenagers.svg" />
              </div>
              {translateEntityField(adolescents.name)}
              <span className={`topics-mega-menu-list-item-discover ${adolescents.colorScheme}`}>{translate('home.dataset.explore')}</span>
            </List.Item>
          </List>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ dataSet }: IRootState) => ({
  dataSetsById: dataSet.entitiesById
});
const mapDispatchToProps = { toggleTopicsMenu };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TopicsMegaMenu);
