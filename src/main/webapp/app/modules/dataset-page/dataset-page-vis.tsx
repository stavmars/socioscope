/* tslint:disable:max-line-length */
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import qs from 'qs';
import {
  getSeries,
  initVis,
  IVisOptions,
  removeFilter,
  setFilterValue,
  toggleCompareValue,
  updateVisOptions
} from 'app/modules/dataset-page/dataset-page-reducer';
import './dataset-page.scss';
import { Dimmer, Grid, Loader, Responsive } from 'semantic-ui-react';
import ChartVis from 'app/modules/visualization/chart-vis';
import ChoroplethMapVis from 'app/modules/visualization/choropleth-map-vis';
import { IRootState } from 'app/shared/reducers';
import { hideHeader, showHeader } from 'app/shared/reducers/header';
import { connect } from 'react-redux';
import _ from 'lodash';
import VisMobileUpperToolbar from 'app/modules/dataset-page/vis-mobile-upper-toolbar';
import VisToolbar from 'app/modules/dataset-page/vis-toolbar';
import VisMobileLowerToolbar from 'app/modules/dataset-page/vis-mobile-lower-toolbar';
import VisSeriesOptionMenu from 'app/modules/dataset-page/vis-series-option-menu';
import VisColumnButtons from './vis-column-buttons';

// tslint:disable:jsx-no-lambda

export interface IDatasetPageVisProp extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export class DatasetPageVis extends React.Component<IDatasetPageVisProp> {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.initVis(this.props.dataset, this.props.routeVisOptions);
  }

  componentDidUpdate(prevProps: IDatasetPageVisProp) {
    if (this.props.dataset !== prevProps.dataset) {
      this.props.initVis(this.props.dataset, this.props.routeVisOptions);
      return;
    }
    if (!_.isEqual(prevProps.routeVisOptions, this.props.routeVisOptions)) {
      this.props.updateVisOptions(this.props.dataset, this.props.routeVisOptions);
    }
  }

  togglePercentage = () => {
    const { dataset, visType, seriesOptions } = this.props;
    const measure = dataset.measures.find(m => m.id !== seriesOptions.measure);
    this.props.updateVisOptions(dataset, { visType, seriesOptions: { ...seriesOptions, measure: measure.id } });
  };

  copyCurrentURL = () => {
    const encodedVisOptions = urlEncodeVisOptions({ visType: this.props.visType, seriesOptions: this.props.seriesOptions });
    const url =
      window.location.protocol + '//' + window.location.host + '/#/dataset/' + this.props.dataset.id + '/data?' + encodedVisOptions;
    const textArea = document.createElement('textarea');
    textArea.value = url;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      const successful = document.execCommand('copy');
      // const msg = successful ? 'Copied text!' : 'Copied Failed!';
      // console.log('Copying text command was ' + msg);
    } catch (err) {
      // console.log('Oops, unable to copy');
    }
    document.body.removeChild(textArea);
  };

  render() {
    const { dataset, seriesOptions, seriesList, dimensionCodes, loadingSeries, fetchedCodeLists, visType } = this.props;
    if (!seriesOptions || !fetchedCodeLists) {
      return null;
    }

    return (
      <div className="dataset-page-vis">
        {!this.props.fetchedCodeLists ? (
          <Dimmer active>
            <Loader />
          </Dimmer>
        ) : (
          <div>
            <Grid verticalAlign="top">
              <Grid.Column only="computer tablet" tablet={6} computer={4}>
                <VisSeriesOptionMenu
                  seriesOptions={seriesOptions}
                  visType={visType}
                  fetchedCodeLists={fetchedCodeLists}
                  dimensionCodes={dimensionCodes}
                  dataset={dataset}
                  setFilterValue={this.props.setFilterValue}
                  updateVisOptions={this.props.updateVisOptions}
                  toggleCompareValue={this.props.toggleCompareValue}
                  removeFilter={this.props.removeFilter}
                />
              </Grid.Column>
              <Grid.Column mobile={16} tablet={dataset.id === 'teenagers' ? 6 : 10} computer={dataset.id === 'teenagers' ? 9 : 12}>
                <Responsive {...Responsive.onlyMobile}>
                  <VisMobileUpperToolbar dataset={dataset} seriesOptions={seriesOptions} visType={visType} />
                </Responsive>
                <Responsive minWidth={Responsive.onlyTablet.minWidth}>
                  <VisToolbar
                    dataset={dataset}
                    seriesOptions={seriesOptions}
                    visType={visType}
                    copyCurrentURL={this.copyCurrentURL}
                    togglePercentage={this.togglePercentage}
                  />
                </Responsive>
                <div className="vis-container">
                  {visType === 'map' ? (
                    <ChoroplethMapVis
                      dataset={dataset}
                      series={seriesList[0]}
                      seriesOptions={seriesOptions}
                      xAxisCodes={dimensionCodes[seriesOptions.xAxis]}
                      loadingSeries={loadingSeries}
                      showButtons
                    />
                  ) : (
                    <ChartVis
                      dataset={dataset}
                      seriesList={seriesList}
                      seriesOptions={seriesOptions}
                      dimensionCodes={dimensionCodes}
                      loadingSeries={loadingSeries}
                    />
                  )}
                </div>
                <Responsive {...Responsive.onlyMobile}>
                  {dataset.id === 'teenagers' && (
                    <VisColumnButtons dataset={dataset} seriesOptions={seriesOptions} dimensionCodes={dimensionCodes} />
                  )}
                  <VisMobileLowerToolbar dataset={dataset} copyCurrentURL={this.copyCurrentURL} togglePercentage={this.togglePercentage} />
                </Responsive>
              </Grid.Column>
              {dataset.id === 'teenagers' && (
                <Grid.Column only="computer tablet" tablet={4} computer={3} verticalAlign="middle">
                  <VisColumnButtons dataset={dataset} seriesOptions={seriesOptions} dimensionCodes={dimensionCodes} />
                </Grid.Column>
              )}
            </Grid>
          </div>
        )}
      </div>
    );
  }
}

