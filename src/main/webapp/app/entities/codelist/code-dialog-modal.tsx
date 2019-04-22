import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Row, Col, Label, Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { AvForm, AvInput } from 'availity-reactstrap-validation';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity, addCodes } from './codelist.reducer';
import { addRow, insertTable, deleteRow } from 'app/entities/codelist/code-dialog.reducer';
import update from 'immutability-helper';

export interface ICodeDialogProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export class CodeDialogModal extends React.Component<ICodeDialogProps> {
  componentDidMount() {
    this.props.getEntity(this.props.codelistEntity.id);
    this.props.insertTable(this.props.codelistEntity.codes);
  }

  saveRow = (event, errors, values) => {
    if (errors.length === 0) {
      this.props.addRow(values);
    }
  };

  saveCode = () => {
    const { codelistEntity, codes } = this.props;
    const entity = update(codelistEntity, { codes: { $set: codes } });
    this.props.addCodes(entity);
    this.props.history.goBack();
  };

  removeRow = (e, i) => {
    this.props.deleteRow(i);
  };

  handleClose = event => {
    event.stopPropagation();
    this.props.history.goBack();
  };

  render() {
    const { codes } = this.props;

    return (
      <Modal isOpen toggle={this.handleClose} size="lg">
        <ModalHeader toggle={this.handleClose}>
          <Translate contentKey="socioscopeApp.code.home.createOrEditLabel">Create or edit a Code</Translate>
        </ModalHeader>
        <ModalBody id="socioscopeApp.code.home.createOrEditLabel">
          <Row>
            <Col>
              <Label for="id">
                <Translate contentKey="socioscopeApp.code.id">Id</Translate>
              </Label>
            </Col>
            <Col>
              <Label for="name">
                <Translate contentKey="socioscopeApp.code.name">Name</Translate>
              </Label>
            </Col>
            <Col>
              <Label for="description">
                <Translate contentKey="socioscopeApp.code.description">Description</Translate>
              </Label>
            </Col>
            <Col>
              <Label for="parentId">
                <Translate contentKey="socioscopeApp.code.parentId">Parent Id</Translate>
              </Label>
            </Col>
            <Col>
              <Label for="order">
                <Translate contentKey="socioscopeApp.code.order">Order</Translate>
              </Label>
            </Col>
            <Col>
              <Label for="color">
                <Translate contentKey="socioscopeApp.code.color">Color</Translate>
              </Label>
            </Col>
          </Row>
          {codes.map((code, i) => (
            <div key={i}>
              <Row>
                <Col>{code.id}</Col>
                <Col>{code.name}</Col>
                <Col>{code.description}</Col>
                <Col>{code.parentId}</Col>
                <Col>{code.order}</Col>
                <Col>{code.color}</Col>
                <Col>
                  &nbsp;
                  <Button onClick={e => this.removeRow(e, i)} color="danger" size="sm">
                    <FontAwesomeIcon icon="trash" />
                  </Button>
                </Col>
              </Row>
            </div>
          ))}
          <AvForm id="row-form" model={{}} onSubmit={this.saveRow}>
            <Row>
              <Col>
                <AvInput type="text" name={`id`} className="form-control" placeholder="Id" required />
              </Col>
              <Col>
                <AvInput type="text" name={`name`} className="form-control" placeholder="Name" required />
              </Col>
              <Col>
                <AvInput type="text" name={`description`} className="form-control" placeholder="Description" required />
              </Col>
              <Col>
                <AvInput type="text" name={`parentId`} className="form-control" placeholder="Parent Id" required />
              </Col>
              <Col>
                <AvInput type="number" name={`order`} className="form-control" placeholder="Order" required />
              </Col>
              <Col>
                <AvInput type="text" name={`color`} className="form-control" placeholder="Color" required />
              </Col>
            </Row>
            &nbsp;
            <Row>
              <Col className="float-right">
                <Button className="float-right" color="primary" type="submit" size="sm">
                  &nbsp;
                  <span className="d-none d-md-inline">
                    <Translate contentKey="socioscopeApp.code.home.saveRow">Save Row</Translate>
                  </span>
                </Button>
              </Col>
            </Row>
          </AvForm>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={this.handleClose}>
            <FontAwesomeIcon icon="ban" />
            &nbsp;
            <Translate contentKey="entity.action.cancel">Cancel</Translate>
          </Button>
          <Button id="add-code" color="primary" onClick={this.saveCode}>
            <FontAwesomeIcon icon="save" />
            &nbsp;
            <Translate contentKey="entity.action.save">Save</Translate>
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

const mapStateToProps = (storeState: IRootState) => ({
  codelistEntity: storeState.codelist.entity,
  codes: storeState.codes.codes,
  loading: storeState.codes.loading,
  updating: storeState.codes.updating,
  updateSuccess: storeState.codes.updateSuccess
});

const mapDispatchToProps = {
  getEntity,
  addCodes,
  addRow,
  insertTable,
  deleteRow
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CodeDialogModal);
