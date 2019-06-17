import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { Col, Container, Jumbotron, Row } from 'reactstrap';
import { getDataset, getSeries } from 'app/modules/dataset-page/dataset-page-reducer';

import { IRootState } from 'app/shared/reducers';

export interface IDatasetPageProp extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export class DatasetPage extends React.Component<IDatasetPageProp> {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.getDataset(this.props.match.params.id);
  }

  render() {
    const { dataset, loadingDataset } = this.props;

    return (
      <div>
        <Jumbotron fluid>
          <Container fluid>
            <h1 className="display-3">{dataset.name.el}</h1>
            <p className="lead">This is a modified jumbotron that occupies the entire horizontal space of its parent.</p>
          </Container>
        </Jumbotron>
      </div>
    );
  }
}

const mapStateToProps = (storeState: IRootState) => ({
  dataset: storeState.datasetPage.dataset,
  loadingDataset: storeState.datasetPage.loadingDataset
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
)(DatasetPage);
