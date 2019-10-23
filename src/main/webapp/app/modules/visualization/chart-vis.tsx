import React from 'react';
import './chart-vis.scss';
import { translateEntityField } from 'app/shared/util/entity-utils';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
// tslint:disable-next-line
import drilldown from 'highcharts/modules/drilldown.js';
import uuid from 'uuid';
import chroma from 'chroma-js';
import _ from 'lodash';
import { IDimension } from 'app/shared/model/dimension.model';
import { ISeriesPoint } from 'app/shared/model/series-point.model';
import { IDataSet } from 'app/shared/model/data-set.model';
import { ISeries } from 'app/shared/model/series.model';
import { IDimensionFilters, ISeriesOptions } from 'app/shared/model/series-options.model';
import { accentColors, chartColors } from 'app/config/constants';
// tslint:disable:no-submodule-imports
import HC_exporting from 'highcharts/modules/exporting';
import moment from 'moment';

drilldown(Highcharts);
HC_exporting(Highcharts);

export interface IChartVisProp {
  dataset: IDataSet;
  seriesList: ISeries[];
  seriesOptions: ISeriesOptions;
  dimensionCodes: any;
  loadingSeries: boolean;
  showLegend: boolean;
  showLabels: boolean;
  chartType: string;
}

const prepareSeriesByParent = (codesByNotation, seriesList: ISeries[]) =>
  seriesList.reduce((acc, series) => {
    const pointsByParent = _.groupBy(series.data, seriesPoint => codesByNotation[seriesPoint.x].parentId || '');
    _.forEach(pointsByParent, (points, parent) => {
      acc[parent] = acc[parent] || {};
      acc[parent][series.id] = points;
    });
    return acc;
  }, {});

const prepareTimeSeriesData = (dataPoints: ISeriesPoint[]) => {
  let chartPoints = dataPoints.map(dataPoint => [new Date(dataPoint.x).getTime(), dataPoint.y]);
  chartPoints = _.sortBy(chartPoints, 0);
  const startDate = moment(chartPoints[0][0]);
  const endDate = moment(chartPoints[chartPoints.length - 1][0]);

  const resultPoints = [];

  return chartPoints.reduce(
    (newArray, currentPoint, index) => {
      const nextPoint = chartPoints[index + 1];
      if (nextPoint) {
        const currentDate = moment(currentPoint[0]);
        const monthsBetween = moment(nextPoint[0]).diff(currentDate, 'months');

        const fillerPoints = Array.from({ length: monthsBetween - 1 }, (value, monthIndex) => {
          return [
            moment(currentDate)
              .add(monthIndex + 1, 'months')
              .valueOf(),
            0
          ];
        });
        newArray.push(currentPoint, ...fillerPoints);
      } else {
        newArray.push(currentPoint);
      }
      return newArray;
    },
    [] as number[][]
  );
};

const prepareCategorySeriesData = (codesByNotation, seriesPoints: ISeriesPoint[], seriesByParent, order: string) => {
  const chartPoints = seriesPoints.map(seriesPoint => {
    const code = codesByNotation[seriesPoint.x];
    return {
      name: translateEntityField(code.shortName) || translateEntityField(code.name),
      codeOrder: code.order,
      y: seriesPoint.y,
      drilldown: seriesByParent[seriesPoint.x] ? seriesPoint.x : undefined,
      seriesByParent,
      codesByNotation
    };
  });
  switch (order) {
    case 'value_desc':
      return _.orderBy(chartPoints, ['y', 'codeOrder', 'name'], ['desc', 'asc', 'asc']);
    case 'value_asc':
      return _.sortBy(chartPoints, 'y', 'codeOrder', 'name');
    default:
      return _.sortBy(chartPoints, 'codeOrder', 'name');
  }
};

const parseDimensionFilters = (dimensions: IDimension[], dimensionFilters: IDimensionFilters, dimensionCodes: any) => {
  let result = '';
  for (const filter in dimensionFilters) {
    if (dimensionFilters.hasOwnProperty(filter)) {
      const dimension = _.keyBy(dimensions, 'id')[filter];
      result +=
        translateEntityField(dimension.name) +
        ': ' +
        translateEntityField(dimensionCodes[dimension.id].codesByNotation[dimensionFilters[filter]].name) +
        ', ';
    }
  }
  return result.substr(0, result.length - 2);
};

