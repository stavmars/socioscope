import React from 'react';
import './dataset-page.scss';
import { Dropdown, Image } from 'semantic-ui-react';
import { IDataSet } from 'app/shared/model/data-set.model';
import { connect } from 'react-redux';
import { QbDatasetFilters } from 'app/modules/dataset-page/qb-dataset-filters';
import { RawDatasetFilters } from 'app/modules/dataset-page/raw-dataset-filters';
import { changeCompareBy, setFilterValue, updateVisOptions } from 'app/modules/dataset-page/dataset-page-reducer';
import { IRootState } from 'app/shared/reducers';
import { translateEntityField } from 'app/shared/util/entity-utils';
import { translate } from 'react-jhipster';

export interface IVisSeriesOptionMenuProp extends DispatchProps, StateProps {
  dataset: IDataSet;
  visType: string;
}

export class VisSeriesOptionMenu extends React.Component<IVisSeriesOptionMenuProp> {
  constructor(props) {
    super(props);
  }

  handleXAxisChange = (e, { value }) =>
    this.props.updateVisOptions(this.props.dataset, {
      visType: this.props.visType,
      seriesOptions: { xAxis: value }
    });

  render() {
    const { dataset, seriesOptions, dimensionCodes, fetchedCodeLists, visType } = this.props;
    const { dimensions, colorScheme } = dataset;

    const xAxisOptions = dimensions.map(dimension => ({
      id: dimension.id,
      text: translateEntityField(dimension.name),
      value: dimension.id
    }));

    return (
      <div className="vis-options-menu">
        <div className="vis-options-menu-title">
          <span>{translate('socioscopeApp.dataSet.visualization.configure.menuTitle')}</span>
          <Image src="/content/images/Assets/Reset.svg" />
        </div>
        {visType === 'chart' && (
          <div className="vis-xAxis vis-options-menu-item">
            <div className="vis-options-menu-label">
              <Image inline src={`/content/images/Assets/x-axis-${colorScheme}.svg`} style={{ paddingLeft: '5px', paddingRight: '10px' }} />
              {translate('socioscopeApp.dataSet.visualization.configure.xAxis')}
            </div>
            <Dropdown
              className={`vis-options-dropdown ${colorScheme}`}
              onChange={this.handleXAxisChange}
              options={xAxisOptions}
              selection
              fluid
              placeholder="Επιλέξτε μεταβλητή για τον άξονα x"
              value={seriesOptions.xAxis}
            />
          </div>
        )}
        <div className="vis-filters vis-options-menu-item">
          <div className="vis-options-menu-label">
            <Image
              inline
              src={`/content/images/Assets/indicator-${colorScheme}.svg`}
              style={{ paddingLeft: '5px', paddingRight: '10px' }}
            />
            {translate('socioscopeApp.dataSet.visualization.configure.filter')}
          </div>
          {dataset.type === 'qb' ? (
            <QbDatasetFilters
              dimensionCodes={dimensionCodes}
              dataset={dataset}
              fetchedCodeLists={fetchedCodeLists}
              seriesOptions={seriesOptions}
              setFilterValue={this.props.setFilterValue}
            />
          ) : (
            <RawDatasetFilters
              dimensionCodes={dimensionCodes}
              dataset={dataset}
              fetchedCodeLists={fetchedCodeLists}
              seriesOptions={seriesOptions}
            />
          )}
        </div>
        {/* {visType === 'chart' && (
        <CompareByControl
          dimensionCodes={dimensionCodes}
          dataset={dataset}
          seriesOptions={seriesOptions}
          changeCompareBy={this.props.changeCompareBy}
        />
      )}*/}
      </div>
    );
  }
}

const mapStateToProps = (storeState: IRootState) => ({
  dimensionCodes: storeState.datasetPage.dimensionCodes,
  fetchedCodeLists: storeState.datasetPage.fetchedCodeLists,
  seriesOptions: storeState.datasetPage.seriesOptions,
  visType: storeState.datasetPage.visType
});

const mapDispatchToProps = {
  changeCompareBy,
  setFilterValue,
  updateVisOptions
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VisSeriesOptionMenu);
