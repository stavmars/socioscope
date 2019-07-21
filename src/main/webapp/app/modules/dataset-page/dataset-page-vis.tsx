/* tslint:disable:max-line-length */
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import qs from 'qs';
import {
  changeCompareBy,
  getSeries,
  initVis,
  setFilterValue,
  setSeriesOptions,
  setVisType
} from 'app/modules/dataset-page/dataset-page-reducer';
import './dataset-page.scss';
import { Dimmer, Dropdown, Grid, Image, Loader, Menu, Responsive } from 'semantic-ui-react';
import { RawDatasetFilters } from 'app/modules/dataset-page/raw-dataset-filters';
import { QbDatasetFilters } from 'app/modules/dataset-page/qb-dataset-filters';
import ChartVis from 'app/modules/visualization/chart-vis';
import { CompareByControl } from 'app/modules/dataset-page/compareBy-control';
import ChoroplethMapVis from 'app/modules/visualization/choropleth-map-vis';
import { translateEntityField } from 'app/shared/util/entity-utils';
import { IRootState } from 'app/shared/reducers';
import { hideHeader, showHeader } from 'app/shared/reducers/header';
import { connect } from 'react-redux';

export interface IDatasetPageVisProp extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export class DatasetPageVis extends React.Component<IDatasetPageVisProp> {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { type } = qs.parse(this.props.location.search, { ignoreQueryPrefix: true });
    this.props.setVisType(type);
    this.props.initVis(this.props.dataset);
  }

  componentDidUpdate(prevProps: IDatasetPageVisProp) {
    if (this.props.dataset !== prevProps.dataset) {
      this.props.initVis(this.props.dataset);
    }
  }

  handleXAxisChange = (e, { value }) => {
    this.props.setSeriesOptions(this.props.dataset, { xAxis: value });
  };

  diagramConfigurationMenu = (visType, colorScheme, xAxisOptions, seriesOptions, dataset, dimensionCodes, fetchedCodeLists) => (
    <div className="vis-options-menu">
      <Menu text>
        <Menu.Item className="vis-options-menu-tittle">
          <div className="vis-options-menu-title">Διαμορφώστε το γράφημα</div>
        </Menu.Item>
      </Menu>
      {visType === 'chart' && (
        <div className="vis-xAxis vis-options-menu-item">
          <div className="vis-options-menu-label">
            <Image inline src={`/content/images/Assets/x-axis-${colorScheme}.svg`} style={{ paddingRight: '23px' }} />
            Θέλω να δω αποτελέσματα για:
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
          <Image inline src={`/content/images/Assets/indicator-${colorScheme}.svg`} style={{ paddingRight: '23px' }} />… σε σχέση με:
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
      {visType === 'chart' && (
        <CompareByControl
          dimensionCodes={dimensionCodes}
          dataset={dataset}
          seriesOptions={seriesOptions}
          changeCompareBy={this.props.changeCompareBy}
        />
      )}
    </div>
  );

  render() {
    const { dataset, seriesOptions, seriesList, dimensionCodes, loadingSeries, fetchedCodeLists, visType } = this.props;
    const { dimensions, colorScheme } = dataset;
    if (!seriesOptions || !fetchedCodeLists) {
      return null;
    }

    const xAxisOptions = dimensions.map(dimension => ({
      id: dimension.id,
      text: translateEntityField(dimension.name),
      value: dimension.id
    }));

    return (
      <div className="dataset-page-vis">
        {!this.props.fetchedCodeLists ? (
          <Dimmer active>
            <Loader />
          </Dimmer>
        ) : (
          <div>
            <Responsive {...Responsive.onlyMobile}>
              <Grid centered>
                <Grid.Row>
                  <Menu fluid text>
                    <Menu.Item style={{ left: '5%' }}>
                      <Image src="/content/images/Assets/mobile-menu-icon.png" />
                    </Menu.Item>
                    <Menu.Item style={{ left: '5%' }}>
                      <h1
                        style={{
                          fontFamily: 'ProximaNovaSemibold',
                          color: '#1E1E1E',
                          fontSize: '12px'
                        }}
                      >
                        Διαμορφώστε το γράφημα
                      </h1>
                    </Menu.Item>
                    <Menu.Item position="right">
                      <Image src="/content/images/Assets/mobile-menu-icon.png" />
                    </Menu.Item>
                    <Menu.Item style={{ marginRight: '5%' }}>
                      <Image src="/content/images/Assets/mobile-menu-icon.png" />
                    </Menu.Item>
                  </Menu>
                </Grid.Row>
                <Grid.Row centered className="vis-container">
                  <ChartVis
                    dataset={dataset}
                    seriesList={seriesList}
                    seriesOptions={seriesOptions}
                    xAxisCodes={dimensionCodes[seriesOptions.xAxis]}
                    loadingSeries={loadingSeries}
                  />
                </Grid.Row>
              </Grid>
            </Responsive>
            <Responsive minWidth={Responsive.onlyTablet.minWidth}>
              <Grid>
                <Grid.Column only="computer tablet" tablet={6} computer={4}>
                  {this.diagramConfigurationMenu(
                    visType,
                    colorScheme,
                    xAxisOptions,
                    seriesOptions,
                    dataset,
                    dimensionCodes,
                    fetchedCodeLists
                  )}
                </Grid.Column>
                <Grid.Column className="vis-container" mobile={16} tablet={10} computer={12}>
                  {visType === 'map' ? (
                    <ChoroplethMapVis
                      dataset={dataset}
                      series={seriesList[0]}
                      seriesOptions={seriesOptions}
                      xAxisCodes={dimensionCodes[seriesOptions.xAxis]}
                      loadingSeries={loadingSeries}
                    />
                  ) : (
                    <ChartVis
                      dataset={dataset}
                      seriesList={seriesList}
                      seriesOptions={seriesOptions}
                      xAxisCodes={dimensionCodes[seriesOptions.xAxis]}
                      loadingSeries={loadingSeries}
                    />
                  )}
                </Grid.Column>
              </Grid>
            </Responsive>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (storeState: IRootState, ownProps) => ({
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
  setSeriesOptions,
  changeCompareBy,
  setFilterValue,
  setVisType,
  initVis
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DatasetPageVis);
