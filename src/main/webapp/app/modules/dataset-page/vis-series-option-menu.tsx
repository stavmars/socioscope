import React from 'react';
import './dataset-page.scss';
import { Divider, Dropdown, Grid, Image, Accordion, Icon } from 'semantic-ui-react';
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
import SliderFilter from 'app/modules/dataset-page/slider-filter';

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

  resetGraph(e): void;
}

export interface IVisSeriesOptionMenuState {
  moreOptions: boolean;
}

export class VisSeriesOptionMenu extends React.Component<IVisSeriesOptionMenuProp, IVisSeriesOptionMenuState> {
  constructor(props) {
    super(props);
    this.state = {
      moreOptions: false
    };
  }

  handleXAxisChange = (e, { value }) =>
    this.props.updateVisOptions(this.props.dataset, {
      visType: this.props.visType,
      seriesOptions: { xAxis: value, compareBy: null }
    });

  handleCompareByChange = (e, { value }) =>
    value ? this.props.changeCompareBy(this.props.dataset, value) : this.props.removeCompare(this.props.dataset);

  handleOptions = () => this.setState({ moreOptions: !this.state.moreOptions });

  render() {
    const { dataset, seriesOptions, dimensionCodes, fetchedCodeLists, visType } = this.props;
    const { dimensions, colorScheme, dimensionGroups } = dataset;

    const dimensionsByGroup = _.groupBy(dimensions, dim => dim.groupId || '');

    const getXAxisOptions = (dimList = []) =>
      dimList.filter(dimension => !dimension.disableAxis).map(dimension => ({
        id: dimension.id,
        text: translateEntityField(dimension.name),
        value: dimension.id
      }));

    const groupXAxisOptions = _.flatMap(dimensionGroups, group => {
      const groupTitle = {
        disabled: true,
        content: (
          <Divider horizontal fitted style={{ whiteSpace: 'normal' }}>
            <span className="dim-group-title">{translateEntityField(group.name)}</span>
          </Divider>
        )
      };
      return [groupTitle, ...getXAxisOptions(dimensionsByGroup[group.id])];
    });

    const xAxisOptions = [...getXAxisOptions(dimensionsByGroup['']), ...groupXAxisOptions];

    const compareByOptions = dimensions.filter(dimension => dimension.type !== 'time' && !dimension.disableFilter).map(dimension => ({
      id: dimension.id,
      text: translateEntityField(dimension.name),
      value: dimension.id,
      disabled: dimension.id === seriesOptions.xAxis
    }));

    const xAxisDimension = _.find(dataset.dimensions, { id: seriesOptions.xAxis });

    const demographics = _.filter(dimensions, dimension => dimension.filterWidget === 'button-group');
    const sliderDimensions = _.filter(dimensions, dimension => dimension.filterWidget === 'slider');

    // tslint:disable:jsx-no-lambda
    return (
      <div className="vis-options-menu">
        <div className="vis-options-menu-title">
          <span>{translate('socioscopeApp.dataSet.visualization.configure.menuTitle')}</span>
          <Image onClick={this.props.resetGraph} src="/content/images/Assets/Reset.svg" style={{ cursor: 'pointer' }} />
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
          !['adolescents', 'greek-election-results'].includes(dataset.id) && (
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
          {sliderDimensions.map(
            sliderDim =>
              sliderDim.id !== seriesOptions.xAxis &&
              sliderDim.id !== seriesOptions.compareBy && (
                <SliderFilter
                  dimension={sliderDim}
                  codes={dimensionCodes[sliderDim.id].codes}
                  dataset={dataset}
                  setFilterValue={this.props.setFilterValue}
                  removeFilter={this.props.removeFilter}
                  seriesOptions={seriesOptions}
                />
              )
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
                  dataset={dataset}
                  setFilterValue={this.props.setFilterValue}
                  removeFilter={this.props.removeFilter}
                  seriesOptions={seriesOptions}
                />
              </Grid.Row>
            </Grid>
          )}
        </div>
        {visType === 'chart' &&
          dataset.id === 'adolescents' && (
            <Accordion
              styled
              style={{
                background: 'transparent',
                boxShadow: 'none'
              }}
            >
              <Accordion.Title
                active={this.state.moreOptions}
                onClick={this.handleOptions}
                style={{
                  fontSize: '16px',
                  fontFamily: 'ProximaNovaSemibold'
                }}
              >
                <Icon name="dropdown" />
                {translate('socioscopeApp.dataSet.visualization.configure.options')}
              </Accordion.Title>
              <Accordion.Content active={this.state.moreOptions}>
                <div>
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
                  <div className="vis-options-menu-label">
                    <Image
                      inline
                      src={`/content/images/Assets/indicator-${colorScheme}.svg`}
                      style={{ paddingLeft: '5px', paddingRight: '10px' }}
                    />
                    {translate('socioscopeApp.dataSet.visualization.configure.filter')}
                  </div>
                  <RawDatasetFilters
                    dimensionCodes={dimensionCodes}
                    dataset={dataset}
                    fetchedCodeLists={fetchedCodeLists}
                    seriesOptions={seriesOptions}
                    setFilterValue={this.props.setFilterValue}
                    removeFilter={this.props.removeFilter}
                  />
                </div>
              </Accordion.Content>
            </Accordion>
          )}
      </div>
    );
  }
}

export default VisSeriesOptionMenu;
