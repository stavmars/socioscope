import React from 'react';
import { translate, Translate } from 'react-jhipster';
import { IRootState } from 'app/shared/reducers';
import {
  removeFilter,
  setFilterValue,
  addCode,
  removeCode,
  removeCompare,
  toggleCompareValue,
  updateVisOptions
} from 'app/modules/dataset-page/dataset-page-reducer';
import { List } from 'semantic-ui-react';
import { toggleMobileVisMenu } from 'app/shared/reducers/header';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';

export interface IMobileVisMenuProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export class MobileVisMenu extends React.Component<IMobileVisMenuProps> {
  constructor(props) {
    super(props);
  }

  render() {
    const { dataset, seriesOptions, dimensionCodes, fetchedCodeLists, visType } = this.props;

    return (
      <div className="mobile-vis-menu">
        <List>
          <List.Item>
            <List.Header
              style={{
                fontSize: '20px',
                fontFamily: 'BPnoScriptBold',
                paddingTop: '15px',
                paddingLeft: '13px',
                height: '52px',
                backgroundColor: '#D8FFF6',
                borderBottom: '3px solid #ff5d39'
              }}
            >
              {translate('socioscopeApp.dataSet.visualization.configure.menuTitle')}
              <span className="close" onClick={this.props.toggleMobileVisMenu}>
                Κλείσιμο
              </span>
            </List.Header>
          </List.Item>
          <List.Item>{dataset && dataset.id}</List.Item>
        </List>
      </div>
    );
  }
}

const mapStateToProps = (storeState: IRootState, ownProps) => ({
  dataset: storeState.dataSet.entitiesById[ownProps.match.params.id],
  dimensionCodes: storeState.datasetPage.dimensionCodes,
  fetchedCodeLists: storeState.datasetPage.fetchedCodeLists,
  seriesOptions: storeState.datasetPage.seriesOptions,
  visType: storeState.datasetPage.visType
});

const mapDispatchToProps = {
  toggleMobileVisMenu,
  updateVisOptions,
  setFilterValue,
  toggleCompareValue,
  removeFilter,
  addCode,
  removeCode,
  removeCompare
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MobileVisMenu);