const parseRouteVisOptions = (query: string): IVisOptions => {
  const { type: visType, x: xAxis, compare: compareBy, filters: dimensionFilters, measure: measure, codes: compareCodes } = qs.parse(
    query,
    { ignoreQueryPrefix: true }
  );
  const seriesOptions = {
    xAxis,
    compareBy,
    dimensionFilters,
    measure,
    compareCodes
  };
  return { visType, seriesOptions };
};

export const urlEncodeVisOptions = (visOptions: IVisOptions) => {
  const { visType, seriesOptions = {} } = visOptions;
  return qs.stringify(
    {
      type: visType,
      x: seriesOptions.xAxis,
      compare: seriesOptions.compareBy,
      filters: seriesOptions.dimensionFilters,
      measure: seriesOptions.measure,
      codes: seriesOptions.compareCodes
    },
    { skipNulls: true }
  );
};

const mapStateToProps = (storeState: IRootState, ownProps) => ({
  routeVisOptions: parseRouteVisOptions(ownProps.location.search),
  dataset: ownProps.dataset,
  dimensionCodes: storeState.datasetPage.dimensionCodes,
  seriesList: storeState.datasetPage.seriesList,
  fetchedCodeLists: storeState.datasetPage.fetchedCodeLists,
  seriesOptions: storeState.datasetPage.seriesOptions,
  loadingSeries: storeState.datasetPage.loadingSeries,
  visType: storeState.datasetPage.visType
});

const mapDispatchToProps = {
  getSeries,
  showHeader,
  hideHeader,
  updateVisOptions,
  setFilterValue,
  initVis,
  toggleCompareValue,
  removeFilter
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DatasetPageVis);
