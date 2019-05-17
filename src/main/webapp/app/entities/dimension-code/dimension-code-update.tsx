import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
// tslint:disable-next-line:no-unused-variable
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntity, updateEntity, createEntity, reset } from './dimension-code.reducer';
import { IDimensionCode } from 'app/shared/model/dimension-code.model';
// tslint:disable-next-line:no-unused-variable
import { convertDateTimeFromServer } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IDimensionCodeUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export interface IDimensionCodeUpdateState {
  isNew: boolean;
}

export class DimensionCodeUpdate extends React.Component<IDimensionCodeUpdateProps, IDimensionCodeUpdateState> {
  constructor(props) {
    super(props);
    this.state = {
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
  }

  saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const { dimensionCodeEntity } = this.props;
      const entity = {
        ...dimensionCodeEntity,
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
    this.props.history.push('/entity/dimension-code');
  };

  render() {
    const { dimensionCodeEntity, loading, updating } = this.props;
    const { isNew } = this.state;

    return (
      <div>
        <Row className="justify-content-center">
          <Col md="8">
            <h2 id="socioscopeApp.dimensionCode.home.createOrEditLabel">
              <Translate contentKey="socioscopeApp.dimensionCode.home.createOrEditLabel">Create or edit a DimensionCode</Translate>
            </h2>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md="8">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <AvForm model={isNew ? {} : dimensionCodeEntity} onSubmit={this.saveEntity}>
                {!isNew ? (
                  <AvGroup>
                    <Label for="id">
                      <Translate contentKey="global.field.id">ID</Translate>
                    </Label>
                    <AvInput id="dimension-code-id" type="text" className="form-control" name="id" required readOnly />
                  </AvGroup>
                ) : null}
                <AvGroup>
                  <Label id="dimensionIdLabel" for="dimensionId">
                    <Translate contentKey="socioscopeApp.dimensionCode.dimensionId">Dimension Id</Translate>
                  </Label>
                  <AvField
                    id="dimension-code-dimensionId"
                    type="text"
                    name="dimensionId"
                    validate={{
                      required: { value: true, errorMessage: translate('entity.validation.required') }
                    }}
                  />
                </AvGroup>
                <AvGroup>
                  <Label id="notationLabel" for="notation">
                    <Translate contentKey="socioscopeApp.dimensionCode.notation">Notation</Translate>
                  </Label>
                  <AvField
                    id="dimension-code-notation"
                    type="text"
                    name="notation"
                    validate={{
                      required: { value: true, errorMessage: translate('entity.validation.required') }
                    }}
                  />
                </AvGroup>
                <AvGroup>
                  <Label id="nameLabel" for="name">
                    <Translate contentKey="socioscopeApp.dimensionCode.name">Name</Translate>
                  </Label>
                  <AvField
                    id="dimension-code-name"
                    type="text"
                    name="name"
                    validate={{
                      required: { value: true, errorMessage: translate('entity.validation.required') },
                      minLength: { value: 3, errorMessage: translate('entity.validation.minlength', { min: 3 }) }
                    }}
                  />
                </AvGroup>
                <AvGroup>
                  <Label id="descriptionLabel" for="description">
                    <Translate contentKey="socioscopeApp.dimensionCode.description">Description</Translate>
                  </Label>
                  <AvField id="dimension-code-description" type="text" name="description" />
                </AvGroup>
                <AvGroup>
                  <Label id="parentIdLabel" for="parentId">
                    <Translate contentKey="socioscopeApp.dimensionCode.parentId">Parent Id</Translate>
                  </Label>
                  <AvField id="dimension-code-parentId" type="text" name="parentId" />
                </AvGroup>
                <AvGroup>
                  <Label id="orderLabel" for="order">
                    <Translate contentKey="socioscopeApp.dimensionCode.order">Order</Translate>
                  </Label>
                  <AvField id="dimension-code-order" type="string" className="form-control" name="order" />
                </AvGroup>
                <AvGroup>
                  <Label id="colorLabel" for="color">
                    <Translate contentKey="socioscopeApp.dimensionCode.color">Color</Translate>
                  </Label>
                  <AvField id="dimension-code-color" type="text" name="color" />
                </AvGroup>
                <Button tag={Link} id="cancel-save" to="/entity/dimension-code" replace color="info">
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
  dimensionCodeEntity: storeState.dimensionCode.entity,
  loading: storeState.dimensionCode.loading,
  updating: storeState.dimensionCode.updating,
  updateSuccess: storeState.dimensionCode.updateSuccess
});

const mapDispatchToProps = {
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
)(DimensionCodeUpdate);