export const getChartTitle = (dataset: IDataSet, seriesOptions: ISeriesOptions) => {
  const { xAxis, compareBy } = seriesOptions;
  const xAxisDimension = _.find(dataset.dimensions, { id: xAxis }) as IDimension;
  return (
    translateEntityField(dataset.name) +
    ': ' +
    translateEntityField(xAxisDimension.name) +
    (compareBy ? ' - ' + translateEntityField(_.find(dataset.dimensions, { id: compareBy }).name) : '')
  );
};

export const getChartSubTitle = (seriesOptions: ISeriesOptions, dimensions: IDimension[], dimensionCodes: any) =>
  !_.isEmpty(seriesOptions.dimensionFilters)
    ? `(${parseDimensionFilters(dimensions, seriesOptions.dimensionFilters, dimensionCodes)})`
    : '';

export class ChartVis extends React.Component<IChartVisProp> {
  innerChart = React.createRef<HighchartsReact>();

  constructor(props) {
    super(props);
  }

  printChart() {
    this.innerChart.current.chart.print();
  }

  exportChart(type) {
    const { dataset, seriesOptions, dimensionCodes } = this.props;
    this.innerChart.current.chart.exportChart(
      { type },
      {
        title: {
          text: getChartTitle(dataset, seriesOptions),
          style: {
            fontSize: '25px'
          }
        },
        subtitle: {
          text: getChartSubTitle(seriesOptions, dataset.dimensions, dimensionCodes)
        }
      }
    );
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.seriesList !== nextProps.seriesList;
  }

