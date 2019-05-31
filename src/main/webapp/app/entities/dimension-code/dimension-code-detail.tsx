import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
// tslint:disable-next-line:no-unused-variable
import { Translate, ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './dimension-code.reducer';
import { IDimensionCode } from 'app/shared/model/dimension-code.model';
// tslint:disable-next-line:no-unused-variable
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IDimensionCodeDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export class DimensionCodeDetail extends React.Component<IDimensionCodeDetailProps> {
  componentDidMount() {
    this.props.getEntity(this.props.match.params.id);
  }

  render() {
    const { dimensionCodeEntity, currentLocale } = this.props;
    return (
      <Row>
        <Col md="8">
          <h2>
            <Translate contentKey="socioscopeApp.dimensionCode.detail.title">DimensionCode</Translate> [<b>{dimensionCodeEntity.id}</b>]
          </h2>
          <dl className="jh-entity-details">
            <dt>
              <span id="dimensionId">
                <Translate contentKey="socioscopeApp.dimensionCode.dimensionId">Dimension Id</Translate>
              </span>
            </dt>
            <dd>{dimensionCodeEntity.dimensionId}</dd>
            <dt>
              <span id="notation">
                <Translate contentKey="socioscopeApp.dimensionCode.notation">Notation</Translate>
              </span>
            </dt>
            <dd>{dimensionCodeEntity.notation}</dd>
            <dt>
              <span id="name">
                <Translate contentKey="socioscopeApp.dimensionCode.name">Name</Translate>
              </span>
            </dt>
            <dd>{currentLocale === 'el' ? dimensionCodeEntity.name.el : dimensionCodeEntity.name.en}</dd>
            <dt>
              <span id="description">
                <Translate contentKey="socioscopeApp.dimensionCode.description">Description</Translate>
              </span>
            </dt>
            <dd>{currentLocale === 'el' ? dimensionCodeEntity.description.el : dimensionCodeEntity.description.en}</dd>
            <dt>
              <span id="parentId">
                <Translate contentKey="socioscopeApp.dimensionCode.parentId">Parent Id</Translate>
              </span>
            </dt>
            <dd>{dimensionCodeEntity.parentId}</dd>
            <dt>
              <span id="order">
                <Translate contentKey="socioscopeApp.dimensionCode.order">Order</Translate>
              </span>
            </dt>
            <dd>{dimensionCodeEntity.order}</dd>
            <dt>
              <span id="color">
                <Translate contentKey="socioscopeApp.dimensionCode.color">Color</Translate>
              </span>
            </dt>
            <dd>{dimensionCodeEntity.color}</dd>
          </dl>
          <Button tag={Link} to="/entity/dimension-code" replace color="info">
            <FontAwesomeIcon icon="arrow-left" />{' '}
            <span className="d-none d-md-inline">
              <Translate contentKey="entity.action.back">Back</Translate>
            </span>
          </Button>
          &nbsp;
          <Button tag={Link} to={`/entity/dimension-code/${dimensionCodeEntity.id}/edit`} replace color="primary">
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

const mapStateToProps = (storeState: IRootState) => ({
  dimensionCodeEntity: storeState.dimensionCode.entity,
  currentLocale: storeState.locale.currentLocale
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DimensionCodeDetail);
