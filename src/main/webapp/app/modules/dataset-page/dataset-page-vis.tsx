import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { changeCompareBy, changeXAxis, getSeries, initVis, setFilterValue } from 'app/modules/dataset-page/dataset-page-reducer';
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
    this.props.changeXAxis(value);
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
                  <div className="vis-options-menu-label">Θέλω να δω αποτελέσματα για:</div>
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
                  <div className="vis-options-menu-label">… σε σχέση με:</div>
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
                  <div className="vis-options-menu-label">… και να συγκρίνω ως προς:</div>
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
  changeXAxis,
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
