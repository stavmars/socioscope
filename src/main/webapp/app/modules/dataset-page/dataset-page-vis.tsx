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
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import _ from 'lodash';
import { IDimension } from 'app/shared/model/dimension.model';
import { ISeriesPoint } from 'app/shared/model/series-point.model';

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

  prepareTimeSeriesData = (dataPoints: ISeriesPoint[]) => dataPoints.map(dataPoint => [new Date(dataPoint.x).getTime(), dataPoint.y]);

  prepareCategorySeriesData = (codesByNotation, dataPoints: ISeriesPoint[]) =>
    dataPoints.filter(dataPoint => !codesByNotation[dataPoint.x].parentId).map(dataPoint => ({
      name: translateEntityField(codesByNotation[dataPoint.x].name),
      y: dataPoint.y
    }));

  render() {
    const { dataset, seriesOptions, seriesList, dimensionCodes, loadingSeries, fetchedCodeLists } = this.props;

    if (!seriesOptions || !fetchedCodeLists) {
      return null;
    }

    const xAxisOptions = dataset.dimensions.map(dimension => ({
      id: dimension.id,
      text: translateEntityField(dimension.name),
      value: dimension.id
    }));
    const compareByOptions = dataset.dimensions.map(dimension => ({
      id: dimension.id,
      text: translateEntityField(dimension.name),
      value: dimension.id,
      disabled: dimension.id === seriesOptions.xAxis
    }));

    const xAxisDimension = _.find(dataset.dimensions, { id: seriesOptions.xAxis }) as IDimension;

    const chartSeries = loadingSeries
      ? [{ data: [] }]
      : seriesList.map(series => ({
          id: series.id,
          color: series.color,
          data:
            xAxisDimension.type === 'time'
              ? this.prepareTimeSeriesData(series.data)
              : this.prepareCategorySeriesData(dimensionCodes[xAxisDimension.id].codesByNotation, series.data)
        }));

    const measure = seriesOptions.measure ? _.find(dataset.measures, { id: seriesOptions.measure }) : dataset.measures[0];

    const options = {
      chart: { type: xAxisDimension.type === 'time' ? 'spline' : 'column' },
      title: {
        text: undefined
      },
      xAxis: {
        type: xAxisDimension.type === 'time' ? 'datetime' : 'category',
        title: {
          text: translateEntityField(xAxisDimension.name)
        }
      },
      yAxis: {
        title: {
          text: measure.unit
        }
      },
      series: chartSeries,
      credits: {
        enabled: false
      }
    };

    return (
      <div className="dataset-page-vis">
        {!this.props.fetchedCodeLists ? (
          <Dimmer active>
            <Loader />
          </Dimmer>
        ) : (
          <Grid columns={2}>
            <Grid.Column>
              <div>
                <Dropdown
                  onChange={this.handleXAxisChange}
                  options={xAxisOptions}
                  selection
                  fluid
                  placeholder="Επιλέξτε μεταβλητή για τον άξονα x"
                  value={seriesOptions.xAxis}
                />
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
              <div>
                <Dropdown
                  onChange={this.handleCompareByChange}
                  options={compareByOptions}
                  placeholder=""
                  selection
                  value={seriesOptions.compareBy}
                  fluid
                />
              </div>
            </Grid.Column>
            <Grid.Column>
              <div>
                <HighchartsReact highcharts={Highcharts} options={options} />
              </div>
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
