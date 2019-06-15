import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { Row, Col, Alert } from 'reactstrap';
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
    return loadingDataset ? <p>Loading...</p> : <p>Loaded</p>;
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
