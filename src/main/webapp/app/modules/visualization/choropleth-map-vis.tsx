import React from 'react';
// tslint:disable-next-line
import Highmaps from 'highcharts/highmaps';
import HighchartsReact from 'highcharts-react-official';
import _ from 'lodash';
import { IDimension, IGeoMap } from 'app/shared/model/dimension.model';
import { IDataSet } from 'app/shared/model/data-set.model';
import { ISeries } from 'app/shared/model/series.model';
import { ISeriesOptions, IDimensionFilters } from 'app/shared/model/series-options.model';
import { updateVisOptions } from '../dataset-page/dataset-page-reducer';
import axios from 'axios';
import chroma from 'chroma-js';
import { accentColors } from 'app/config/constants';
import { translateEntityField } from 'app/shared/util/entity-utils';
import { Button, Header, Icon } from 'semantic-ui-react';
// tslint:disable:no-submodule-imports
import HC_exporting from 'highcharts/modules/exporting';

HC_exporting(Highmaps);

export interface IChoroplethVisProp {
  className?: string;
  dataset: IDataSet;
  series: ISeries;
  seriesOptions: ISeriesOptions;
  xAxisCodes: any;
  loadingSeries: boolean;
  showButtons: boolean;
  visType: string;
  dimensionCodes: any;

  updateVisOptions: typeof updateVisOptions;
}

export interface IChoroplethVisState {
  geoJson: any;
  geoJsonLoading: boolean;
  geoMap: IGeoMap;
  currentGeoMapKey: any;
}

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
export class ChoroplethMapVis extends React.Component<IChoroplethVisProp, IChoroplethVisState> {
  innerChart = React.createRef<HighchartsReact>();