  render() {
    const { dataset, seriesOptions, seriesList, dimensionCodes, loadingSeries, showLabels, showLegend } = this.props;
    const { dimensions, colorScheme } = dataset;
    const { compareBy } = seriesOptions;
    const xAxisDimension = _.find(dimensions, { id: seriesOptions.xAxis }) as IDimension;
    let chartSeries = [{ data: [] }] as any;

    let seriesByParent;

    if (!loadingSeries && seriesList && seriesList.length > 0) {
      if (xAxisDimension.type === 'time') {
        chartSeries = _(seriesList)
          .map((series, index) => {
            const code = compareBy && dimensionCodes[compareBy].codesByNotation[series.id];
            return {
              id: series.id,
              name: code ? translateEntityField(code.shortName) || translateEntityField(code.name) : '',
              order: code && code.order,
              color: (code && code.color) || (index ? chartColors[index - 1] : accentColors[colorScheme]),
              data: prepareTimeSeriesData(series.data)
            };
          })
          .sortBy('order', 'name')
          .value();
      } else {
        const codesByNotation =
          xAxisDimension.type === 'composite'
            ? xAxisDimension.composedOf.reduce((acc, dimId) => {
                const dim = _.find(dimensions, { id: dimId });
                acc[dimId] = dim;
                return acc;
              }, {})
            : dimensionCodes[seriesOptions.xAxis].codesByNotation;

        seriesByParent = prepareSeriesByParent(codesByNotation, seriesList);
        if (seriesByParent['']) {
          chartSeries = _(seriesList)
            .map((series, index) => {
              const code =
                (compareBy && dimensionCodes[compareBy].codesByNotation[series.id]) ||
                (xAxisDimension.type === 'composite' && dimensionCodes[xAxisDimension.id].codesByNotation[series.id]);
              return {
                id: series.id,
                name: code ? translateEntityField(code.shortName) || translateEntityField(code.name) : '',
                code,
                color: (code && code.color) || (index ? chartColors[index - 1] : accentColors[colorScheme]),
                order: code && code.order,
                data: prepareCategorySeriesData(
                  codesByNotation,
                  seriesByParent[''][series.id],
                  seriesByParent,
                  seriesList.length === 1 ? xAxisDimension.order : null
                )
              };
            })
            .sortBy('order', 'name')
            .value();

          if (xAxisDimension.type === 'composite') {
            const colorCount = _.filter(chartSeries, series => !series.code.color).length;
            const colors = chroma.scale(['#ffffe0', accentColors[colorScheme]]).colors(colorCount);
            chartSeries = chartSeries.map(series => {
              const color = series.code.color || colors.shift();
              return { ...series, color };
            });
          }
        }
      }
    }

    const measure = seriesOptions.measure ? _.find(dataset.measures, { id: seriesOptions.measure }) : dataset.measures[0];
    const xAxisName = translateEntityField(xAxisDimension.name);
    const dataSetName = translateEntityField(dataset.name);
    const xAxisDesc = translateEntityField(xAxisDimension.description);
    const xAxisText =
      !xAxisDesc || xAxisName === xAxisDesc ? xAxisName : `<div>${xAxisName}</div><div class="x-axis-subtitle">${xAxisDesc}</div>`;
    const options = {
      chart: {
        type: xAxisDimension.type === 'time' ? 'spline' : this.props.chartType === null ? 'column' : this.props.chartType,
        height: window.innerWidth > 768 ? '50%' : null,
        zoomType: 'x',
        className: dataset.colorScheme,
        style: { fontFamily: 'BPnoScript', fontWeight: 'bold' },
        events: {
          // tslint:disable-next-line
          drilldown: function(e) {
            this.addSingleSeriesAsDrilldown(e.point, {
              name: e.point.series.name,
              data: prepareCategorySeriesData(
                e.point.codesByNotation,
                e.point.seriesByParent[e.point.drilldown][e.point.series.id],
                e.point.seriesByParent,
                null
              )
            });
          }
        }
      },
      title: { text: undefined },
      xAxis: {
        type: xAxisDimension.type === 'time' ? 'datetime' : 'category',
        title: {
          useHTML: true,
          text: xAxisText,
          style: { fontSize: window.innerWidth > 768 ? '20px' : '9px' }
        },
        labels: {
          style: { fontFamily: 'Proxima Nova Semibold', fontSize: window.innerWidth > 768 ? '14px' : '9px' }
        },
        offset: 2
      },
      yAxis: {
        title: {
          text: translateEntityField(measure.name),
          style: { fontSize: window.innerWidth > 768 ? '20px' : '10px' }
        },
        labels: {
          style: { fontFamily: 'Proxima Nova Semibold', fontSize: window.innerHeight > 768 ? '14px' : '10px' }
        },
        max: measure.type === 'percentage' && this.props.seriesList.length > 1 ? 100 : null,
        reversedStacks: false
      },
      plotOptions: {
        series: {
          maxPointWidth: 80,
          stacking: true,
          dataLabels: {
            enabled: showLabels,
            format: measure.type === 'percentage' ? '{y:.1f}%' : '{y}',
            style: {
              fontSize: '14px'
            }
          }
        }
      },
      series: chartSeries,
      credits: {
        enabled: false
      },
      tooltip: {
        pointFormat:
          (this.props.seriesList.length > 1 ? '{series.name}: ' : '') + (measure.type === 'percentage' ? '{point.y:.1f}%' : '{point.y}'),
        shared: false
      },
      legend: {
        enabled: showLegend && this.props.seriesList.length > 1,
        useHTML: true,
        labelFormatter() {
          if (this.visible) {
            return '<i class="check circle icon" style="color: ' + this.color + ';"></i>' + this.name;
          }
          return '<i class="circle outline icon"></i>' + this.name;
        },
        itemStyle: {
          fontSize: window.innerHeight > 768 ? '14px' : '10px'
        }
      },
      drilldown: {
        allowPointDrilldown: false
      },
      exporting: {
        buttons: false,
        url: 'http://localhost:7801',
        chartOptions: {
          chart: { height: '100%' }
        }
      }
    };

    // todo investigate another solution to handle problems after updates while drilled-down

    return (
      <div>
        <HighchartsReact
          className={colorScheme}
          key={uuid()}
          highcharts={Highcharts}
          options={options as any}
          immutable
          ref={this.innerChart}
        />
      </div>
    );
  }
}

export default ChartVis;
