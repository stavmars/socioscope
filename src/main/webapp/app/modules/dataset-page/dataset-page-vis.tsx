/* tslint:disable:max-line-length */
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import {
  changeCompareBy,
  getVisURL,
  initVis,
  IVisOptions,
  removeCompare,
  removeFilter,
  setFilterValue,
  updateVisOptions,
  resetUpdatingVisOptions
} from 'app/modules/dataset-page/dataset-page-reducer';
import './dataset-page.scss';
import { Dimmer, Grid, Loader, Responsive } from 'semantic-ui-react';
import ChartVis, { getChartSubTitle, getChartTitle } from 'app/modules/visualization/chart-vis';
import ChoroplethMapVis from 'app/modules/visualization/choropleth-map-vis';
import { IRootState } from 'app/shared/reducers';
import { hideHeader, showHeader } from 'app/shared/reducers/header';
import { connect } from 'react-redux';
import _ from 'lodash';
import VisMobileUpperToolbar from 'app/modules/dataset-page/vis-mobile-upper-toolbar';
import VisToolbar from 'app/modules/dataset-page/vis-toolbar';
import VisMobileLowerToolbar from 'app/modules/dataset-page/vis-mobile-lower-toolbar';
import VisSeriesOptionMenu from 'app/modules/dataset-page/vis-series-option-menu';
import qs from 'qs';

// tslint:disable:jsx-no-lambda

export interface IDatasetPageVisProp extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export class DatasetPageVis extends React.Component<IDatasetPageVisProp> {
  chartRef = React.createRef<ChartVis>();
  mapRef = React.createRef<ChoroplethMapVis>();

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (this.props.routeVisOptions.visType) {
      this.props.initVis(this.props.dataset, this.props.routeVisOptions);
    } else {
      this.props.initVis(this.props.dataset, {
        visType: 'chart',
        subType: 'column',
        seriesOptions: this.props.dataset.defaultOptions
      });
    }
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

  componentWillUnmount() {
    this.props.resetUpdatingVisOptions();
  }

  togglePercentage = () => {
    const { dataset, visType, subType, seriesOptions } = this.props;
    const measure = dataset.measures.find(m => m.id !== seriesOptions.measure);
    this.props.updateVisOptions(dataset, { visType, subType, seriesOptions: { ...seriesOptions, measure: measure.id } });
  };

