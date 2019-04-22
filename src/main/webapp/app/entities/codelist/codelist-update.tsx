import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label, Table } from 'reactstrap';
import { AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
// tslint:disable-next-line:no-unused-variable
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { IUser } from 'app/shared/model/user.model';
import { getUsers } from 'app/modules/administration/user-management/user-management.reducer';
import { getEntity, updateEntity, createEntity, reset } from './codelist.reducer';
import { ICodelist } from 'app/shared/model/codelist.model';
// tslint:disable-next-line:no-unused-variable
import { convertDateTimeFromServer } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';
import { ICode } from 'app/shared/model/code.model';

export interface ICodelistUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export interface ICodelistUpdateState {
  isNew: boolean;
}

export class CodelistUpdate extends React.Component<ICodelistUpdateProps, ICodelistUpdateState> {
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

    this.props.getUsers();
  }

  saveEntity = (event, errors, values) => {
    values.createdDate = new Date(values.createdDate);
    if (errors.length === 0) {
      const { codelistEntity } = this.props;
      const entity = {
        ...codelistEntity,
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
    this.props.history.push('/entity/codelist');
  };

  render() {
    const { codelistEntity, users, loading, updating, match } = this.props;
    const { isNew } = this.state;

    return (
      <div>
        <Row className="justify-content-center">
          <Col md="8">
            <h2 id="socioscopeApp.codelist.home.createOrEditLabel">
              <Translate contentKey="socioscopeApp.codelist.home.createOrEditLabel">Create or edit a Codelist</Translate>
            </h2>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md="8">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <AvForm model={isNew ? {} : codelistEntity} onSubmit={this.saveEntity}>
                {!isNew ? (
                  <AvGroup>
                    <Label for="id">
                      <Translate contentKey="global.field.id">ID</Translate>
                    </Label>
                    <AvInput id="codelist-id" type="text" className="form-control" name="id" required readOnly />
                  </AvGroup>
                ) : null}
                <AvGroup>
                  <Label id="nameLabel" for="name">
                    <Translate contentKey="socioscopeApp.codelist.name">Name</Translate>
                  </Label>
                  <AvField
                    id="codelist-name"
                    type="text"
                    name="name"
                    validate={{
                      required: { value: true, errorMessage: translate('entity.validation.required') }
                    }}
                  />
                </AvGroup>
                <AvGroup>
                  <Label id="descriptionLabel" for="description">
                    <Translate contentKey="socioscopeApp.codelist.description">Description</Translate>
                  </Label>
                  <AvField id="codelist-description" type="text" name="description" />
                </AvGroup>
                {!isNew ? (
                  <Table responsive>
                    <thead>
                      <tr>
                        <th>
                          <Translate contentKey="socioscopeApp.code.id">Id</Translate>
                        </th>
                        <th>
                          <Translate contentKey="socioscopeApp.code.name">Name</Translate>
                        </th>
                        <th>
                          <Translate contentKey="socioscopeApp.code.description">Description</Translate>
                        </th>
                        <th>
                          <Translate contentKey="socioscopeApp.code.parentId">Parent Id</Translate>
                        </th>
                        <th>
                          <Translate contentKey="socioscopeApp.code.order">Order</Translate>
                        </th>
                        <th>
                          <Translate contentKey="socioscopeApp.code.color">Color</Translate>
                        </th>
                        <th>
                          <Button tag={Link} to={`/entity/codelist/${codelistEntity.id}/edit/codes`} color="primary" size="sm">
                            <FontAwesomeIcon icon="plus" />{' '}
                            <span className="d-none d-md-inline">
                              <Translate contentKey="socioscopeApp.code.home.editLabel">Edit Codes</Translate>
                            </span>
                          </Button>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {codelistEntity.codes
                        ? codelistEntity.codes.map((code, i) => (
                            <tr key={`code-${i}`}>
                              <td>{code.id}</td>
                              <td>{code.name}</td>
                              <td>{code.description}</td>
                              <td>{code.parentId}</td>
                              <td>{code.order}</td>
                              <td>{code.color}</td>
                            </tr>
                          ))
                        : null}
                    </tbody>
                  </Table>
                ) : null}
                {!isNew ? (
                  <AvGroup>
                    <Label id="createdDateLabel" for="createdDate">
                      <Translate contentKey="socioscopeApp.codelist.createdDate">Created Date</Translate>
                    </Label>
                    <AvInput
                      id="codelist-createdDate"
                      type="datetime-local"
                      className="form-control"
                      name="createdDate"
                      value={convertDateTimeFromServer(this.props.codelistEntity.createdDate)}
                      readOnly
                    />
                  </AvGroup>
                ) : null}
                {!isNew ? (
                  <AvGroup>
                    <Label for="creator.login">
                      <Translate contentKey="socioscopeApp.codelist.creator">Creator</Translate>
                    </Label>
                    <AvInput id="codelist-creator" type="text" className="form-control" name="creator.login" readOnly />
                  </AvGroup>
                ) : null}
                <Button tag={Link} id="cancel-save" to="/entity/codelist" replace color="info">
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
  codelistEntity: storeState.codelist.entity,
  loading: storeState.codelist.loading,
  updating: storeState.codelist.updating,
  updateSuccess: storeState.codelist.updateSuccess
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
)(CodelistUpdate);
