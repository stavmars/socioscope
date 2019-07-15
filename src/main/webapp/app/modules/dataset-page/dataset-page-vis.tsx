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
import { Dimmer, Dropdown, Grid, Loader } from 'semantic-ui-react';
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
                <div className="vis-options-menu-title">Διαμορφώστε το γράφημα</div>
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
