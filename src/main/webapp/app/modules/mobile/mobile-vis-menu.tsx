import React from 'react';
import { translate } from 'react-jhipster';
import { IRootState } from 'app/shared/reducers';
import {
  changeCompareBy,
  removeCompare,
  removeFilter,
  setFilterValue,
  updateVisOptions
} from 'app/modules/dataset-page/dataset-page-reducer';
import { List } from 'semantic-ui-react';
import { toggleMobileVisMenu } from 'app/shared/reducers/header';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import VisSeriesOptionMenu from '../dataset-page/vis-series-option-menu';
import { accentColors, backgroundColors } from 'app/config/constants';

export interface IMobileVisMenuProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export class MobileVisMenu extends React.Component<IMobileVisMenuProps> {
  constructor(props) {
    super(props);
  }

  render() {
    const { datasetsById, seriesOptions, dimensionCodes, fetchedCodeLists, visType } = this.props;
    const dataset = datasetsById[this.props.match.params.id];
    if (!seriesOptions || !fetchedCodeLists) {
      return null;
    }

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
                backgroundColor: `${backgroundColors[dataset.colorScheme]}`,
                borderBottom: `3px solid ${accentColors[dataset.colorScheme]}`
              }}
            >
              {translate('socioscopeApp.dataSet.visualization.configure.menuTitle')}
              <span className={`close ${dataset.colorScheme}`} onClick={this.props.toggleMobileVisMenu}>
                Κλείσιμο
              </span>
            </List.Header>
          </List.Item>
          <List.Item>
            <VisSeriesOptionMenu
              seriesOptions={seriesOptions}
              visType={visType}
              fetchedCodeLists={fetchedCodeLists}
              dimensionCodes={dimensionCodes}
              dataset={dataset}
              setFilterValue={this.props.setFilterValue}
              updateVisOptions={this.props.updateVisOptions}
              removeFilter={this.props.removeFilter}
              removeCompare={this.props.removeCompare}
              changeCompareBy={this.props.changeCompareBy}
              resetGraph={null}
            />
          </List.Item>
        </List>
      </div>
    );
  }
}

const mapStateToProps = (storeState: IRootState) => ({
  datasetsById: storeState.dataSet.entitiesById,
  dimensionCodes: storeState.datasetPage.dimensionCodes,
  fetchedCodeLists: storeState.datasetPage.fetchedCodeLists,
  seriesOptions: storeState.datasetPage.seriesOptions,
  visType: storeState.datasetPage.visType
});

const mapDispatchToProps = {
  toggleMobileVisMenu,
  updateVisOptions,
  changeCompareBy,
  setFilterValue,
  removeFilter,
  removeCompare
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MobileVisMenu);
