import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
// tslint:disable-next-line:no-unused-variable
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { IUser } from 'app/shared/model/user.model';
import { getUsers } from 'app/modules/administration/user-management/user-management.reducer';
import { IDataSet } from 'app/shared/model/data-set.model';
import { getEntities as getDataSets } from 'app/entities/data-set/data-set.reducer';
import { getEntity, updateEntity, createEntity, reset } from './dimension.reducer';
import { IDimension } from 'app/shared/model/dimension.model';
// tslint:disable-next-line:no-unused-variable
import { convertDateTimeFromServer } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IDimensionUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export interface IDimensionUpdateState {
  isNew: boolean;
  creatorId: string;
  datasetId: string;
}

export class DimensionUpdate extends React.Component<IDimensionUpdateProps, IDimensionUpdateState> {
  constructor(props) {
    super(props);
    this.state = {
      creatorId: '0',
      datasetId: '0',
      isNew: !this.props.match.params || !this.props.match.params.id
    };
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.updateSuccess !== this.props.updateSuccess && nextProps.updateSuccess) {
      this.handleClose();
    }
  }

  componentDidMount() {
    if (this.state.isNew) {
      this.props.reset();
    } else {
      this.props.getEntity(this.props.match.params.id);
    }

    this.props.getUsers();
    this.props.getDataSets();
  }

  saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const { dimensionEntity } = this.props;
      const entity = {
        ...dimensionEntity,
        ...values
      };

      if (this.state.isNew) {
        this.props.createEntity(entity);
      } else {
        this.props.updateEntity(entity);
      }
    }
  };

  handleClose = () => {
    this.props.history.push('/entity/dimension');
  };

  render() {
    const { dimensionEntity, users, dataSets, loading, updating } = this.props;
    const { isNew } = this.state;

    return (
      <div>
        <Row className="justify-content-center">
          <Col md="8">
            <h2 id="socioscopeApp.dimension.home.createOrEditLabel">
              <Translate contentKey="socioscopeApp.dimension.home.createOrEditLabel">Create or edit a Dimension</Translate>
            </h2>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md="8">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <AvForm model={isNew ? {} : dimensionEntity} onSubmit={this.saveEntity}>
                {!isNew ? (
                  <AvGroup>
                    <Label for="id">
                      <Translate contentKey="global.field.id">ID</Translate>
                    </Label>
                    <AvInput id="dimension-id" type="text" className="form-control" name="id" required readOnly />
                  </AvGroup>
                ) : null}
                <AvGroup>
                  <Label id="nameLabel" for="name">
                    <Translate contentKey="socioscopeApp.dimension.name">Name</Translate>
                  </Label>
                  <AvField
                    id="dimension-name"
                    type="text"
                    name="name"
                    validate={{
                      required: { value: true, errorMessage: translate('entity.validation.required') },
                      minLength: { value: 3, errorMessage: translate('entity.validation.minlength', { min: 3 }) }
                    }}
                  />
                </AvGroup>
                <AvGroup>
                  <Label id="typeLabel" for="type">
                    <Translate contentKey="socioscopeApp.dimension.type">Type</Translate>
                  </Label>
                  <AvField
                    id="dimension-type"
                    type="text"
                    name="type"
                    validate={{
                      required: { value: true, errorMessage: translate('entity.validation.required') },
                      minLength: { value: 2, errorMessage: translate('entity.validation.minlength', { min: 2 }) }
                    }}
                  />
                </AvGroup>
                <AvGroup>
                  <Label for="dataset.name">
                    <Translate contentKey="socioscopeApp.dimension.dataset">Dataset</Translate>
                  </Label>
                  <AvField
                    id="dimension-dataset"
                    type="select"
                    className="form-control"
                    name="dataset.id"
                    validate={{
                      required: { value: true, errorMessage: translate('entity.validation.required') }
                    }}
                  >
                    <option value="" key="0" />
                    {dataSets
                      ? dataSets.map(otherEntity => (
                          <option value={otherEntity.id} key={otherEntity.id}>
                            {otherEntity.name}
                          </option>
                        ))
                      : null}
                  </AvField>
                </AvGroup>
                <Button tag={Link} id="cancel-save" to="/entity/dimension" replace color="info">
                  <FontAwesomeIcon icon="arrow-left" />
                  &nbsp;
                  <span className="d-none d-md-inline">
                    <Translate contentKey="entity.action.back">Back</Translate>
                  </span>
                </Button>
                &nbsp;
                <Button color="primary" id="save-entity" type="submit" disabled={updating}>
                  <FontAwesomeIcon icon="save" />
                  &nbsp;
                  <Translate contentKey="entity.action.save">Save</Translate>
                </Button>
              </AvForm>
            )}
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = (storeState: IRootState) => ({
  users: storeState.userManagement.users,
  dataSets: storeState.dataSet.entities,
  dimensionEntity: storeState.dimension.entity,
  loading: storeState.dimension.loading,
  updating: storeState.dimension.updating,
  updateSuccess: storeState.dimension.updateSuccess
});

const mapDispatchToProps = {
  getUsers,
  getDataSets,
  getEntity,
  updateEntity,
  createEntity,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DimensionUpdate);
