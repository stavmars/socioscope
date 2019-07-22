import React from 'react';
// tslint:disable-next-line
import Highmaps from 'highcharts/highmaps';
import HighchartsReact from 'highcharts-react-official';
import _ from 'lodash';
import { IDimension, IGeoMap } from 'app/shared/model/dimension.model';
import { IDataSet } from 'app/shared/model/data-set.model';
import { ISeries } from 'app/shared/model/series.model';
import { ISeriesOptions } from 'app/shared/model/series-options.model';
import axios from 'axios';
import chroma from 'chroma-js';
import { accentColors } from 'app/config/constants';
import { translateEntityField } from 'app/shared/util/entity-utils';
import { Button, Header } from 'semantic-ui-react';

export interface IChoroplethVisProp {
  dataset: IDataSet;
  series: ISeries;
  seriesOptions: ISeriesOptions;
  xAxisCodes: any;
  loadingSeries: boolean;
}

export interface IChoroplethVisState {
  geoJson: any;
  geoJsonLoading: boolean;
  geoMap: IGeoMap;
}

export class ChoroplethMapVis extends React.Component<IChoroplethVisProp, IChoroplethVisState> {
  constructor(props) {
    super(props);
    this.state = {
      geoJson: null,
      geoJsonLoading: true,
      geoMap: null
    };
  }

  fetchGeoJson(geoMap: IGeoMap) {
    this.setState({ geoJsonLoading: true });
    axios.get(geoMap.url).then(response => this.setState({ geoJson: response.data, geoJsonLoading: false, geoMap }));
  }

  componentDidMount() {
    const { dataset, seriesOptions } = this.props;
    const xAxisDimension = _.find(dataset.dimensions, { id: seriesOptions.xAxis }) as IDimension;
    const geoMap = xAxisDimension.geoMaps[0];
    this.fetchGeoJson(geoMap);
  }

  componentDidUpdate(prevProps: IChoroplethVisProp, prevState: IChoroplethVisState) {
    if (this.state.geoMap !== prevState.geoMap) {
      this.fetchGeoJson(this.state.geoMap);
    }
  }

  render() {
    const { dataset, seriesOptions, series, xAxisCodes, loadingSeries } = this.props;
    const { dimensions, colorScheme } = dataset;
    const { geoJsonLoading, geoJson, geoMap } = this.state;
    const { codesByNotation } = xAxisCodes;

    const xAxisDimension = _.find(dimensions, { id: seriesOptions.xAxis }) as IDimension;

    if (geoJsonLoading || loadingSeries) {
      return <div />;
    }

    // tslint:disable:jsx-no-lambda

    const levelButtons =
      xAxisDimension.geoMaps.length === 0 ? (
        ''
      ) : (
        <Button.Group className="map-level-button-group" basic>
          {xAxisDimension.geoMaps.map(geo => (
            <Button key={geo.level} active={geo === this.state.geoMap} onClick={() => this.setState({ geoMap: geo })}>
              {translateEntityField(geo.name)}
            </Button>
          ))}
        </Button.Group>
      );

    const levelSeriesPoints = series.data.filter(seriesPoint => codesByNotation[seriesPoint.x].level === geoMap.level);

    if (levelSeriesPoints.length === 0) {
      return (
        <div>
          {levelButtons}
          <Header style={{ marginTop: '100px' }} textAlign="center">
            No data found
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
      ]
    };

    return (
      <div>
        {levelButtons}
        <HighchartsReact highcharts={Highmaps} constructorType="mapChart" options={mapOptions as any} />
      </div>
    );
  }
}

export default ChoroplethMapVis;
