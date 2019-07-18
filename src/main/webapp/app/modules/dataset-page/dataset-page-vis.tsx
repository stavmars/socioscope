/* tslint:disable:max-line-length */
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { changeCompareBy, getSeries, initVis, resetSeriesOptions, setFilterValue } from 'app/modules/dataset-page/dataset-page-reducer';
import { IRootState } from 'app/shared/reducers';
import './dataset-page.scss';
import { hideHeader, showHeader } from 'app/shared/reducers/header';
import { Dimmer, Dropdown, Grid, Loader, Menu, Image, Container } from 'semantic-ui-react';
import { translateEntityField } from 'app/shared/util/entity-utils';
import { RawDatasetFilters } from 'app/modules/dataset-page/raw-dataset-filters';
import { QbDatasetFilters } from 'app/modules/dataset-page/qb-dataset-filters';
import ChartVis from 'app/modules/visualization/chart-vis';
import { CompareByControl } from 'app/modules/dataset-page/compareBy-control';

export interface IDatasetPageVisProp extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export class DatasetPageVis extends React.Component<IDatasetPageVisProp> {
  constructor(props) {
    super(props);
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

    return (
      <div className="dataset-page-vis">
        {!this.props.fetchedCodeLists ? (
          <Dimmer active>
            <Loader />
          </Dimmer>
        ) : (
          <Grid>
            <Grid.Column only="computer tablet" tablet={6} computer={4}>
              <div className="vis-options-menu">
                <Menu text>
                  <Menu.Item className="vis-options-menu-tittle">
                    <div className="vis-options-menu-title">Διαμορφώστε το γράφημα</div>
                  </Menu.Item>
                </Menu>
                <div className="vis-xAxis vis-options-menu-item">
                  <div className="vis-options-menu-label">
                    <Image inline src={`/content/images/Assets/x-axis-${dataset.colorScheme}.svg`} style={{ paddingRight: '23px' }} />
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
                    <Image inline src={`/content/images/Assets/indicator-${dataset.colorScheme}.svg`} style={{ paddingRight: '23px' }} />…
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
                <CompareByControl
                  dimensionCodes={dimensionCodes}
                  dataset={dataset}
                  seriesOptions={seriesOptions}
                  colorsAccent={colorsAccent}
                  changeCompareBy={this.props.changeCompareBy}
                />
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
