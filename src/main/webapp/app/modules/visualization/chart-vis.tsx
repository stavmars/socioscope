import React from 'react';
import './chart-vis.scss';
import { translateEntityField } from 'app/shared/util/entity-utils';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import _ from 'lodash';
import { IDimension } from 'app/shared/model/dimension.model';
import { ISeriesPoint } from 'app/shared/model/series-point.model';
import { IDataSet } from 'app/shared/model/data-set.model';
import { ISeries } from 'app/shared/model/series.model';
import { ISeriesOptions } from 'app/shared/model/series-options.model';

export interface IChartVisProp {
  dataset: IDataSet;
  seriesList: ISeries[];
  seriesOptions: ISeriesOptions;
  xAxisCodes: any;
  loadingSeries: boolean;
}

export class ChartVis extends React.Component<IChartVisProp> {
  constructor(props) {
    super(props);
  }

  prepareTimeSeriesData = (dataPoints: ISeriesPoint[]) => dataPoints.map(dataPoint => [new Date(dataPoint.x).getTime(), dataPoint.y]);

  prepareCategorySeriesData = (codesByNotation, dataPoints: ISeriesPoint[]) =>
    dataPoints.filter(dataPoint => !codesByNotation[dataPoint.x].parentId).map(dataPoint => ({
      name: translateEntityField(codesByNotation[dataPoint.x].name),
      y: dataPoint.y
    }));

  render() {
    const { dataset, seriesOptions, seriesList, xAxisCodes, loadingSeries } = this.props;
    const { dimensions, colorScheme } = dataset;

    const xAxisDimension = _.find(dimensions, { id: seriesOptions.xAxis }) as IDimension;

    const chartSeries = loadingSeries
      ? [{ data: [] }]
      : seriesList.map(series => ({
          id: series.id,
          color: series.color,
          data:
            xAxisDimension.type === 'time'
              ? this.prepareTimeSeriesData(series.data)
              : this.prepareCategorySeriesData(xAxisCodes.codesByNotation, series.data)
        }));

    const measure = seriesOptions.measure ? _.find(dataset.measures, { id: seriesOptions.measure }) : dataset.measures[0];

    const options = {
      chart: {
        type: xAxisDimension.type === 'time' ? 'spline' : 'column',
        height: '640px',
        styledMode: true,
        className: dataset.colorScheme
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
      }
    };

    return (
      <div>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
    );
  }
}

export default ChartVis;
