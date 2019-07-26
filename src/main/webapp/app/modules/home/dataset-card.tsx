import React from 'react';
import { translate } from 'react-jhipster';
import { Container, Grid, Image } from 'semantic-ui-react';
import { NavLink as Link } from 'react-router-dom';
import { IDataSet } from 'app/shared/model/data-set.model';
import { IHighlight } from 'app/shared/model/highlight.model';
import { connect } from 'react-redux';
import { loadHighlight } from 'app/modules/highlights/highlights-reducer';
import ChoroplethMapVis from 'app/modules/visualization/choropleth-map-vis';
import ChartVis from 'app/modules/visualization/chart-vis';

export interface IDatasetCardProps extends StateProps, DispatchProps {
  title: string;
  dataset: IDataSet;
  headerImg: string;
  highlight: IHighlight;
}

export class DatasetCard extends React.Component<IDatasetCardProps> {
  componentDidMount() {
    const { dataset, highlight } = this.props;
    this.props.loadHighlight(dataset, highlight);
  }

  render() {
    const { title, dataset, headerImg, highlight, highlightSeries, dimensionCodes } = this.props;
    const { colorScheme } = dataset;
    const { seriesOptions } = highlight;
    return (
      <div className={`dataset-card ${colorScheme}`}>
        <div className="dataset-card-header">
          {headerImg === '' ? null : <Image className="dataset-card-header-image" centered src={headerImg} />}
          <h3>{title}</h3>
        </div>
        <div className="dataset-card-content">
          <Grid centered doubling verticalAlign="middle" columns="2">
            <Grid.Row>
              <Grid.Column>
                <div className="highlight-vis">
                  {highlightSeries[highlight.id] &&
                    !highlightSeries[highlight.id].loading &&
                    (highlight.visType === 'map' ? (
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
                        dataset={dataset}
                        seriesList={highlightSeries[highlight.id].series}
                        seriesOptions={seriesOptions}
                        dimensionCodes={dimensionCodes}
                        loadingSeries={false}
                      />
                    ))}
                </div>
              </Grid.Column>
              <Grid.Column>
                <div className={`dataset-card-desc ${colorScheme}`}>{this.props.children}</div>
                <Container textAlign="center">
                  <Link className={`dataset-card-link ${colorScheme}`} to="/dataset/greek-election-results">
                    {translate('home.dataset.explore')}
                  </Link>
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