  copyCurrentURL = () => {
    const textArea = document.createElement('textarea');
    textArea.value = getVisURL(this.props.dataset.id, {
      visType: this.props.visType,
      subType: this.props.subType,
      seriesOptions: this.props.seriesOptions
    });
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

  exportChartOrMap = action => {
    const ref = this.props.visType === 'map' ? this.mapRef.current : this.chartRef.current;
    switch (action) {
      case 'png':
        ref.exportChart('image/png');
        break;
      case 'pdf':
        ref.exportChart('application/pdf');
        break;
      case 'svg':
        ref.exportChart('image/svg+xml');
        break;
      case 'jpeg':
        ref.exportChart('image/jpeg');
        break;
      case 'print':
        ref.printChart();
        break;
      default:
        break;
    }
  };

  shareChartOrMap = action => {
    const link = getVisURL(this.props.dataset.id, {
      visType: this.props.visType,
      subType: this.props.subType,
      seriesOptions: this.props.seriesOptions
    });
    const sharable = encodeURIComponent(link);
    const chartTitle = encodeURIComponent(getChartTitle(this.props.dataset, this.props.seriesOptions));
    const chartSubTitle = encodeURIComponent(
      getChartSubTitle(this.props.seriesOptions, this.props.dataset.dimensions, this.props.dimensionCodes)
    );
    const left = (screen.width - 570) / 2;
    const top = (screen.height - 570) / 2;
    const params = 'menubar=no,toolbar=no,status=no,width=570,height=570,top=' + top + ',left=' + left;
    let url;
    switch (action) {
      case 'facebook':
        url = 'https://www.facebook.com/sharer.php?u=' + sharable;
        window.open(url, 'NewWindow', params);
        break;
      case 'twitter':
        url = 'https://twitter.com/intent/tweet?text=' + chartTitle + '&url=' + sharable;
        window.open(url, 'NewWindow', params);
        break;
      case 'email':
        url = 'mailto:?to=&body=' + chartTitle + '%0D%0A' + chartSubTitle + '%0D%0A%0D%0A' + sharable;
        window.open(url, 'NewWindow', params);
        break;
      default:
        window.open(link, 'NewWindow', params);
    }
  };

  resetGraph = e =>
    this.props.updateVisOptions(this.props.dataset, {
      visType: this.props.visType,
      subType: this.props.subType,
      seriesOptions: this.props.visType === 'column' || 'bar' ? this.props.dataset.defaultOptions : {}
    });

  render() {
    const {
      dataset,
      seriesOptions,
      seriesList,
      dimensionCodes,
      loadingSeries,
      fetchedCodeLists,
      visType,
      subType,
      updatingVisOptions,
      currentLocale
    } = this.props;

    return (
      <div className="dataset-page-vis">
        {updatingVisOptions || !fetchedCodeLists || !seriesOptions ? (
          <Dimmer active page>
            <Loader />
          </Dimmer>
        ) : (
          <div>
            <Grid verticalAlign="top">
              <Grid.Column only="computer tablet" tablet={15} computer={4}>
                <VisSeriesOptionMenu
                  seriesOptions={seriesOptions}
                  visType={visType}
                  fetchedCodeLists={fetchedCodeLists}
                  dimensionCodes={dimensionCodes}
                  dataset={dataset}
                  setFilterValue={this.props.setFilterValue}
                  updateVisOptions={this.props.updateVisOptions}
                  changeCompareBy={this.props.changeCompareBy}
                  removeFilter={this.props.removeFilter}
                  removeCompare={this.props.removeCompare}
                  resetGraph={this.resetGraph}
                />
              </Grid.Column>
              <Grid.Column mobile={16} tablet={15} computer={12}>
                <Responsive {...Responsive.onlyMobile}>
                  <VisMobileUpperToolbar dataset={dataset} seriesOptions={seriesOptions} visType={visType} subType={subType} />
                </Responsive>
                <Responsive minWidth={Responsive.onlyTablet.minWidth}>
                  <VisToolbar
                    dataset={dataset}
                    seriesOptions={seriesOptions}
                    visType={visType}
                    subType={subType}
                    copyCurrentURL={this.copyCurrentURL}
                    togglePercentage={this.togglePercentage}
                    exportChartOrMap={this.exportChartOrMap}
                    shareChartOrMap={this.shareChartOrMap}
                  />
                </Responsive>
                <div className="vis-container">
                  {visType === 'map' ? (
                    <ChoroplethMapVis
                      className="dataset-page-map"
                      dataset={dataset}
                      series={seriesList[0]}
                      seriesOptions={seriesOptions}
                      dimensionCodes={dimensionCodes}
                      xAxisCodes={dimensionCodes[seriesOptions.xAxis]}
                      loadingSeries={loadingSeries}
                      showButtons
                      ref={this.mapRef}
                    />
                  ) : (
                    <ChartVis
                      className="dataset-page-chart"
                      currentLocale={currentLocale}
                      dataset={dataset}
                      seriesList={seriesList}
                      seriesOptions={seriesOptions}
                      dimensionCodes={dimensionCodes}
                      loadingSeries={loadingSeries}
                      ref={this.chartRef}
                      showLabels
                      showLegend
                      chartType={subType}
                    />
                  )}
                </div>
                <Responsive {...Responsive.onlyMobile}>
                  <VisMobileLowerToolbar
                    dataset={dataset}
                    seriesOptions={seriesOptions}
                    copyCurrentURL={this.copyCurrentURL}
                    togglePercentage={this.togglePercentage}
                    exportChartOrMap={this.exportChartOrMap}
                    shareChartOrMap={this.shareChartOrMap}
                    resetGraph={this.resetGraph}
                  />
                </Responsive>
              </Grid.Column>
            </Grid>
          </div>
        )}
      </div>
    );
  }
}

const parseRouteVisOptions = (query: string): IVisOptions => {
  const {
    type: visType,
    subType: subType,
    x: xAxis,
    compare: compareBy,
    filters: dimensionFilters,
    measure: measure,
    codes: compareCodes
  } = qs.parse(query, { ignoreQueryPrefix: true });
  const seriesOptions = {
    xAxis,
    compareBy,
    dimensionFilters,
    measure,
    compareCodes
  };
  return { visType, subType, seriesOptions };
};

const mapStateToProps = (storeState: IRootState, ownProps) => ({
  routeVisOptions: parseRouteVisOptions(ownProps.location.search),
  dataset: ownProps.dataset,
  dimensionCodes: storeState.datasetPage.dimensionCodes,
  seriesList: storeState.datasetPage.seriesList,
  fetchedCodeLists: storeState.datasetPage.fetchedCodeLists,
  seriesOptions: storeState.datasetPage.seriesOptions,
  loadingSeries: storeState.datasetPage.loadingSeries,
  updatingVisOptions: storeState.datasetPage.updatingVisOptions,
  visType: storeState.datasetPage.visType,
  subType: storeState.datasetPage.subType,
  currentLocale: storeState.locale.currentLocale
});

const mapDispatchToProps = {
  showHeader,
  hideHeader,
  updateVisOptions,
  setFilterValue,
  initVis,
  changeCompareBy,
  removeFilter,
  removeCompare,
  resetUpdatingVisOptions
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DatasetPageVis);
