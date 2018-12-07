import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
// tslint:disable-next-line:no-unused-variable
import { Translate, ICrudGetAction, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './codelist.reducer';
import { ICodelist } from 'app/shared/model/codelist.model';
// tslint:disable-next-line:no-unused-variable
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface ICodelistDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export class CodelistDetail extends React.Component<ICodelistDetailProps> {
  componentDidMount() {
    this.props.getEntity(this.props.match.params.id);
  }

  render() {
    const { codelistEntity } = this.props;
    return (
      <Row>
        <Col md="8">
          <h2>
            <Translate contentKey="socioscopeApp.codelist.detail.title">Codelist</Translate> [<b>{codelistEntity.id}</b>]
          </h2>
          <dl className="jh-entity-details">
            <dt>
              <span id="name">
                <Translate contentKey="socioscopeApp.codelist.name">Name</Translate>
              </span>
            </dt>
            <dd>{codelistEntity.name}</dd>
            <dt>
              <span id="description">
                <Translate contentKey="socioscopeApp.codelist.description">Description</Translate>
              </span>
            </dt>
            <dd>{codelistEntity.description}</dd>
            <dt>
              <span id="createdDate">
                <Translate contentKey="socioscopeApp.codelist.createdDate">Created Date</Translate>
              </span>
            </dt>
            <dd>
              <TextFormat value={codelistEntity.createdDate} type="date" format={APP_DATE_FORMAT} />
            </dd>
            <dt>
              <Translate contentKey="socioscopeApp.codelist.creator">Creator</Translate>
            </dt>
            <dd>{codelistEntity.creator ? codelistEntity.creator.login : ''}</dd>
          </dl>
          <Button tag={Link} to="/entity/codelist" replace color="info">
            <FontAwesomeIcon icon="arrow-left" />{' '}
            <span className="d-none d-md-inline">
              <Translate contentKey="entity.action.back">Back</Translate>
            </span>
          </Button>
          &nbsp;
          <Button tag={Link} to={`/entity/codelist/${codelistEntity.id}/edit`} replace color="primary">
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

const mapStateToProps = ({ codelist }: IRootState) => ({
  codelistEntity: codelist.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CodelistDetail);
