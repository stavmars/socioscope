import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label, ListGroup, ListGroupItem } from 'reactstrap';
import { AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
// tslint:disable-next-line:no-unused-variable
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { IUser } from 'app/shared/model/user.model';
import { getUsers } from 'app/modules/administration/user-management/user-management.reducer';
import { getEntity, updateEntity, createEntity, reset } from './data-set.reducer';
import { IDataSet } from 'app/shared/model/data-set.model';
// tslint:disable-next-line:no-unused-variable
import { convertDateTimeFromServer } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IDataSetUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export interface IDataSetUpdateState {
  isNew: boolean;
  creatorId: string;
}

export class DataSetUpdate extends React.Component<IDataSetUpdateProps, IDataSetUpdateState> {
  constructor(props) {
    super(props);
    this.state = {
      creatorId: '0',
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
  }

  saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const { dataSetEntity } = this.props;
      const entity = {
        ...dataSetEntity,
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
    this.props.history.push('/entity/data-set');
  };

  render() {
    const { dataSetEntity, users, loading, updating } = this.props;
    const { isNew } = this.state;

    return (
      <div>
        <Row className="justify-content-center">
          <Col md="8">
            <h2 id="socioscopeApp.dataSet.home.createOrEditLabel">
              <Translate contentKey="socioscopeApp.dataSet.home.createOrEditLabel">Create or edit a DataSet</Translate>
            </h2>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md="8">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <AvForm model={isNew ? {} : dataSetEntity} onSubmit={this.saveEntity}>
                {!isNew ? (
                  <AvGroup>
                    <Label for="id">
                      <Translate contentKey="global.field.id">ID</Translate>
                    </Label>
                    <AvInput id="data-set-id" type="text" className="form-control" name="id" required readOnly />
                  </AvGroup>
                ) : null}
                <AvGroup>
                  <Label id="nameLabel" for="name">
                    <Translate contentKey="socioscopeApp.dataSet.name">Name</Translate>
                  </Label>
                  <AvField
                    id="data-set-name"
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
                    <Translate contentKey="socioscopeApp.dataSet.type">Type</Translate>
                  </Label>
                  <AvField
                    id="data-set-type"
                    type="text"
                    name="type"
                    validate={{
                      required: { value: true, errorMessage: translate('entity.validation.required') },
                      minLength: { value: 2, errorMessage: translate('entity.validation.minlength', { min: 2 }) }
                    }}
                  />
                </AvGroup>
                <AvGroup>
                  <Label id="commentLabel" for="comment">
                    <Translate contentKey="socioscopeApp.dataSet.comment">Comment</Translate>
                  </Label>
                  <AvField id="data-set-comment" type="text" name="comment" />
                </AvGroup>
                {!isNew ? (
                  <AvGroup>
                    <Label id="createdDateLabel" for="createdDate">
                      <Translate contentKey="socioscopeApp.dataSet.createdDate">Created Date</Translate>
                    </Label>
                    <AvInput
                      id="data-set-createdDate"
                      type="datetime-local"
                      className="form-control"
                      name="creatdedDate"
                      value={convertDateTimeFromServer(this.props.dataSetEntity.createdDate)}
                      readOnly
                    />
                  </AvGroup>
                ) : null}
                {!isNew ? (
                  <AvGroup>
                    <Label>
                      <Translate contentKey="socioscopeApp.dataSet.dimensions">Dimensions</Translate>
                    </Label>
                    <ListGroup>
                      {dataSetEntity.dimensions
                        ? dataSetEntity.dimensions.map(otherEntity => (
                            <ListGroupItem>
                              {otherEntity.name}
                              <Button
                                tag={Link}
                                to={`/entity/dimension/${otherEntity.id}/edit`}
                                color="primary"
                                className="float-right"
                                size="sm"
                              >
                                <FontAwesomeIcon icon="pencil-alt" />{' '}
                                <span className="d-none d-md-inline">
                                  <Translate contentKey="entity.action.edit">Edit</Translate>
                                </span>
                              </Button>
                              <Button
                                tag={Link}
                                to={`/entity/dimension/${otherEntity.id}/delete`}
                                color="danger"
                                className="float-right"
                                size="sm"
                              >
                                <FontAwesomeIcon icon="trash" />{' '}
                                <span className="d-none d-md-inline">
                                  <Translate contentKey="entity.action.delete">Delete</Translate>
                                </span>
                              </Button>
                            </ListGroupItem>
                          ))
                        : null}
                      <ListGroupItem>
                        <Button tag={Link} to="/entity/dimension/new" color="primary" className="float-center" size="sm">
                          <FontAwesomeIcon icon="plus" />
                          <Translate contentKey="socioscopeApp.dimension.home.createLabel">Create new Dimension</Translate>
                        </Button>
                      </ListGroupItem>
                    </ListGroup>
                    <Label>
                      <Translate contentKey="socioscopeApp.dataSet.measures">Measures</Translate>
                    </Label>
                    <ListGroup>
                      {dataSetEntity.measures
                        ? dataSetEntity.measures.map(otherEntity => (
                            <ListGroupItem>
                              {otherEntity.name}
                              <Button
                                tag={Link}
                                to={`/entity/measure/${otherEntity.id}/edit`}
                                color="primary"
                                className="float-right"
                                size="sm"
                              >
                                <FontAwesomeIcon icon="pencil-alt" />{' '}
                                <span className="d-none d-md-inline">
                                  <Translate contentKey="entity.action.edit">Edit</Translate>
                                </span>
                              </Button>
                              <Button
                                tag={Link}
                                to={`/entity/measure/${otherEntity.id}/delete`}
                                color="danger"
                                className="float-right"
                                size="sm"
                              >
                                <FontAwesomeIcon icon="trash" />{' '}
                                <span className="d-none d-md-inline">
                                  <Translate contentKey="entity.action.delete">Delete</Translate>
                                </span>
                              </Button>
                            </ListGroupItem>
                          ))
                        : null}
                      <ListGroupItem>
                        <Button tag={Link} to="/entity/measure/new" color="primary" className="float-center" size="sm">
                          <FontAwesomeIcon icon="plus" />
                          <Translate contentKey="socioscopeApp.measure.home.createLabel">Create new Measure</Translate>
                        </Button>
                      </ListGroupItem>
                    </ListGroup>
                  </AvGroup>
                ) : null}
                <Button tag={Link} id="cancel-save" to="/entity/data-set" replace color="info">
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
  dataSetEntity: storeState.dataSet.entity,
  loading: storeState.dataSet.loading,
  updating: storeState.dataSet.updating,
  updateSuccess: storeState.dataSet.updateSuccess
});

const mapDispatchToProps = {
  getUsers,
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
)(DataSetUpdate);
