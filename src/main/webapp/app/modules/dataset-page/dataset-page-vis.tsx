/* tslint:disable:max-line-length */
import React from 'react';
import { NavLink, RouteComponentProps } from 'react-router-dom';
import qs from 'qs';
import {
  changeCompareBy,
  getSeries,
  initVis,
  IVisOptions,
  setFilterValue,
  updateVisOptions
} from 'app/modules/dataset-page/dataset-page-reducer';
import './dataset-page.scss';
import { Button, Checkbox, Dimmer, Dropdown, Grid, Image, List, Loader, Menu, Popup } from 'semantic-ui-react';
import { RawDatasetFilters } from 'app/modules/dataset-page/raw-dataset-filters';
import { QbDatasetFilters } from 'app/modules/dataset-page/qb-dataset-filters';
import ChartVis from 'app/modules/visualization/chart-vis';
import ChoroplethMapVis from 'app/modules/visualization/choropleth-map-vis';
import { translateEntityField } from 'app/shared/util/entity-utils';
import { IRootState } from 'app/shared/reducers';
import { hideHeader, showHeader, toggleMobileVisMenu } from 'app/shared/reducers/header';
import { connect } from 'react-redux';
import _ from 'lodash';
import { IMeasure } from 'app/shared/model/measure.model';

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

  togglePercentage = (e, { checked }) => {
    const { dataset, visType, seriesOptions } = this.props;
    const measure = _.find(this.props.dataset.measures as IMeasure[], m => (checked ? m.type === 'percentage' : m.type !== 'percentage'));
    this.props.updateVisOptions(dataset, { visType, seriesOptions: { ...seriesOptions, measure: measure.id } });
  };

  handleXAxisChange = (e, { value }) =>
    this.props.updateVisOptions(this.props.dataset, {
      visType: this.props.visType,
      seriesOptions: { xAxis: value }
    });

  diagramConfigurationMenu = (visType, colorScheme, xAxisOptions, seriesOptions, dataset, dimensionCodes, fetchedCodeLists) => (
    <div className="vis-options-menu">
      <div className="vis-options-menu-title">
        <span>Διαμορφώστε το γράφημα</span>
        <Image src="/content/images/Assets/Reset.svg" />
      </div>
      {visType === 'chart' && (
        <div className="vis-xAxis vis-options-menu-item">
          <div className="vis-options-menu-label">
            <Image inline src={`/content/images/Assets/x-axis-${colorScheme}.svg`} style={{ paddingLeft: '5px', paddingRight: '10px' }} />
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
          <Image inline src={`/content/images/Assets/indicator-${colorScheme}.svg`} style={{ paddingLeft: '5px', paddingRight: '10px' }} />…
          σε σχέση με:
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

  copyCurrentURL = (visOptions: IVisOptions) => {
    const encodedVisOptions = urlEncodeVisOptions(visOptions);
    const url =
      window.location.protocol + '/' + window.location.host + '/#/dataset/' + this.props.dataset.id + '/data?' + encodedVisOptions;
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
            <Grid verticalAlign="top">
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
              <Grid.Column mobile={16} tablet={10} computer={12}>
                <div className={`vis-toolbar ${colorScheme}`}>
                  <div className={colorScheme}>
                    <Grid columns="equal">
                      <Grid.Column>
                        <Menu text>
                          {dataset.measures.length === 2 && (
                            <Menu.Item style={{ marginRight: '25px' }}>
                              <Image src="/content/images/Assets/Metric.svg" />
                              <Checkbox
                                className={colorScheme}
                                toggle
                                style={{ margin: '0 6px' }}
                                onChange={this.togglePercentage}
                                checked={_.find(dataset.measures as IMeasure[], { id: seriesOptions.measure }).type === 'percentage'}
                              />
                              <Image src="/content/images/Assets/Percentage.svg" />
                            </Menu.Item>
                          )}
                          <Menu.Item as={NavLink} to="?type=chart" active={visType === 'chart'} style={{ marginRight: '50px' }}>
                            {visType === 'chart' ? (
                              <Image src={`/content/images/Assets/Chart-${colorScheme}.svg`} style={{ marginRight: '20px' }} />
                            ) : (
                              <Image src={`/content/images/Assets/Chart.svg`} style={{ marginRight: '20px' }} />
                            )}
                            Γράφημα
                          </Menu.Item>
                          <Menu.Item as={NavLink} to="?type=map" active={visType === 'map'} style={{ marginRight: '50px' }}>
                            {visType === 'map' ? (
                              <Image src={`/content/images/Assets/Map-${colorScheme}.svg`} style={{ marginRight: '20px' }} />
                            ) : (
                              <Image src={`/content/images/Assets/Map.svg`} style={{ marginRight: '20px' }} />
                            )}
                            Χάρτης
                          </Menu.Item>
                          {/*<Menu.Item as={NavLink} to="?type=list" active={visType === 'list'}>
                      {visType === 'list' ? (
                        <Image src={`/content/images/Assets/List-${colorScheme}.svg`} style={{ marginRight: '20px' }} />
                      ) : (
                        <Image src={`/content/images/Assets/List.svg`} style={{ marginRight: '20px' }} />
                      )}
                      Αποτελέσματα σε λίστα
                    </Menu.Item>*/}
                        </Menu>
                      </Grid.Column>
                      <Grid.Column width={4}>
                        <List floated="right" horizontal>
                          <List.Item>
                            <Image src="/content/images/Assets/Download-icon.svg" />
                          </List.Item>
                          <List.Item>
                            <Dropdown icon="share alternate" className={`share-dropdown ${colorScheme}`} pointing="top right">
                              <Dropdown.Menu>
                                <Popup
                                  on="click"
                                  content="Copied link!"
                                  trigger={
                                    <Dropdown.Item
                                      icon="linkify"
                                      text="Σύνδεσμος"
                                      onClick={() => {
                                        this.copyCurrentURL({ visType, seriesOptions });
                                      }}
                                    />
                                  }
                                  basic
                                />
                                <Dropdown.Item icon="twitter" text="Twitter" disabled />
                                <Dropdown.Item icon="facebook f" text="Facebook" disabled />
                                <Dropdown.Item icon="mail outline" text="Email" disabled />
                              </Dropdown.Menu>
                            </Dropdown>
                          </List.Item>
                          <List.Item>
                            <Image src="/content/images/Assets/Download-icon.svg" />
                          </List.Item>
                        </List>
                      </Grid.Column>
                    </Grid>
                  </div>
                </div>
                <div className="mob-vis-upper-toolbar">
                  <Menu fluid text>
                    <Menu.Item>
                      <Image
                        as={Button}
                        onClick={this.props.toggleMobileVisMenu}
                        style={{ padding: 0, margin: 0 }}
                        src="/content/images/Assets/mobile-menu-icon.png"
                      />
                    </Menu.Item>
                    <Menu.Item>
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
                      <Image src="/content/images/Assets/Reset.svg" />
                    </Menu.Item>
                    <Menu.Item as={NavLink} to="?type=chart">
                      {visType === 'chart' ? (
                        <Image src={`/content/images/Assets/Chart-${colorScheme}.svg`} />
                      ) : (
                        <Image src={`/content/images/Assets/Chart.svg`} />
                      )}
                    </Menu.Item>
                    <Menu.Item style={{ marginRight: '5%' }} as={NavLink} to="?type=map">
                      {visType === 'map' ? (
                        <Image src={`/content/images/Assets/Map-${colorScheme}.svg`} />
                      ) : (
                        <Image src={`/content/images/Assets/Map.svg`} />
                      )}
                    </Menu.Item>
                  </Menu>
                </div>
                <div className="vis-container">
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
                </div>
                <div className="mob-vis-lower-toolbar">
                  <Menu fluid text>
                    <Menu.Item style={{ left: '5%' }}>
                      <Image src="/content/images/Assets/Metric.svg" />
                      <Checkbox className={colorScheme} toggle style={{ margin: '0 6px' }} />
                      <Image src="/content/images/Assets/Percentage.svg" />
                    </Menu.Item>
                    <Menu.Item position="right">
                      <Image src="/content/images/Assets/Download-icon.svg" style={{ width: '34.86px', height: '34.86px' }} />
                    </Menu.Item>
                    <Menu.Item>
                      <Dropdown icon="share alternate" className={`share-dropdown ${colorScheme}`} pointing="top right">
                        <Dropdown.Menu>
                          <Popup
                            on="click"
                            content="Copied link!"
                            trigger={
                              <Dropdown.Item
                                icon="linkify"
                                text="Σύνδεσμος"
                                onClick={() => {
                                  this.copyCurrentURL({ visType, seriesOptions });
                                }}
                              />
                            }
                            basic
                          />
                          <Dropdown.Item icon="twitter" text="Twitter" disabled />
                          <Dropdown.Item icon="facebook f" text="Facebook" disabled />
                          <Dropdown.Item icon="mail outline" text="Email" disabled />
                        </Dropdown.Menu>
                      </Dropdown>
                    </Menu.Item>
                    <Menu.Item style={{ marginRight: '5%' }}>
                      <Image src="/content/images/Assets/mobile-menu-icon.png" />
                    </Menu.Item>
                  </Menu>
                </div>
              </Grid.Column>
            </Grid>
          </div>
        )}
      </div>
    );
  }
}

const parseRouteVisOptions = (query: string): IVisOptions => {
  const { type: visType, x: xAxis, c: compareBy, f: dimensionFilters } = qs.parse(query, { ignoreQueryPrefix: true });
  const seriesOptions = { xAxis, compareBy, dimensionFilters };
  return { visType, seriesOptions };
};

const urlEncodeVisOptions = (visOptions: IVisOptions) => {
  const { visType, seriesOptions = {} } = visOptions;
  return qs.stringify(
    {
      type: visType,
      x: seriesOptions.xAxis,
      c: seriesOptions.compareBy,
      f: seriesOptions.dimensionFilters
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
  changeCompareBy,
  setFilterValue,
  initVis,
  toggleMobileVisMenu
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DatasetPageVis);
