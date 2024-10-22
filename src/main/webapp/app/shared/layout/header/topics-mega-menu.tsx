import Header from 'app/shared/layout/header/header';
import { IDataSet } from 'app/shared/model/data-set.model';
import { IRootState } from 'app/shared/reducers';
import { toggleTopicsMenu } from 'app/shared/reducers/header';
import { translateEntityField } from 'app/shared/util/entity-utils';
import _ from 'lodash';
import React from 'react';
import { translate } from 'react-jhipster';
import { connect } from 'react-redux';
import { NavLink as Link } from 'react-router-dom';
import { Image, List } from 'semantic-ui-react';

export interface ITopicsMegaMenuProps extends StateProps, DispatchProps {}

export class TopicsMegaMenu extends React.Component<ITopicsMegaMenuProps> {
  render() {
    const { dataSetsById } = this.props;
    return (
      <div className="topics-mega-menu">
        <Header isFixed={false} />
        <div className="topics-mega-menu-list">
          <List selection verticalAlign="middle">
            {_.at(dataSetsById, [
              'media-gender-rep',
              'democracy-at-school',
              'young-europeans',
              'youwho',
              'adolescents',
              'deputies',
              'greek-election-results',
              'claims'
            ]).map((dataset: IDataSet) => (
              <List.Item className={`topics-mega-menu-list-item ${dataset.colorScheme}`} as={Link} to={`/dataset/${dataset.id}`}>
                <div className="topics-mega-menu-img">
                  <Image centered src={`/content/images/Assets/${dataset.id}.svg`} />
                </div>
                {translateEntityField(dataset.name)}
                <span className={`topics-mega-menu-list-item-discover ${dataset.colorScheme}`}>{translate('home.dataset.explore')}</span>
              </List.Item>
            ))}
          </List>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ dataSet, locale }: IRootState) => ({
  currentLocale: locale.currentLocale,
  dataSetsById: dataSet.entitiesById
});
const mapDispatchToProps = { toggleTopicsMenu };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TopicsMegaMenu);
