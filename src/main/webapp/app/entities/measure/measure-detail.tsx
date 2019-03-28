import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
// tslint:disable-next-line:no-unused-variable
import { Translate, ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './measure.reducer';
import { IMeasure } from 'app/shared/model/measure.model';
// tslint:disable-next-line:no-unused-variable
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IMeasureDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export class MeasureDetail extends React.Component<IMeasureDetailProps> {
  componentDidMount() {
    this.props.getEntity(this.props.match.params.id);
  }

  render() {
    const { measureEntity } = this.props;
    return (
      <Row>
        <Col md="8">
          <h2>
            <Translate contentKey="socioscopeApp.measure.detail.title">Measure</Translate> [<b>{measureEntity.id}</b>]
          </h2>
          <dl className="jh-entity-details">
            <dt>
              <span id="name">
                <Translate contentKey="socioscopeApp.measure.name">Name</Translate>
              </span>
            </dt>
            <dd>{measureEntity.name}</dd>
            <dt>
              <span id="unit">
                <Translate contentKey="socioscopeApp.measure.unit">Unit</Translate>
              </span>
            </dt>
            <dd>{measureEntity.unit}</dd>
            <dt>
              <Translate contentKey="socioscopeApp.measure.creator">Creator</Translate>
            </dt>
            <dd>{measureEntity.creator ? measureEntity.creator.login : ''}</dd>
            <dt>
              <Translate contentKey="socioscopeApp.measure.dataset">Dataset</Translate>
            </dt>
            <dd>{measureEntity.dataset ? measureEntity.dataset.name : ''}</dd>
          </dl>
          <Button tag={Link} to="/entity/measure" replace color="info">
            <FontAwesomeIcon icon="arrow-left" />{' '}
            <span className="d-none d-md-inline">
              <Translate contentKey="entity.action.back">Back</Translate>
            </span>
          </Button>
          &nbsp;
          <Button tag={Link} to={`/entity/measure/${measureEntity.id}/edit`} replace color="primary">
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

const mapStateToProps = ({ measure }: IRootState) => ({
  measureEntity: measure.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MeasureDetail);
