import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
// tslint:disable-next-line:no-unused-variable
import { Translate, ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './dimension.reducer';
import { IDimension } from 'app/shared/model/dimension.model';
// tslint:disable-next-line:no-unused-variable
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IDimensionDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export class DimensionDetail extends React.Component<IDimensionDetailProps> {
  componentDidMount() {
    this.props.getEntity(this.props.match.params.id);
  }

  render() {
    const { dimensionEntity } = this.props;
    return (
      <Row>
        <Col md="8">
          <h2>
            <Translate contentKey="socioscopeApp.dimension.detail.title">Dimension</Translate> [<b>{dimensionEntity.id}</b>]
          </h2>
          <dl className="jh-entity-details">
            <dt>
              <span id="name">
                <Translate contentKey="socioscopeApp.dimension.name">Name</Translate>
              </span>
            </dt>
            <dd>{dimensionEntity.name}</dd>
            <dt>
              <span id="type">
                <Translate contentKey="socioscopeApp.dimension.type">Type</Translate>
              </span>
            </dt>
            <dd>{dimensionEntity.type}</dd>
            <dt>
              <Translate contentKey="socioscopeApp.dimension.dataset">Dataset</Translate>
            </dt>
            <dd>{dimensionEntity.dataset ? dimensionEntity.dataset.name : ''}</dd>
          </dl>
          <Button tag={Link} to="/entity/dimension" replace color="info">
            <FontAwesomeIcon icon="arrow-left" />{' '}
            <span className="d-none d-md-inline">
              <Translate contentKey="entity.action.back">Back</Translate>
            </span>
          </Button>
          &nbsp;
          <Button tag={Link} to={`/entity/dimension/${dimensionEntity.id}/edit`} replace color="primary">
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

const mapStateToProps = ({ dimension }: IRootState) => ({
  dimensionEntity: dimension.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DimensionDetail);
