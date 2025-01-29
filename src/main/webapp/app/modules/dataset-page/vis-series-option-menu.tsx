import React from 'react';
import './dataset-page.scss';
import { Accordion, Divider, Dropdown, Grid, Icon, Image, Popup } from 'semantic-ui-react';
import { IDataSet } from 'app/shared/model/data-set.model';
import { QbDatasetFilters } from 'app/modules/dataset-page/qb-dataset-filters';
import { RawDatasetFilters } from 'app/modules/dataset-page/raw-dataset-filters';
import { translateEntityField } from 'app/shared/util/entity-utils';
import { translate } from 'react-jhipster';
import { ISeriesOptions } from 'app/shared/model/series-options.model';
import {
  changeCompareBy,
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

  handleCompareCodesChange = (e, { value }) =>
    this.props.updateVisOptions(this.props.dataset, {
      visType: this.props.visType,
      seriesOptions: { ...this.props.seriesOptions, compareCodes: value }
    });

  handleOptions = () => this.setState({ moreOptions: !this.state.moreOptions });

  normalizeText = (text: string) =>
    text
      .normalize('NFD') // Normalizes Unicode to decompose diacritics
      .replace(/[\u0300-\u036f]/g, '') // Removes diacritic marks (accents)
      .replace(/\./g, '') // Removes periods
      .toLowerCase(); // Converts to lowercase

  handleSearch = (options: any[], query: string) => {
    const sanitizedQuery = this.normalizeText(query);
    return options.filter(({ text }) => this.normalizeText(text).includes(sanitizedQuery));
  };

  render() {
    const { dataset, seriesOptions, dimensionCodes, fetchedCodeLists, visType } = this.props;
    const { dimensions, colorScheme, dimensionGroups } = dataset;

    const dimensionsByGroup = _.groupBy(dimensions, dim => dim.groupId || '');

    const getXAxisOptions = (dimList = []) =>
      dimList.filter(dimension => !dimension.disableAxis && dimension.type !== 'combined').map(dimension => ({
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
    const xAxisDimension = _.find(dataset.dimensions, { id: seriesOptions.xAxis });
    const composedParent = dataset.dimensions.find(
      dim => dim.type === 'combined' && dim.composedOf && dim.composedOf.includes(xAxisDimension.id)
    );
    const compareByOptions = dimensions
      .filter(dimension => dimension.type !== 'time' && dimension.type !== 'combined' && !dimension.disableCompareBy)
      .map(dimension => ({
        id: dimension.id,
        text: translateEntityField(dimension.name),
        value: dimension.id,
        disabled: dimension.id === seriesOptions.xAxis || (composedParent && composedParent.composedOf.includes(dimension.id))
      }));

    const compareByDimension = _.find(dataset.dimensions, { id: seriesOptions.compareBy });
    const dependencies = _.union(xAxisDimension.dependencies, compareByDimension ? compareByDimension.dependencies : []);

    const sliderDimensions = _.filter(dimensions, dimension => dimension.filterWidget === 'slider');
    const buttonGroupDimensions = _.filter(
      dimensions,
      dimension =>
        dimension.filterWidget === 'button-group' && dimension.id !== seriesOptions.xAxis && dimension.id !== seriesOptions.compareBy
    );

    const compare = (
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
    );

    const compareCodes = compareByDimension != null &&
      compareByDimension.allowCompareCodes && (
        <div className="vis-compare-options vis-options-menu-item">
          <div className="vis-options-menu-label">{translate('socioscopeApp.dataSet.visualization.configure.compareOptions')}</div>
          <Dropdown
            className={`vis-options-dropdown ${colorScheme}`}
            onChange={this.handleCompareCodesChange}
            options={dimensionCodes[seriesOptions.compareBy].codes.map(code => ({
              key: code.notation,
              text: translateEntityField(code.name),
              value: code.notation,
              content: (
                <Popup
                  content={translateEntityField(code.description)} // Popup for descriptions
                  trigger={<span>{translateEntityField(code.name)}</span>} // Hover trigger
                  disabled={
                    !translateEntityField(code.description) || translateEntityField(code.description) === translateEntityField(code.name)
                  }
                  on="hover"
                />
              )
            }))}
            multiple
            search={this.handleSearch}
            selection
            value={seriesOptions.compareCodes}
            fluid
          />
        </div>
      );

    const filters = (
      <div className="vis-filters vis-options-menu-item">
        <div className="vis-options-menu-label">
          <Image inline src={`/content/images/Assets/indicator-${colorScheme}.svg`} style={{ paddingLeft: '5px', paddingRight: '10px' }} />
          {translate('socioscopeApp.dataSet.visualization.configure.filter')}
        </div>
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
                removable={!dependencies.includes(sliderDim.id)}
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
          <RawDatasetFilters
            dimensionCodes={dimensionCodes}
            dataset={dataset}
            fetchedCodeLists={fetchedCodeLists}
            seriesOptions={seriesOptions}
            setFilterValue={this.props.setFilterValue}
            removeFilter={this.props.removeFilter}
          />
        )}
      </div>
    );

    let advancedOptions = (
      <div>
        {visType !== 'map' && compare}
        {visType !== 'map' && compareCodes}
        {filters}
      </div>
    );

    advancedOptions =
      dataset.id !== 'adolescents' ? (
        advancedOptions
      ) : (
        <Accordion
          style={{
            background: 'transparent',
            boxShadow: 'none'
          }}
        >
          <Accordion.Title
            active={this.state.moreOptions}
            onClick={this.handleOptions}
            style={{
              fontSize: '15px',
              fontFamily: 'Proxima Nova Semibold',
              padding: '10px 0 20px 0'
            }}
          >
            <Icon name="dropdown" />
            {translate('socioscopeApp.dataSet.visualization.configure.options')}
          </Accordion.Title>
          <Accordion.Content
            style={{
              padding: 0
            }}
            active={this.state.moreOptions}
          >
            {advancedOptions}
          </Accordion.Content>
        </Accordion>
      );
    // tslint:disable:jsx-no-lambda
    return (
      <div className="vis-options-menu">
        <div className="vis-options-menu-title">
          <span>{translate('socioscopeApp.dataSet.visualization.configure.menuTitle')}</span>
          <Image onClick={this.props.resetGraph} src="/content/images/Assets/Reset.svg" style={{ cursor: 'pointer' }} />
        </div>

        {visType !== 'map' && (
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
        {buttonGroupDimensions.length > 0 && (
          <div className="button-group-filters">
            <Grid>
              {buttonGroupDimensions.map(dimension => (
                <ButtonGroupFilter
                  key={dimension.id}
                  dimension={dimension}
                  codes={dimensionCodes[dimension.id].codes}
                  dataset={dataset}
                  setFilterValue={this.props.setFilterValue}
                  removeFilter={this.props.removeFilter}
                  seriesOptions={seriesOptions}
                />
              ))}
            </Grid>
          </div>
        )}
        {advancedOptions}
      </div>
    );
  }
}

export default VisSeriesOptionMenu;
