import React from 'react';
import { NavLink, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { getDataset, getSeries } from 'app/modules/dataset-page/dataset-page-reducer';

import Highcharts from 'highcharts';
import { Chart, ColumnSeries, HighchartsChart, Legend, Subtitle, Title, withHighcharts, XAxis, YAxis } from 'react-jsx-highcharts';

import { IRootState } from 'app/shared/reducers';
import { hideHeader, showHeader } from 'app/shared/reducers/header';
import { Grid } from 'semantic-ui-react';
import { translateEntityField } from 'app/shared/util/entity-utils';
import './dataset-page.scss';

export interface IDatasetPageProp extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export class DatasetPage extends React.Component<IDatasetPageProp> {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.showHeader();
    this.props.getDataset(this.props.match.params.id);
    const seriesOptions = {
      xAxis: 'elections',
      measure: 'votes_perc',
      dimensionValues: [
        {
          id: 'constituency',
          value: '2'
        },
        {
          id: 'party',
          value: 'abstained'
        }
      ]
    };
    this.props.getSeries(this.props.match.params.id, seriesOptions);
  }

  render() {
    const { dataset, loadingDataset, dimensionCodes, series, fetchedCodeLists } = this.props;
    const categories = ['Jan 15', 'Sep 96', 'Apr 00', 'Mar 04', 'Sep 07', 'Oct 09', 'May 12', 'Jun 12'];

    return (
      <div className="dataset-page-tab-menu" style={{ backgroundImage: `url(/content/images/Assets/${dataset.id}.jpg` }}>
        <Grid textAlign="center" style={{ margin: 0, padding: 0 }}>
          <Grid.Row style={{ margin: 0, padding: 0 }}>
            <Grid.Column>
              <div className="dataset-page-title">
                <h1>{translateEntityField(dataset.name)}</h1>
              </div>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns={3} style={{ margin: 0, padding: 0 }}>
            <Grid.Column className="dataset-page-tab-menu-item" as={NavLink} exact to={`/dataset/${dataset.id}`}>
              <div>Highlights</div>
            </Grid.Column>
            <Grid.Column className="dataset-page-tab-menu-item" as={NavLink} to={`/dataset/${dataset.id}/data`}>
              <div>Δεδομένα</div>
            </Grid.Column>
            <Grid.Column className="dataset-page-tab-menu-item" as={NavLink} exact to={`/dataset/${dataset.id}/about`}>
              <div>Ταυτότητα Έρευνας</div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
      /*      {/!*<div>
              <HighchartsChart>
                <Chart/>

                <Title>{dataset.name.el}</Title>

                <Subtitle>Πηγή: ΕΚΚΕ</Subtitle>

                <XAxis type="category">
                  <XAxis.Title>Αποχή</XAxis.Title>
                </XAxis>
                <YAxis>
                  <YAxis.Title>Ποσοστό</YAxis.Title>
                  {series && dimensionCodes['elections']
                    ? series[0].data.map((d, i) => <ColumnSeries data={[{ name: dimensionCodes['elections'][i].name.el, y: d.y }]}/>)
                    : null}
                </YAxis>
              </HighchartsChart>
            </div>*!/}*/
    );
  }
}

const mapStateToProps = (storeState: IRootState) => ({
  dataset: storeState.datasetPage.dataset,
  dimensionCodes: storeState.datasetPage.dimensionCodes,
  series: storeState.datasetPage.series,
  loadingDataset: storeState.datasetPage.loadingDataset,
  fetchedCodeLists: storeState.datasetPage.fetchedCodeLists
});

const mapDispatchToProps = {
  getDataset,
  getSeries,
  showHeader,
  hideHeader
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withHighcharts(DatasetPage, Highcharts));
