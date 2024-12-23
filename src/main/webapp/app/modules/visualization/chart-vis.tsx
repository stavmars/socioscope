import React from 'react';
import './chart-vis.scss';
import { translateEntityField } from 'app/shared/util/entity-utils';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import uuid from 'uuid';
import chroma from 'chroma-js';
import _, { filter } from 'lodash';
import { IDimension } from 'app/shared/model/dimension.model';
import { ISeriesPoint } from 'app/shared/model/series-point.model';
import { IDataSet } from 'app/shared/model/data-set.model';
import { ISeries } from 'app/shared/model/series.model';
import { IDimensionFilters, ISeriesOptions } from 'app/shared/model/series-options.model';
import { accentColors, chartColors } from 'app/config/constants';
// tslint:disable:no-submodule-imports
import HC_exporting from 'highcharts/modules/exporting';
import moment from 'moment';
import { translate } from 'react-jhipster';
import Slider from 'rc-slider';

HC_exporting(Highcharts);

export interface IChartVisProp {
  className?: string;
  dataset: IDataSet;
  seriesList: ISeries[];
  seriesOptions: ISeriesOptions;
  dimensionCodes: any;
  loadingSeries: boolean;
  showLegend: boolean;
  showLabels: boolean;
  chartType: string;
  currentLocale: string;
  secondarySeriesList: ISeries[];
}

export interface IChartVisState {
  sliderValue: number;
  filteredChartSeries: any;
}

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

const prepareCategorySeriesData = (codesByNotation, seriesPoints: ISeriesPoint[], order: string) => {
  const chartPoints = seriesPoints.map(seriesPoint => {
    const code = codesByNotation[seriesPoint.x];
    return {
      name: translateEntityField(code.shortName) || translateEntityField(code.name),
      codeOrder: code.order,
      y: seriesPoint.y,
      codesByNotation
    };
  });
  switch (order) {
    case 'value_desc':
      return _.orderBy(chartPoints, ['y', 'codeOrder', 'name'], ['desc', 'asc', 'asc']);
    case 'value_asc':
      return _.sortBy(chartPoints, 'y', 'codeOrder', 'name');
    case 'composite':
      return chartPoints;
    default:
      return _.sortBy(chartPoints, 'codeOrder', 'name');
  }
};

