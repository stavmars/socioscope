import React from 'react';
// tslint:disable-next-line
import Highmaps from 'highcharts/highmaps';
import HighchartsReact from 'highcharts-react-official';
import _ from 'lodash';
import { IDimension, IGeoMap } from 'app/shared/model/dimension.model';
import { IDataSet } from 'app/shared/model/data-set.model';
import { ISeries } from 'app/shared/model/series.model';
import { ISeriesOptions } from 'app/shared/model/series-options.model';
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

  updateVisOptions: typeof updateVisOptions;
}

export interface IChoroplethVisState {
  geoJson: any;
  geoJsonLoading: boolean;
  geoMap: IGeoMap;
  currentGeoMapKey: any;
}

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
    this.innerChart.current.chart.exportChart({ type }, {});
  }

  fetchGeoJson(geoMap: IGeoMap) {
    this.setState({ geoJsonLoading: true });
    axios.get(geoMap.url).then(response => this.setState({ geoJson: response.data, geoJsonLoading: false, geoMap }));
  }

  getGeoMaps(xAxisDimension: IDimension, geoMapKey) {
    let geoMaps = xAxisDimension.geoMaps[geoMapKey];
    if (!geoMaps) geoMaps = xAxisDimension.geoMaps[xAxisDimension.defaultGeoMapKey];
    return geoMaps;
  }

  handleXAxisChange = value => {
    this.props.updateVisOptions(this.props.dataset, {
      visType: this.props.visType,
      seriesOptions: { xAxis: value, compareBy: null }
    });
  };

  handleGeographicAreaChange = (value, geoMap: IGeoMap) => {
    this.setState({ geoMap });
    this.handleXAxisChange(value);
  };

  componentDidMount() {
    const { seriesOptions, dataset } = this.props;
    const xAxisDimension = _.find(dataset.dimensions, { id: seriesOptions.xAxis }) as IDimension;
    const geoMapKey = seriesOptions.dimensionFilters[xAxisDimension.geoMapDependency];
    const geoMaps = this.getGeoMaps(xAxisDimension, geoMapKey);
    this.setState({ currentGeoMapKey: geoMapKey });
    this.fetchGeoJson(geoMaps);
  }

  componentDidUpdate(prevProps: IChoroplethVisProp, prevState: IChoroplethVisState) {
    const { seriesOptions, dataset } = this.props;
    const xAxisDimension = _.find(dataset.dimensions, { id: seriesOptions.xAxis }) as IDimension;
    const geoMapKey = seriesOptions.dimensionFilters[xAxisDimension.geoMapDependency];
    if (this.state.currentGeoMapKey !== geoMapKey) {
      const geoMaps = this.getGeoMaps(xAxisDimension, geoMapKey);
      this.setState({ currentGeoMapKey: geoMapKey });
      this.fetchGeoJson(geoMaps);
    } else if (this.state.geoMap !== prevState.geoMap) this.fetchGeoJson(this.state.geoMap);
  }

  render() {
    const { dataset, seriesOptions, series, xAxisCodes, loadingSeries, showButtons, className } = this.props;
    const { dimensions, colorScheme } = dataset;
    const { geoJsonLoading, geoJson, geoMap } = this.state;
    const { codesByNotation } = xAxisCodes;

    const xAxisDimension = _.find(dimensions, { id: seriesOptions.xAxis }) as IDimension;
    const geographicDimensions = dimensions.filter(dim => dim.type === 'geographic-area');
    const geoMapKey = seriesOptions.dimensionFilters[xAxisDimension.geoMapDependency];

    if (geoJsonLoading || loadingSeries) {
      return <div />;
    }

    // tslint:disable:jsx-no-lambda

    const levelButtons = (
      <Button.Group className="map-level-button-group" basic>
        {geographicDimensions.map(dim => {
          if (dim.geoMaps[geoMapKey]) {
            return (
              <Button
                key={dim.id}
                active={dim.geoMaps[geoMapKey] === this.state.geoMap}
                onClick={() => this.handleGeographicAreaChange(dim.id, dim.geoMaps[geoMapKey])}
              >
                {translateEntityField(dim.name)}
              </Button>
            );
          } else {
            return (
              <Button
                key={dim.id}
                active={dim.geoMaps[dim.defaultGeoMapKey] === this.state.geoMap}
                onClick={() => this.handleGeographicAreaChange(dim.id, dim.geoMaps[dim.defaultGeoMapKey])}
              >
                {translateEntityField(dim.name)}
              </Button>
            );
          }
        })}
      </Button.Group>
    );

    const levelSeriesPoints = series.data.filter(seriesPoint => codesByNotation[seriesPoint.x].level === geoMap.level);

    if (levelSeriesPoints.length === 0) {
      return (
        <div className={className}>
          <Header as="h2" icon textAlign="center" style={{ marginTop: '165px', fontFamily: 'ProximaNovaBold' }}>
            <Icon name="database" />
            No data found
            <Header.Subheader>Please choose a different input</Header.Subheader>
          </Header>
        </div>
      );
    }

    const bounds = chroma.limits(levelSeriesPoints.map(seriesPoint => seriesPoint.y), 'q', 6);
    const colorScale = chroma.scale(['white', accentColors[colorScheme]]).classes(bounds);

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
          data: levelSeriesPoints.map(seriesPoint => ({ key: seriesPoint.x, value: seriesPoint.y }))
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
        {showButtons ? levelButtons : null}
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
