import React from 'react';
import './chart-vis.scss';
import { translateEntityField } from 'app/shared/util/entity-utils';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import drilldown from 'highcharts/modules/drilldown.js';
import uuid from 'uuid';

import _ from 'lodash';
import { IDimension } from 'app/shared/model/dimension.model';
import { ISeriesPoint } from 'app/shared/model/series-point.model';
import { IDataSet } from 'app/shared/model/data-set.model';
import { ISeries } from 'app/shared/model/series.model';
import { ISeriesOptions } from 'app/shared/model/series-options.model';

drilldown(Highcharts);

export interface IChartVisProp {
  dataset: IDataSet;
  seriesList: ISeries[];
  seriesOptions: ISeriesOptions;
  xAxisCodes: any;
  loadingSeries: boolean;
}

const prepareSeriesByParent = (codesByNotation, seriesList: ISeries[]) =>
  seriesList.reduce((acc, series) => {
    const pointsByParent = _.groupBy(series.data, seriesPoint => codesByNotation[seriesPoint.x].parentId);
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

  render() {
    const { dataset, seriesOptions, seriesList, xAxisCodes, loadingSeries } = this.props;
    const { dimensions, colorScheme } = dataset;

    const xAxisDimension = _.find(dimensions, { id: seriesOptions.xAxis }) as IDimension;

    let chartSeries = [{ data: [] }];

    let seriesByParent;

    if (!loadingSeries) {
      if (xAxisDimension.type === 'time') {
        chartSeries = seriesList.map(series => ({
          id: series.id,
          color: series.color,
          data: prepareTimeSeriesData(series.data)
        }));
      } else {
        seriesByParent = prepareSeriesByParent(xAxisCodes.codesByNotation, seriesList);
        chartSeries = seriesList.map(series => ({
          id: series.id,
          color: series.color,
          data: prepareCategorySeriesData(xAxisCodes.codesByNotation, seriesByParent[''][series.id], seriesByParent)
        }));
      }
    }

    const measure = seriesOptions.measure ? _.find(dataset.measures, { id: seriesOptions.measure }) : dataset.measures[0];

    const options = {
      chart: {
        type: xAxisDimension.type === 'time' ? 'spline' : 'column',
        height: '640px',
        zoomType: 'x',
        styledMode: true,
        className: dataset.colorScheme,
        events: {
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
          text: translateEntityField(xAxisDimension.name)
        }
      },
      yAxis: {
        title: {
          text: measure.unit
        }
      },
      plotOptions: {
        series: {
          maxPointWidth: 80
        }
      },
      series: chartSeries,
      credits: {
        enabled: false
      },
      drilldown: {
        allowPointDrilldown: false
      }
    };

    return (
      <div>
        <HighchartsReact key={uuid()} highcharts={Highcharts} options={options} immutable />
      </div>
    );
  }
}

export default ChartVis;