  constructor(props) {
    super(props);
    this.state = {
      geoJson: null,
      geoJsonLoading: true,
      geoMap: null,
      currentGeoMapKey: null
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

  fetchGeoJson(geoMap: IGeoMap) {
    this.setState({ geoJsonLoading: true });
    axios.get(geoMap.url).then(response => this.setState({ geoJson: response.data, geoJsonLoading: false, geoMap }));
  }

  getGeoMap(xAxisDimension: IDimension, geoMapKey) {
    const geoMap = xAxisDimension.geoMaps[geoMapKey];
    if (!geoMap) return xAxisDimension.geoMaps[xAxisDimension.defaultGeoMapKey];
    return geoMap;
  }

  handleXAxisChange = value => {
    this.props.updateVisOptions(this.props.dataset, {
      visType: this.props.visType,
      seriesOptions: { xAxis: value, compareBy: null }
    });
  };

  componentDidMount() {
    const { seriesOptions, dataset } = this.props;
    const xAxisDimension = _.find(dataset.dimensions, { id: seriesOptions.xAxis }) as IDimension;
    const geoMapKey = seriesOptions.dimensionFilters[xAxisDimension.geoMapDependency];
    const geoMap = this.getGeoMap(xAxisDimension, geoMapKey);
    this.setState({ currentGeoMapKey: geoMapKey });
    this.fetchGeoJson(geoMap);
  }

  componentDidUpdate(prevProps: IChoroplethVisProp, prevState: IChoroplethVisState) {
    const { seriesOptions, dataset } = this.props;
    const xAxisDimension = _.find(dataset.dimensions, { id: seriesOptions.xAxis }) as IDimension;
    const geoMapKey = seriesOptions.dimensionFilters[xAxisDimension.geoMapDependency];
    if (this.state.currentGeoMapKey !== geoMapKey) {
      const geoMap = this.getGeoMap(xAxisDimension, geoMapKey);
      this.setState({ currentGeoMapKey: geoMapKey });
      this.fetchGeoJson(geoMap);
    } else if (seriesOptions.xAxis !== prevProps.seriesOptions.xAxis) {
      const geoMap = this.getGeoMap(xAxisDimension, geoMapKey);
      this.fetchGeoJson(geoMap);
    }
  }

  findMapColor(dimensionFilters, dimensionCodes, dimensions) {
    const filteredDimensionCodes = {};
    let color = null;

    const colorDimension = dimensions.find(dim => dim.colorDimension);

    if (!colorDimension) return color;

    for (const [key, value] of Object.entries(dimensionFilters)) {
      if (value !== null && dimensionCodes[key]) {
        const filteredCode = dimensionCodes[key].codesByNotation[String(value)];
        if (filteredCode) {
          filteredDimensionCodes[key] = filteredCode;
        }
      }
    }

    for (const [key, value] of Object.entries(filteredDimensionCodes)) {
      if (key === colorDimension.id && value['color']) {
        color = value['color'];
        break;
      }
    }
    return color;
  }

  render() {
    const { dataset, seriesOptions, series, xAxisCodes, loadingSeries, showButtons, className, dimensionCodes } = this.props;
    const { dimensions, colorScheme } = dataset;
    const { geoJsonLoading, geoJson, geoMap } = this.state;
    const { codesByNotation } = xAxisCodes;
    const mapColor = this.findMapColor(seriesOptions.dimensionFilters, dimensionCodes, dimensions);

    const xAxisDimension = _.find(dimensions, { id: seriesOptions.xAxis }) as IDimension;
    const geographicDimensions = dimensions.filter(dim => dim.type === 'geographic-area');
    const geoMapKey = seriesOptions.dimensionFilters[xAxisDimension.geoMapDependency];

    if (geoJsonLoading || loadingSeries) {
      return <div />;
    }

    // tslint:disable:jsx-no-lambda

    const xAxisButtons = (
      <Button.Group className="map-xAxis-button-group" basic>
        {geographicDimensions.map(dim => {
          if (dim.geoMaps[geoMapKey]) {
            return (
              <Button key={dim.id} active={dim.geoMaps[geoMapKey] === geoMap} onClick={() => this.handleXAxisChange(dim.id)}>
                {translateEntityField(dim.geoMaps[geoMapKey].name)}
              </Button>
            );
          } else {
            return (
              <Button key={dim.id} active={dim.geoMaps[dim.defaultGeoMapKey] === geoMap} onClick={() => this.handleXAxisChange(dim.id)}>
                {translateEntityField(dim.geoMaps[dim.defaultGeoMapKey].name)}
              </Button>
            );
          }
        })}
      </Button.Group>
    );

    if (series.data.length === 0) {
      return (
        <div className={className}>
          {showButtons ? xAxisButtons : null}
          <Header as="h2" icon textAlign="center" style={{ marginTop: '165px', fontFamily: 'ProximaNovaBold' }}>
            <Icon name="database" />
            No data found
            <Header.Subheader>Please choose a different input</Header.Subheader>
          </Header>
        </div>
      );
    }

    const bounds = chroma.limits(series.data.map(seriesPoint => seriesPoint.y), 'q', 6);
    const colorScale = mapColor
      ? chroma.scale(['white', mapColor]).classes(bounds)
      : chroma.scale(['#edf8b1', '#7fcdbb', '#2c7fb8']).classes(bounds);

    const dataClasses = [];
    for (let i = 0; i < bounds.length - 1; i++) {
      dataClasses.push({
        color: colorScale(bounds[i]).hex(),
        from: bounds[i],
        to: bounds[i + 1]
      });
    }
    const mapOptions = {
      chart: {
        className: 'choropleth-map',
        zoomType: 'x',
        style: { fontFamily: 'BPnoScript', fontWeight: 'bold' },
        resetZoomButton: {
          position: {
            align: 'right',
            verticalAlign: 'top',
            x: -15,
            y: 40
          }
        }
      },
      title: {
        text: ''
      },
      credits: {
        enabled: false
      },
      mapNavigation: {
        enabled: true,
        buttonOptions: {
          verticalAlign: 'top'
        }
      },
      legend: {
        align: 'left',
        verticalAlign: 'bottom',
        floating: true,
        layout: 'vertical',
        valueDecimals: 0
      },
      tooltip: {
        // tslint:disable-next-line
        formatter: function() {
          return translateEntityField(codesByNotation[this.point.key].name) + ': ' + this.point.value;
        }
      },
      xAxis: {
        minRange: 0.1
      },
      yAxis: {
        minRange: 0.1
      },
      colorAxis: {
        dataClasses
      },
      series: [
        {
          type: 'map',
          mapData: geoJson,
          joinBy: ['id', 'key'],
          keys: ['id'],
          data: series.data.map(seriesPoint => ({ key: seriesPoint.x, value: seriesPoint.y }))
        }
      ],
      exporting: {
        buttons: false,
        url: 'https://socioscope.gr/hc-export',
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
        {showButtons ? xAxisButtons : null}
        <HighchartsReact
          containerProps={{ className }}
          highcharts={Highmaps}
          constructorType="mapChart"
          options={mapOptions as any}
          ref={this.innerChart}
        />
      </div>
    );
  }
}

export default ChoroplethMapVis;
