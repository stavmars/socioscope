import React from 'react';
import './chart-vis.scss';
import { translateEntityField } from 'app/shared/util/entity-utils';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
// tslint:disable-next-line
import drilldown from 'highcharts/modules/drilldown.js';
import uuid from 'uuid';

import _ from 'lodash';
import { IDimension } from 'app/shared/model/dimension.model';
import { ISeriesPoint } from 'app/shared/model/series-point.model';
import { IDataSet } from 'app/shared/model/data-set.model';
import { ISeries } from 'app/shared/model/series.model';
import { ISeriesOptions } from 'app/shared/model/series-options.model';
import { accentColors, chartColors } from 'app/config/constants';

drilldown(Highcharts);

export interface IChartVisProp {
  dataset: IDataSet;
  seriesList: ISeries[];
  seriesOptions: ISeriesOptions;
  dimensionCodes: any;
  loadingSeries: boolean;
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

const prepareTimeSeriesData = (dataPoints: ISeriesPoint[]) => dataPoints.map(dataPoint => [new Date(dataPoint.x).getTime(), dataPoint.y]);

const prepareCategorySeriesData = (codesByNotation, seriesPoints: ISeriesPoint[], seriesByParent) => {
  const chartPoints = seriesPoints.map(seriesPoint => {
    const code = codesByNotation[seriesPoint.x];
    return {
      name: translateEntityField(code.name),
      codeOrder: code.order,
      y: seriesPoint.y,
      drilldown: seriesByParent[seriesPoint.x] ? seriesPoint.x : undefined,
      seriesByParent,
      codesByNotation
    };
  });
  return _.sortBy(chartPoints, 'codeOrder', 'name');
};

export class ChartVis extends React.Component<IChartVisProp> {
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.seriesList !== nextProps.seriesList;
  }

  render() {
    const { dataset, seriesOptions, seriesList, dimensionCodes, loadingSeries } = this.props;
    const { dimensions, colorScheme } = dataset;
    const { compareBy } = seriesOptions;
    const xAxisDimension = _.find(dimensions, { id: seriesOptions.xAxis }) as IDimension;
    let chartSeries = [{ data: [] }];

    let seriesByParent;

    if (!loadingSeries && seriesList && seriesList.length > 0) {
      if (xAxisDimension.type === 'time') {
        chartSeries = seriesList.map((series, index) => ({
          id: series.id,
          name: compareBy && translateEntityField(dimensionCodes[compareBy].codesByNotation[series.id].name),
          color: index ? chartColors[index - 1] : accentColors[colorScheme],
          data: prepareTimeSeriesData(series.data)
        }));
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
          chartSeries = seriesList.map((series, index) => ({
            id: series.id,
            name:
              (compareBy && translateEntityField(dimensionCodes[compareBy].codesByNotation[series.id].name)) ||
              (xAxisDimension.type === 'composite' &&
                translateEntityField(dimensionCodes[xAxisDimension.id].codesByNotation[series.id].name)),
            color: index ? chartColors[index - 1] : accentColors[colorScheme],
            data: prepareCategorySeriesData(codesByNotation, seriesByParent[''][series.id], seriesByParent)
          }));
        }
      }
    }

    const measure = seriesOptions.measure ? _.find(dataset.measures, { id: seriesOptions.measure }) : dataset.measures[0];

    const options = {
      chart: {
        type: xAxisDimension.type === 'time' ? 'spline' : 'column',
        height: '50%',
        zoomType: 'x',
        className: dataset.colorScheme,
        events: {
          // tslint:disable-next-line
          drilldown: function(e) {
            this.addSingleSeriesAsDrilldown(e.point, {
              name: e.point.series.name,
              data: prepareCategorySeriesData(
                e.point.codesByNotation,
                e.point.seriesByParent[e.point.drilldown][e.point.series.id],
                e.point.seriesByParent
              )
            });
          }
        }
      },
      title: {
        text: undefined
      },
      xAxis: {
        type: xAxisDimension.type === 'time' ? 'datetime' : 'category',
        title: {
          text: translateEntityField(xAxisDimension.name),
          style: { fontFamily: 'BPnoScriptBold', fontSize: '12px' }
        },
        labels: {
          style: { fontFamily: 'BPnoScriptBold', fontSize: '16px' }
        },
        offset: 2
      },
      yAxis: {
        title: {
          text: translateEntityField(measure.name),
          style: { fontFamily: 'BPnoScriptBold', fontSize: '12px' }
        },
        labels: {
          style: { fontFamily: 'BPnoScriptBold', fontSize: '16px' }
        }
      },
      plotOptions: {
        series: {
          maxPointWidth: 80,
          stacking: true
        }
      },
      series: chartSeries,
      credits: {
        enabled: false
      },
      legend: {
        enabled: false
      },
      drilldown: {
        allowPointDrilldown: false
      }
    };

    // todo investigate another solution to handle problems after updates while drilled-down

    return (
      <div>
        <HighchartsReact className={colorScheme} key={uuid()} highcharts={Highcharts} options={options as any} immutable />
      </div>
    );
  }
}

export default ChartVis;
