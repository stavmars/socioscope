import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label, ListGroup, ListGroupItem } from 'reactstrap';
import { AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
// tslint:disable-next-line:no-unused-variable
import { Translate, translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getUsers } from 'app/modules/administration/user-management/user-management.reducer';
import { getEntity, updateEntity, reset, removeDimension, removeMeasure, createEntity } from './data-set.reducer';
import { getEntities as getAllDimensions } from 'app/entities/dimension/dimension.reducer';
// tslint:disable-next-line:no-unused-variable
import { convertDateTimeFromServer } from 'app/shared/util/date-utils';
import update from 'immutability-helper';
import { getEntities as getAllMeasures } from 'app/entities/measure/measure.reducer';

export interface IDataSetDimensionsProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export interface IDataSetDimensionsState {
  isNew: boolean;
}

export class DataSetDimensions extends React.Component<IDataSetDimensionsProps, IDataSetDimensionsState> {
  constructor(props) {
    super(props);
    this.state = {
      isNew: !this.props.match.params || !this.props.match.params.id
    };
  }

  componentDidMount() {
    if (this.state.isNew) {
      this.props.reset();
    } else {
      this.props.getEntity(this.props.match.params.id);
    }

    this.props.getAllDimensions();
  }
}

const mapStateToProps = (storeState: IRootState) => ({
  dataSetEntity: storeState.dataSet.entity,
  dimensions: storeState.dimension.entities,
  loading: storeState.dataSet.loading,
  updating: storeState.dataSet.updating,
  updateSuccess: storeState.dataSet.updateSuccess
});

const mapDispatchToProps = {
  getEntity,
  getAllDimensions,
  removeDimension,
  updateEntity,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DataSetDimensions);
