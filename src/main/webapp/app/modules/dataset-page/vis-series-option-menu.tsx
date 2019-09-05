import React from 'react';
import './dataset-page.scss';
import { Dropdown, Image, Grid } from 'semantic-ui-react';
import { IDataSet } from 'app/shared/model/data-set.model';
import { QbDatasetFilters } from 'app/modules/dataset-page/qb-dataset-filters';
import { RawDatasetFilters } from 'app/modules/dataset-page/raw-dataset-filters';
import { translateEntityField } from 'app/shared/util/entity-utils';
import { translate } from 'react-jhipster';
import { ISeriesOptions } from 'app/shared/model/series-options.model';
import {
  addCode,
  changeCompareBy,
  removeCode,
  removeCompare,
  removeFilter,
  setFilterValue,
  updateVisOptions
} from 'app/modules/dataset-page/dataset-page-reducer';
import _ from 'lodash';
import ButtonGroupFilter from 'app/modules/dataset-page/ButtonGroupFilter';

export interface IVisSeriesOptionMenuProp {
  dataset: IDataSet;
  dimensionCodes: any;
  fetchedCodeLists: boolean;
  seriesOptions: ISeriesOptions;
  visType: string;

  setFilterValue: typeof setFilterValue;

  removeFilter: typeof removeFilter;

  changeCompareBy: typeof changeCompareBy;

  updateVisOptions: typeof updateVisOptions;

  removeCode: typeof removeCode;

  addCode: typeof addCode;

  removeCompare: typeof removeCompare;
}

export class VisSeriesOptionMenu extends React.Component<IVisSeriesOptionMenuProp> {
  constructor(props) {
    super(props);
  }

  handleXAxisChange = (e, { value }) =>
    this.props.updateVisOptions(this.props.dataset, {
      visType: this.props.visType,
      seriesOptions: { xAxis: value, compareBy: null }
    });

  resetGraph = e =>
    this.props.updateVisOptions(this.props.dataset, {
      visType: this.props.visType,
      seriesOptions: {}
    });

  handleCompareByChange = (e, { value }) =>
    value ? this.props.changeCompareBy(this.props.dataset, value) : this.props.removeCompare(this.props.dataset);

  render() {
    const { dataset, seriesOptions, dimensionCodes, fetchedCodeLists, visType } = this.props;
    const { dimensions, colorScheme } = dataset;

    const xAxisOptions = dimensions.filter(dimension => !dimension.disableAxis).map(dimension => ({
      id: dimension.id,
      text: translateEntityField(dimension.name),
      value: dimension.id
    }));

    const compareByOptions = dimensions.filter(dimension => dimension.type !== 'time' && !dimension.disableFilter).map(dimension => ({
      id: dimension.id,
      text: translateEntityField(dimension.name),
      value: dimension.id,
      disabled: dimension.id === seriesOptions.xAxis
    }));

    const xAxisDimension = _.find(dataset.dimensions, { id: seriesOptions.xAxis });

    const demographics = _.filter(dimensions, dimension => dimension.filterWidget === 'button-group');
    // tslint:disable:jsx-no-lambda
    return (
      <div className="vis-options-menu">
        <div className="vis-options-menu-title">
          <span>{translate('socioscopeApp.dataSet.visualization.configure.menuTitle')}</span>
          <Image onClick={this.resetGraph} src="/content/images/Assets/Reset.svg" style={{ cursor: 'pointer' }} />
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
              value={seriesOptions.xAxis}
            />
          </div>
        )}
        {visType === 'chart' &&
          dataset.id !== 'adolescents' && (
            <div className="vis-compareBy vis-options-menu-item">
              <div className="vis-options-menu-label">
                <Image inline src={`/content/images/Assets/compare-${colorScheme}.svg`} style={{ paddingRight: '23px' }} />
                {translate('socioscopeApp.dataSet.visualization.configure.compare')}
              </div>
              <Dropdown
                className={`vis-options-dropdown ${colorScheme}`}
                onChange={this.handleCompareByChange}
                options={compareByOptions}
                selection
                fluid
                disabled={xAxisDimension.type === 'composite'}
                value={seriesOptions.compareBy}
                clearable
              />
            </div>
          )}
        <div className="vis-filters vis-options-menu-item">
          {dataset.id !== 'adolescents' && (
            <div className="vis-options-menu-label">
              <Image
                inline
                src={`/content/images/Assets/indicator-${colorScheme}.svg`}
                style={{ paddingLeft: '5px', paddingRight: '10px' }}
              />
              {translate('socioscopeApp.dataSet.visualization.configure.filter')}
            </div>
          )}
          {dataset.type === 'qb' ? (
            <QbDatasetFilters
              dimensionCodes={dimensionCodes}
              dataset={dataset}
              fetchedCodeLists={fetchedCodeLists}
              seriesOptions={seriesOptions}
              setFilterValue={this.props.setFilterValue}
            />
          ) : (
            dataset.id !== 'adolescents' && (
              <RawDatasetFilters
                dimensionCodes={dimensionCodes}
                dataset={dataset}
                fetchedCodeLists={fetchedCodeLists}
                seriesOptions={seriesOptions}
                setFilterValue={this.props.setFilterValue}
                removeFilter={this.props.removeFilter}
              />
            )
          )}
        </div>
        <div className="button-group-filters">
          {demographics.length > 0 && (
            <Grid style={{ paddingLeft: '15px' }}>
              <Grid.Row>
                <ButtonGroupFilter
                  key={demographics[0].id}
                  dimension={demographics[0]}
                  codes={dimensionCodes[demographics[0].id].codes}
                  colorScheme={colorScheme}
                  dataset={dataset}
                  setFilterValue={this.props.setFilterValue}
                  removeFilter={this.props.removeFilter}
                  seriesOptions={seriesOptions}
                />
                <div style={{ marginLeft: '20px', marginRight: '20px' }} />
                <ButtonGroupFilter
                  key={demographics[1].id}
                  dimension={demographics[1]}
                  codes={dimensionCodes[demographics[1].id].codes}
                  colorScheme={colorScheme}
                  dataset={dataset}
                  setFilterValue={this.props.setFilterValue}
                  removeFilter={this.props.removeFilter}
                  seriesOptions={seriesOptions}
                />
              </Grid.Row>
              <Grid.Row>
                <ButtonGroupFilter
                  key={demographics[2].id}
                  dimension={demographics[2]}
                  codes={dimensionCodes[demographics[2].id].codes}
                  colorScheme={colorScheme}
                  dataset={dataset}
                  setFilterValue={this.props.setFilterValue}
                  removeFilter={this.props.removeFilter}
                  seriesOptions={seriesOptions}
                />
              </Grid.Row>
            </Grid>
          )}
        </div>
      </div>
    );
  }
}

export default VisSeriesOptionMenu;
