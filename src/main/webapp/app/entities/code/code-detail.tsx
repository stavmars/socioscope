import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
// tslint:disable-next-line:no-unused-variable
import { Translate, ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './code.reducer';
import { ICode } from 'app/shared/model/code.model';
// tslint:disable-next-line:no-unused-variable
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface ICodeDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export class CodeDetail extends React.Component<ICodeDetailProps> {
  componentDidMount() {
    this.props.getEntity(this.props.match.params.id);
  }

  render() {
    const { codeEntity } = this.props;
    return (
      <Row>
        <Col md="8">
          <h2>
            <Translate contentKey="socioscopeApp.code.detail.title">Code</Translate> [<b>{codeEntity.id}</b>]
          </h2>
          <dl className="jh-entity-details">
            <dt>
              <span id="codelistId">
                <Translate contentKey="socioscopeApp.code.codelistId">Codelist Id</Translate>
              </span>
            </dt>
            <dd>{codeEntity.codelistId}</dd>
            <dt>
              <span id="name">
                <Translate contentKey="socioscopeApp.code.name">Name</Translate>
              </span>
            </dt>
            <dd>{codeEntity.name}</dd>
            <dt>
              <span id="description">
                <Translate contentKey="socioscopeApp.code.description">Description</Translate>
              </span>
            </dt>
            <dd>{codeEntity.description}</dd>
            <dt>
              <span id="parentCodeId">
                <Translate contentKey="socioscopeApp.code.parentCodeId">Parent Code Id</Translate>
              </span>
            </dt>
            <dd>{codeEntity.parentCodeId}</dd>
            <dt>
              <span id="order">
                <Translate contentKey="socioscopeApp.code.order">Order</Translate>
              </span>
            </dt>
            <dd>{codeEntity.order}</dd>
            <dt>
              <span id="color">
                <Translate contentKey="socioscopeApp.code.color">Color</Translate>
              </span>
            </dt>
            <dd>{codeEntity.color}</dd>
          </dl>
          <Button tag={Link} to="/entity/code" replace color="info">
            <FontAwesomeIcon icon="arrow-left" />{' '}
            <span className="d-none d-md-inline">
              <Translate contentKey="entity.action.back">Back</Translate>
            </span>
          </Button>
          &nbsp;
          <Button tag={Link} to={`/entity/code/${codeEntity.id}/edit`} replace color="primary">
            <FontAwesomeIcon icon="pencil-alt" />{' '}
            <span className="d-none d-md-inline">
              <Translate contentKey="entity.action.edit">Edit</Translate>
            </span>
          </Button>
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = ({ code }: IRootState) => ({
  codeEntity: code.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CodeDetail);