const parseDimensionFilters = (dimensions: IDimension[], dimensionFilters: IDimensionFilters, dimensionCodes: any) => {
  let result = '';
  for (const dimensionFilter in dimensionFilters) {
    if (dimensionFilters.hasOwnProperty(dimensionFilter)) {
      const dimension = _.keyBy(dimensions, 'id')[dimensionFilter];
      result +=
        translateEntityField(dimension.name) +
        ': ' +
        (dimensionFilters[dimensionFilter] !== null
          ? translateEntityField(dimensionCodes[dimension.id].codesByNotation[dimensionFilters[dimensionFilter]].name)
          : '') +
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

export class ChartVis extends React.Component<IChartVisProp, IChartVisState> {
  innerChart = React.createRef<HighchartsReact>();

  constructor(props) {
    super(props);
    this.state = {
      sliderValue: 0,
      filteredChartSeries: null
    };
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
          useHTML: false,
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
    return (
      this.props.seriesList !== nextProps.seriesList ||
      this.props.currentLocale !== nextProps.currentLocale ||
      nextState.filteredChartSeries !== this.state.filteredChartSeries
    );
  }

  componentDidUpdate(prevProps: IChartVisProp, prevState: IChartVisState) {
    const { seriesList, currentLocale } = this.props;
    if (seriesList !== prevProps.seriesList || currentLocale !== prevProps.currentLocale) {
      this.setState({
        sliderValue: 0,
        filteredChartSeries: null
      });
    }
  }

  handleSliderChange = (chartSeries, secondaryChartSeries, codesByNotation, measure, thresholdMin, value) => {
    let filteredChartSeries;
    const accumulatorCode = codesByNotation[measure.thresholdAccumulator];

    if (value === thresholdMin) {
      this.setState({ sliderValue: value, filteredChartSeries: null });
      return;
    }

    if (secondaryChartSeries && secondaryChartSeries.length > 0) {
      filteredChartSeries = chartSeries.map(series => {
        if (chartSeries.length === 1) {
          return {
            ...series,
            data: series.data.filter(
              point => secondaryChartSeries[0].data.find(secondaryPoint => secondaryPoint.name === point.name).y >= value
            )
          };
        } else {
          return {
            ...series,
            data: series.data.filter(
              point =>
                secondaryChartSeries
                  .find(secondarySeries => secondarySeries.id === series.id)
                  .data.find(secondaryPoint => secondaryPoint.name === point.name).y >= value
            )
          };
        }
      });
    } else {
      filteredChartSeries = chartSeries.map(series => ({
        ...series,
        data: series.data.filter(point => point.y >= value)
      }));
    }
    filteredChartSeries = accumulatorCode
      ? this.getSeriesWithSumBelowThreshold(filteredChartSeries, chartSeries, secondaryChartSeries, accumulatorCode, codesByNotation, value)
      : filteredChartSeries;
    this.setState({ sliderValue: value, filteredChartSeries });
  };

  getSeriesWithSumBelowThreshold = (
    filteredChartSeries,
    chartSeries,
    secondaryChartSeries,
    accumulatorCode,
    codesByNotation,
    sliderValue
  ) => {
    chartSeries.forEach(series => {
      let sumBelowThreshold;

      if (secondaryChartSeries && secondaryChartSeries.length > 0) {
        sumBelowThreshold =
          chartSeries.length === 1
            ? series.data.reduce(
                (acc, point) =>
                  secondaryChartSeries[0].data.find(secondaryPoint => secondaryPoint.name === point.name).y < sliderValue
                    ? acc + point.y
                    : acc,
                0
              )
            : series.data.reduce(
                (acc, point) =>
                  secondaryChartSeries
                    .find(secondarySeries => secondarySeries.id === series.id)
                    .data.find(secondaryPoint => secondaryPoint.name === point.name).y < sliderValue
                    ? acc + point.y
                    : acc,
                0
              );
      } else {
        sumBelowThreshold = series.data.reduce((acc, point) => (point.y < sliderValue ? acc + point.y : acc), 0);
      }

      if (series.id) {
        const accumulatorIndex = filteredChartSeries
          .find(filteredSeries => filteredSeries.id === series.id)
          .data.findIndex(point => point.name === translateEntityField(accumulatorCode.name));
        if (accumulatorIndex !== -1) {
          sumBelowThreshold =
            filteredChartSeries.find(filteredSeries => filteredSeries.id === series.id).data[accumulatorIndex].y + sumBelowThreshold;
          filteredChartSeries.find(filteredSeries => filteredSeries.id === series.id).data.splice(accumulatorIndex, 1);
        }
        if (sumBelowThreshold > 0) {
          const accumulatorPoint = { x: accumulatorCode.notation, y: sumBelowThreshold };
          filteredChartSeries
            .find(filteredSeries => filteredSeries.id === series.id)
            .data.push(prepareCategorySeriesData(codesByNotation, [accumulatorPoint], null)[0]);
        }
      } else if (!chartSeries[0].isShowAll) {
        const accumulatorIndex = filteredChartSeries[0].data.findIndex(point => point.name === translateEntityField(accumulatorCode.name));
        if (accumulatorIndex !== -1) {
          sumBelowThreshold = filteredChartSeries[0].data[accumulatorIndex].y + sumBelowThreshold;
          filteredChartSeries[0].data.splice(accumulatorIndex, 1);
        }
        if (sumBelowThreshold > 0) {
          const accumulatorPoint = { x: accumulatorCode.notation, y: sumBelowThreshold };
          filteredChartSeries[0].data.push(prepareCategorySeriesData(codesByNotation, [accumulatorPoint], null)[0]);
        }
      }
    });
    return filteredChartSeries;
  };

  getSliderString = (value, sliderMeasure) => (sliderMeasure.type === 'percentage' ? `${value}%` : value);

  getSliderProps = (secondarySeriesList, dataset, measure) => {
    const dependencyMeasure =
      secondarySeriesList.length > 0 ? dataset.measures.find(depMeasure => depMeasure.id === measure.thresholdDependency) : null;
    const sliderMeasure = dependencyMeasure ? dependencyMeasure : measure;
    const thresholdMin = sliderMeasure.thresholdMin;
    const thresholdMax = sliderMeasure.thresholdMax;
    const thresholdStep = sliderMeasure.thresholdStep;
    return { sliderMeasure, thresholdMin, thresholdMax, thresholdStep };
  };

  getSliderMarks = (min, max, step, measure) => {
    const marks: { [key: number]: any } = {};
    for (let i = min; i <= max; i += step) {
      marks[i] = (
        <span style={{ fontFamily: 'Proxima Nova Semibold', fontSize: window.innerWidth > 768 ? '14px' : '9px' }}>
          {i}
          {measure.type === 'percentage' && '%'}
        </span>
      );
    }
    return marks;
  };

  prepareTimeChartSeries = (seriesList, compareBy, dimensionCodes, colorScheme) =>
    _(seriesList)
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

  prepareCategoryChartSeries = (seriesList, compareBy, dimensionCodes, codesByNotation, xAxisDimension, colorScheme) =>
    _(seriesList)
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
            series.data,
            xAxisDimension.type === 'composite' ? 'composite' : seriesList.length === 1 ? xAxisDimension.order : null
          )
        };
      })
      .sortBy('order', 'name')
      .value();

  render() {
    const {
      dataset,
      seriesOptions,
      seriesList,
      dimensionCodes,
      loadingSeries,
      showLabels,
      showLegend,
      chartType,
      className,
      secondarySeriesList
    } = this.props;
    const { dimensions, colorScheme } = dataset;
    const { sliderValue, filteredChartSeries } = this.state;
    const { compareBy } = seriesOptions;
    const xAxisDimension = _.find(dimensions, { id: seriesOptions.xAxis }) as IDimension;
    const compareByDimension = compareBy && (_.find(dimensions, { id: seriesOptions.compareBy }) as IDimension);
    let chartSeries = [{ data: [] }] as any;
    let secondaryChartSeries = [] as any;
    let codesByNotation;

    if (!loadingSeries && seriesList && seriesList.length > 0) {
      if (xAxisDimension.type === 'time') {
        chartSeries = this.prepareTimeChartSeries(seriesList, compareBy, dimensionCodes, colorScheme);
      } else {
        codesByNotation =
          xAxisDimension.type === 'composite'
            ? xAxisDimension.composedOf.reduce((acc, dimId) => {
                const dim = _.find(dimensions, { id: dimId });
                acc[dimId] = dim;
                return acc;
              }, {})
            : dimensionCodes[seriesOptions.xAxis].codesByNotation;

        chartSeries = this.prepareCategoryChartSeries(seriesList, compareBy, dimensionCodes, codesByNotation, xAxisDimension, colorScheme);
        secondaryChartSeries = this.prepareCategoryChartSeries(
          secondarySeriesList,
          compareBy,
          dimensionCodes,
          codesByNotation,
          xAxisDimension,
          colorScheme
        );

        if (xAxisDimension.type === 'composite') {
          const colorCount = _.filter(chartSeries, series => series.code && !series.code.color).length;
          const colors = chroma.scale(['#ffffe0', accentColors[colorScheme]]).colors(colorCount);
          chartSeries = chartSeries.map(series => {
            const color = (series.code && series.code.color) || colors.shift();
            return { ...series, color };
          });
        }
      }
    }

    if (chartSeries.length > 1) {
      chartSeries.unshift({
        name: translate('socioscopeApp.dataSet.visualization.legend.showAll'),
        isShowAll: true,
        data: [],
        color: 'black'
      });
    }

    const measure = seriesOptions.measure ? _.find(dataset.measures, { id: seriesOptions.measure }) : dataset.measures[0];
    const xAxisName = translateEntityField(xAxisDimension.name);
    const dataSetName = translateEntityField(dataset.name);
    const xAxisDesc = translateEntityField(xAxisDimension.description);
    const xAxisText =
      !xAxisDesc || xAxisName === xAxisDesc
        ? xAxisName
        : `<div style="text-align: center;font-weight: bold">${xAxisName}</div><div class="x-axis-subtitle">${xAxisDesc}</div>`;
    const { sliderMeasure, thresholdMin, thresholdMax, thresholdStep } = this.getSliderProps(secondarySeriesList, dataset, measure);

    const sliderButton =
      xAxisDimension.allowThreshold && measure.allowThreshold ? (
        <div style={{ width: '20%', marginRight: '20px', marginBottom: '50px', marginLeft: 'auto' }}>
          <span style={{ fontFamily: 'Proxima Nova Semibold', fontSize: window.innerWidth > 768 ? '14px' : '9px' }}>
            {`${translate('socioscopeApp.dataSet.visualization.configure.thresholdTitle')}:`}
          </span>
          <Slider
            min={thresholdMin}
            max={thresholdMax}
            value={sliderValue}
            step={thresholdStep}
            marks={this.getSliderMarks(thresholdMin, thresholdMax, thresholdStep, sliderMeasure)}
            onChange={this.handleSliderChange.bind(this, chartSeries, secondaryChartSeries, codesByNotation, measure, thresholdMin)}
            railStyle={{ backgroundColor: accentColors[dataset.colorScheme] }}
            handleStyle={{ borderColor: accentColors[dataset.colorScheme] }}
            className={dataset.colorScheme}
            included={false}
          />
        </div>
      ) : null;

    const options = {
      chart: {
        type: xAxisDimension.type === 'time' ? 'spline' : chartType === null ? 'column' : chartType,
        // height: window.innerWidth > 768 ? '50%' : null,
        zoomType: 'x',
        className: `chart ${colorScheme}`,
        style: { fontFamily: 'BPnoScript', fontWeight: 'bold' },
        events: {
          load() {
            if (this.options.chart.forExport && chartSeries.length > 1) {
              this.series[0].remove();
            }
          }
        }
      },
      title: {
        useHTML: true,
        text: chartType === 'bar' ? xAxisText : undefined
      },
      xAxis: {
        type: xAxisDimension.type === 'time' ? 'datetime' : 'category',
        title:
          chartType === 'bar'
            ? undefined
            : {
                useHTML: true,
                text: xAxisText,
                style: { fontSize: window.innerWidth > 768 ? '20px' : '10px' }
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
          style: { fontFamily: 'Proxima Nova Semibold', fontSize: window.innerWidth > 768 ? '14px' : '10px' }
        },
        max: measure.type === 'percentage' && this.props.seriesList.length > 1 ? 100 : null,
        reversedStacks: false
      },
      plotOptions: {
        series: {
          maxPointWidth: 80,
          stacking:
            (xAxisDimension.type === 'composite' && !xAxisDimension.disableStacking) ||
            (compareBy && xAxisDimension.type !== 'time' && !compareByDimension.disableStacking)
              ? 'normal'
              : undefined,
          dataLabels: {
            enabled: showLabels,
            format:
              measure.type === 'percentage' ? (measure.decimalPlaces != null ? `{y:.${measure.decimalPlaces}f}%` : '{y:.1f}%') : '{y}',
            style: {
              fontSize: '14px'
            }
          },
          events: {
            legendItemClick() {
              if (this.options.isShowAll) {
                if (this.visible) {
                  this.chart.series.forEach(series => {
                    series.hide();
                  });
                } else {
                  this.chart.series.forEach(series => {
                    series.show();
                  });
                }
              } else {
                if (this.visible) {
                  this.hide();
                } else {
                  this.show();
                }
              }
              const allVisible = this.chart.series.slice(1).every(series => series.visible);
              if (allVisible) {
                this.chart.series[0].show();
              } else {
                this.chart.series[0].hide();
              }
              return false;
            }
          }
        }
      },
      series: filteredChartSeries ? filteredChartSeries : chartSeries,
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
          const icon = this.visible
            ? `<i class="check circle icon" style="color: ${this.color};"></i>`
            : `<i class="circle outline icon"></i>`;
          if (this.userOptions.isShowAll) {
            return `${icon}<span style="font-style: italic">${this.name}</span>`;
          }
          return icon + this.name;
        },
        itemStyle: {
          fontSize: window.innerWidth > 768 ? '14px' : '10px'
        }
      },
      exporting: {
        buttons: false,
        url: 'https://socioscope.gr/hc-export',
        allowHTML: true,
        chartOptions: {
          credits: {
            enabled: true,
            text: 'socioscope.gr',
            style: { color: '#1e1e1e', fontSize: '18px' }
          },
          chart: { height: '100%' }
        }
      }
    };

    return (
      <div>
        {sliderButton}
        <HighchartsReact
          containerProps={{ className }}
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
