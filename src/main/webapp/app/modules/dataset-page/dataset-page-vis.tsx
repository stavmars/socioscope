/* tslint:disable:max-line-length */
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  changeCompareBy,
  changeXAxis,
  getSeries,
  initVis,
  resetSeriesOptions,
  setFilterValue
} from 'app/modules/dataset-page/dataset-page-reducer';
import { IRootState } from 'app/shared/reducers';
import './dataset-page.scss';
import { hideHeader, showHeader } from 'app/shared/reducers/header';
import { Dimmer, Dropdown, Grid, Loader, Menu } from 'semantic-ui-react';
import { translateEntityField } from 'app/shared/util/entity-utils';
import { RawDatasetFilters } from 'app/modules/dataset-page/raw-dataset-filters';
import { QbDatasetFilters } from 'app/modules/dataset-page/qb-dataset-filters';
import ChartVis from 'app/modules/visualization/chart-vis';

export interface IDatasetPageVisProp extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export interface IDatasetPageVisState {
  activeIndex: string;
}

export class DatasetPageVis extends React.Component<IDatasetPageVisProp, IDatasetPageVisState> {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: null
    };
  }

  componentDidMount() {
    this.props.initVis(this.props.dataset);
  }

  componentDidUpdate(prevProps: IDatasetPageVisProp) {
    if (this.props.dataset !== prevProps.dataset) {
      this.props.initVis(this.props.dataset);
    }
  }

  handleXAxisChange = (e, { value }) => {
    this.props.resetSeriesOptions(this.props.dataset, value);
  };

  handleCompareByChange = (e, { value }) => this.props.changeCompareBy(value);

  handleAccordionClick = (e, titleProps) => {
    e.stopPropagation();
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;

    this.setState({ activeIndex: newIndex });
  };

  render() {
    const { dataset, seriesOptions, seriesList, dimensionCodes, loadingSeries, fetchedCodeLists } = this.props;
    const { dimensions, colorScheme } = dataset;
    if (!seriesOptions || !fetchedCodeLists) {
      return null;
    }
    const colorsAccent = {};
    colorsAccent['color-scheme-1'] = '#d146fc';
    colorsAccent['color-scheme-2'] = '#2f7cff';
    colorsAccent['color-scheme-3'] = '#ff5d39';

    const xAxisOptions = dimensions.map(dimension => ({
      id: dimension.id,
      text: translateEntityField(dimension.name),
      value: dimension.id
    }));
    const compareByOptions = dimensions.map(dimension => ({
      id: dimension.id,
      text: translateEntityField(dimension.name),
      value: dimension.id,
      disabled: dimension.id === seriesOptions.xAxis
    }));

    return (
      <div className="dataset-page-vis">
        {!this.props.fetchedCodeLists ? (
          <Dimmer active>
            <Loader />
          </Dimmer>
        ) : (
          <Grid>
            <Grid.Column mobile={16} tablet={6} computer={4}>
              <div className="vis-options-menu">
                <Menu text>
                  <Menu.Item className="vis-options-menu-tittle">
                    <div className="vis-options-menu-title">Διαμορφώστε το γράφημα</div>
                  </Menu.Item>
                </Menu>
                <div className="vis-xAxis vis-options-menu-item">
                  <div className="vis-options-menu-label">
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="20" viewBox="0 0 30 20" fill={colorsAccent[colorScheme]}>
                      <defs />
                      <path
                        className="a"
                        d="M1054.107-433.193l3.533,3.385h-8.112v-2.457h-1.15v2.457h-4.964v-2.457h-1.15v2.457h-4.731v-14.561h-1.15v15.746h21.258l-3.535,3.386.784.868,5.056-4.845-5.056-4.846Z"
                        transform="translate(-1036.385 444.369)"
                      />
                      <path
                        className="a"
                        d="M1063.187-432.669l-.707-.707-1.709,1.709-1.709-1.709-.707.707,1.709,1.709-1.709,1.709.707.707,1.709-1.709,1.709,1.709.707-.707-1.709-1.709Z"
                        transform="translate(-1033.187 446.105)"
                      />
                    </svg>{' '}
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
                <div className="vis-filters vis-options-menu-item">
                  <div className="vis-options-menu-label">
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="20" viewBox="0 0 30 20" fill={colorsAccent[colorScheme]}>
                      <defs />
                      <g transform="translate(-1036.885 400.711)">
                        <rect className="a" width="6.283" height="20" transform="translate(1036.885 -400.711)" />
                        <rect className="a" width="6.283" height="15.336" transform="translate(1044.79 -396.047)" />
                        <rect className="a" width="6.283" height="10.769" transform="translate(1052.696 -391.48)" />
                        <rect className="a" width="6.283" height="7.668" transform="translate(1060.602 -388.379)" />
                      </g>
                    </svg>{' '}
                    … σε σχέση με:
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
                <div className="vis-compareBy vis-options-menu-item">
                  <div className="vis-options-menu-label">
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="20" viewBox="0 0 30 20" fill={colorsAccent[colorScheme]}>
                      <defs />
                      <g transform="translate(-1036.885 363.024)">
                        <rect className="a" width="6.283" height="6.45" transform="translate(1036.885 -363.024)" />
                        <rect className="a" width="6.283" height="6.45" transform="translate(1036.885 -354.724)" />
                        <rect className="a" width="6.283" height="3.225" transform="translate(1036.885 -346.424)" />
                        <rect className="a" width="6.283" height="4.352" transform="translate(1044.79 -357.624)" />
                        <rect className="a" width="6.283" height="4.352" transform="translate(1044.79 -351.499)" />
                        <rect className="a" width="6.283" height="2.176" transform="translate(1044.79 -345.375)" />
                        <rect className="a" width="6.283" height="4.006" transform="translate(1052.696 -353.874)" />
                        <rect className="a" width="6.283" height="5.075" transform="translate(1052.696 -348.274)" />
                        <rect className="a" width="6.283" height="2.526" transform="translate(1060.602 -350.8)" />
                        <rect className="a" width="6.283" height="3.4" transform="translate(1060.602 -346.424)" />
                      </g>
                    </svg>{' '}
                    … και να συγκρίνω ως προς:
                  </div>
                  <Dropdown
                    className={`vis-options-dropdown ${colorScheme}`}
                    onChange={this.handleCompareByChange}
                    options={compareByOptions}
                    placeholder=""
                    selection
                    value={seriesOptions.compareBy}
                    fluid
                  />
                </div>
              </div>
            </Grid.Column>
            <Grid.Column className="vis-container" mobile={16} tablet={10} computer={12}>
              <div>
                <div id="data_switches_blue">
                  <div id="Group_123">
                    <div id="baseline_bar_chart_24px">
                      <svg className="Path_835" viewBox="5 5 14 14">
                        <path
                          id="Path_835"
                          d="M 5 9.199999809265137 L 8 9.199999809265137 L 8 19 L 5 19 L 5 9.199999809265137 Z M 10.60000038146973 5 L 13.40000057220459 5 L 13.40000057220459 19 L 10.60000038146973 19 L 10.60000038146973 5 Z M 16.20000076293945 13 L 19 13 L 19 19 L 16.20000076293945 19 L 16.20000076293945 13 Z"
                        />
                      </svg>
                      <svg className="Path_836" viewBox="0 0 24 24">
                        <path id="Path_836" d="M 0 0 L 24 0 L 24 24 L 0 24 L 0 0 Z" />
                      </svg>
                    </div>
                  </div>
                  <div id="Group_124">
                    <div id="baseline_map_24px">
                      <svg className="Path_837" viewBox="3 3 18 18">
                        <path
                          id="Path_837"
                          d="M 20.5 3 L 20.34000015258789 3.029999971389771 L 15 5.099999904632568 L 9 3 L 3.359999895095825 4.900000095367432 C 3.149999856948853 4.970000267028809 3 5.150000095367432 3 5.380000114440918 L 3 20.5 C 3 20.78000068664551 3.220000028610229 21 3.5 21 L 3.660000085830688 20.96999931335449 L 9 18.89999961853027 L 15 21 L 20.63999938964844 19.10000038146973 C 20.84999847412109 19.03000068664551 21 18.85000038146973 21 18.6200008392334 L 21 3.5 C 21 3.220000028610229 20.78000068664551 3 20.5 3 Z M 15 19 L 9 16.88999938964844 L 9 5 L 15 7.109999656677246 L 15 19 Z"
                        />
                      </svg>
                      <svg className="Path_838" viewBox="0 0 24 24">
                        <path id="Path_838" d="M 0 0 L 24 0 L 24 24 L 0 24 L 0 0 Z" />
                      </svg>
                    </div>
                  </div>
                  <div id="_______">
                    <span>Γράφημα</span>
                  </div>
                  <div id="______">
                    <span>Χάρτης</span>
                  </div>
                  <div id="_____________________">
                    <span>Αποτελέσματα σε λίστα</span>
                  </div>
                  <svg className="Line_71">
                    <path id="Line_71" d="M 0 0 L 13 0" />
                  </svg>
                  <svg className="Line_72">
                    <path id="Line_72" d="M 0 0 L 13 0" />
                  </svg>
                  <svg className="Line_73">
                    <path id="Line_73" d="M 0 0 L 13 0" />
                  </svg>
                  <div id="Group_122">
                    <svg className="Path_1157" viewBox="0 0 45 45">
                      <path
                        id="Path_1157"
                        d="M 22.5 0 C 34.92640686035156 0 45 10.07359409332275 45 22.5 C 45 34.92640686035156 34.92640686035156 45 22.5 45 C 10.07359409332275 45 0 34.92640686035156 0 22.5 C 0 10.07359409332275 10.07359409332275 0 22.5 0 Z"
                      />
                    </svg>
                    <div id="Group_121">
                      <svg className="Path_831" viewBox="0 0 24 24">
                        <path id="Path_831" d="M 0 0 L 24 0 L 24 24 L 0 24 L 0 0 Z" />
                      </svg>
                      <svg className="Path_832" viewBox="3 2 18 19.92">
                        <path
                          id="Path_832"
                          d="M 18 16.07999992370605 C 17.23999977111816 16.07999992370605 16.55999946594238 16.3799991607666 16.04000091552734 16.85000038146973 L 8.909999847412109 12.69999980926514 C 8.960000038146973 12.47000026702881 9 12.23999977111816 9 12 C 9 11.76000022888184 8.960000038146973 11.52999973297119 8.909999847412109 11.30000019073486 L 15.96000003814697 7.190000057220459 C 16.5 7.690000057220459 17.20999908447266 8 18 8 C 19.65999984741211 8 21 6.659999847412109 21 5 C 21 3.339999914169312 19.65999984741211 2 18 2 C 16.34000015258789 2 15 3.339999914169312 15 5 C 15 5.239999771118164 15.03999996185303 5.46999979019165 15.09000015258789 5.699999809265137 L 8.039999961853027 9.810000419616699 C 7.5 9.310000419616699 6.789999961853027 9 6 9 C 4.340000152587891 9 3 10.34000015258789 3 12 C 3 13.65999984741211 4.340000152587891 15 6 15 C 6.789999961853027 15 7.5 14.6899995803833 8.039999961853027 14.1899995803833 L 15.15999984741211 18.35000038146973 C 15.10999965667725 18.55999946594238 15.07999992370605 18.78000068664551 15.07999992370605 19 C 15.07999992370605 20.61000061035156 16.38999938964844 21.92000007629395 18 21.92000007629395 C 19.61000061035156 21.92000007629395 20.92000007629395 20.61000061035156 20.92000007629395 19 C 20.92000007629395 17.38999938964844 19.61000061035156 16.07999992370605 18 16.07999992370605 Z"
                        />
                      </svg>
                    </div>
                    <svg className="Path_1158" viewBox="0 0 45 45">
                      <path
                        id="Path_1158"
                        d="M 22.5 0 C 34.92640686035156 0 45 10.07359409332275 45 22.5 C 45 34.92640686035156 34.92640686035156 45 22.5 45 C 10.07359409332275 45 0 34.92640686035156 0 22.5 C 0 10.07359409332275 10.07359409332275 0 22.5 0 Z"
                      />
                    </svg>
                    <svg className="Ellipse_37">
                      <ellipse id="Ellipse_37" rx="22.5" ry="22.5" cx="22.5" cy="22.5" />
                    </svg>
                    <div id="baseline_save_alt_24px">
                      <svg className="Path_833" viewBox="3 3 22.5 22.5">
                        <path
                          id="Path_833"
                          d="M 23 14.25 L 23 23 L 5.5 23 L 5.5 14.25 L 3 14.25 L 3 23 C 3 24.375 4.125 25.5 5.5 25.5 L 23 25.5 C 24.375 25.5 25.5 24.375 25.5 23 L 25.5 14.25 L 23 14.25 Z M 15.5 15.08749961853027 L 18.73749923706055 11.86250019073486 L 20.5 13.625 L 14.25 19.875 L 8 13.625 L 9.762499809265137 11.86250019073486 L 13 15.08749961853027 L 13 3 L 15.5 3 L 15.5 15.08749961853027 Z"
                        />
                      </svg>
                      <svg className="Path_834" viewBox="0 0 30 30">
                        <path id="Path_834" d="M 0 0 L 30 0 L 30 30 L 0 30 L 0 0 Z" />
                      </svg>
                    </div>
                    <div id="_">
                      <span>?</span>
                    </div>
                  </div>
                </div>
                <svg className="Path_1182" viewBox="0 0 139 3">
                  <path id="Path_1182" d="M 0 0 L 139 0" />
                </svg>
              </div>
              <ChartVis
                dataset={dataset}
                seriesList={seriesList}
                seriesOptions={seriesOptions}
                xAxisCodes={dimensionCodes[seriesOptions.xAxis]}
                loadingSeries={loadingSeries}
              />
            </Grid.Column>
          </Grid>
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
  loadingSeries: storeState.datasetPage.loadingSeries
});

const mapDispatchToProps = {
  getSeries,
  showHeader,
  hideHeader,
  resetSeriesOptions,
  changeCompareBy,
  setFilterValue,
  initVis
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DatasetPageVis);
