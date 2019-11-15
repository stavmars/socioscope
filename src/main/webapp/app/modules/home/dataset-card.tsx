import React from 'react';
import { translate } from 'react-jhipster';
import { Container, Grid, Image } from 'semantic-ui-react';
import { IDataSet } from 'app/shared/model/data-set.model';
import { IHighlight } from 'app/shared/model/highlight.model';
import { connect } from 'react-redux';
import { loadHighlight } from 'app/modules/highlights/highlights-reducer';
import { urlEncodeVisOptions } from 'app/modules/dataset-page/dataset-page-reducer';
import ChoroplethMapVis from 'app/modules/visualization/choropleth-map-vis';
import { translateEntityField } from 'app/shared/util/entity-utils';
import { ChartVis } from 'app/modules/visualization/chart-vis';

export interface IDatasetCardProps extends StateProps, DispatchProps {
  dataset: IDataSet;
  highlight: IHighlight;
}

export class DatasetCard extends React.Component<IDatasetCardProps> {
  componentDidMount() {
    const { dataset, highlight } = this.props;
    this.props.loadHighlight(dataset, highlight);
  }

  render() {
    const { dataset, highlight, highlightSeries, dimensionCodes, currentLocale } = this.props;
    const { colorScheme } = dataset;
    const { visType, subType, seriesOptions } = highlight;
    return (
      <div className={`dataset-card ${colorScheme}`}>
        <div className="dataset-card-content">
          <Grid centered doubling verticalAlign="middle" columns="2">
            <Grid.Row>
              <Grid.Column style={{ padding: '0 1.5%' }}>
                <div className="highlight-vis">
                  {highlightSeries[highlight.id] &&
                    !highlightSeries[highlight.id].loading &&
                    (visType === 'map' ? (
                      <ChoroplethMapVis
                        dataset={dataset}
                        series={highlightSeries[highlight.id].series[0]}
                        seriesOptions={seriesOptions}
                        xAxisCodes={dimensionCodes[seriesOptions.xAxis]}
                        loadingSeries={false}
                        showButtons={false}
                      />
                    ) : (
                      <ChartVis
                        currentLocale={currentLocale}
                        dataset={dataset}
                        seriesList={highlightSeries[highlight.id].series}
                        seriesOptions={seriesOptions}
                        dimensionCodes={dimensionCodes}
                        loadingSeries={false}
                        showLabels={false}
                        showLegend={false}
                        chartType={subType}
                      />
                    ))}
                </div>
              </Grid.Column>
              <Grid.Column style={{ padding: '0 1.5%' }}>
                <div className={`dataset-card-desc ${colorScheme}`}>{this.props.children}</div>
                <Container>
                  <br />
                  <a
                    className={`dataset-card-link ${colorScheme}`}
                    href={`/dataset/${dataset.id}/data?${urlEncodeVisOptions({ visType, subType, seriesOptions })}`}
                  >
                    {translate('home.dataset.explore')}
                  </a>
                </Container>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
      </div>
    );
  }
}

const mapStateToProps = storeState => ({
  currentLocale: storeState.locale.currentLocale,
  dimensionCodes: storeState.highlights.dimensionCodes,
  highlightSeries: storeState.highlights.highlightSeries
});

type StateProps = ReturnType<typeof mapStateToProps>;

const mapDispatchToProps = {
  loadHighlight
};

type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DatasetCard);
