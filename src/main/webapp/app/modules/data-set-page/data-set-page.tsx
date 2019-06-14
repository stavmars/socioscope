import './home.scss';

import React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Translate } from 'react-jhipster';
import { connect } from 'react-redux';
import { Row, Col, Alert } from 'reactstrap';
import { getEntity, getSeries } from 'app/modules/data-set-page/data-set-page-reducer';

import { IRootState } from 'app/shared/reducers';
import { getSession } from 'app/shared/reducers/authentication';

export interface IDataSetPageProp extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export class DataSetPage extends React.Component<IDataSetPageProp> {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.getSession();
    this.props.getEntity(this.props.match.params.id);
  }

  render() {
    const { dataSetPageEntity, account, isAuthenticated } = this.props;

    // Added these to avoid the error warnings from intelliJ
    return <div />;
  }
}

const mapStateToProps = (storeState: IRootState) => ({
  account: storeState.authentication.account,
  isAuthenticated: storeState.authentication.isAuthenticated,
  dataSetPageEntity: storeState.dataSetPage.entity
});

const mapDispatchToProps = {
  getSession,
  getEntity,
  getSeries
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DataSetPage);
