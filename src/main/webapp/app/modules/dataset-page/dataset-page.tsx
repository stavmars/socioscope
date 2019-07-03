import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { Col, Container, Jumbotron, Row } from 'reactstrap';
import { getDataset, getSeries } from 'app/modules/dataset-page/dataset-page-reducer';
import Highcharts from 'highcharts';
import { HighchartsChart, Chart, withHighcharts, XAxis, YAxis, Title, Subtitle, Legend, ColumnSeries } from 'react-jsx-highcharts';

import { IRootState } from 'app/shared/reducers';
import value from '*.json';
import index from 'react-redux-loading-bar';

export interface IDatasetPageProp extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export class DatasetPage extends React.Component<IDatasetPageProp> {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
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
    console.log(dimensionCodes);

    return (
      <div>
        <Jumbotron fluid>
          <Container fluid>
            <HighchartsChart>
              <Chart />

              <Title>{dataset.name.el}</Title>

              <Subtitle>Πηγή: ΕΚΚΕ</Subtitle>

              <XAxis type="category">
                <XAxis.Title>Αποχή</XAxis.Title>
              </XAxis>

              <YAxis>
                <YAxis.Title>Ποσοστό</YAxis.Title>
                {series && dimensionCodes['elections']
                  ? series[0].data.map((d, i) => <ColumnSeries data={[{ name: dimensionCodes['elections'][i].name.el, y: d.y }]} />)
                  : null}
              </YAxis>
            </HighchartsChart>
          </Container>
        </Jumbotron>
      </div>
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
  getSeries
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withHighcharts(DatasetPage, Highcharts));
