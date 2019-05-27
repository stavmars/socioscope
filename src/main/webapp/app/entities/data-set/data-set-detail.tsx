import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
// tslint:disable-next-line:no-unused-variable
import { Translate, ICrudGetAction, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './data-set.reducer';
import { IDataSet } from 'app/shared/model/data-set.model';
// tslint:disable-next-line:no-unused-variable
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { text } from '@fortawesome/fontawesome-svg-core';

export interface IDataSetDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export class DataSetDetail extends React.Component<IDataSetDetailProps> {
  componentWillMount() {
    this.props.getEntity(this.props.match.params.id);
  }

  componentDidMount() {
    this.props.getEntity(this.props.match.params.id);
  }

  render() {
    const { dataSetEntity, currentLocale } = this.props;
    return (
      <Row>
        <Col md="8">
          <h2>
            <Translate contentKey="socioscopeApp.dataSet.detail.title">DataSet</Translate> [<b>{dataSetEntity.id}</b>]
          </h2>
          <dl className="jh-entity-details">
            <dt>
              <span id="name">
                <Translate contentKey="socioscopeApp.dataSet.name">Name</Translate>
              </span>
            </dt>
            <dd>{currentLocale === 'el' ? dataSetEntity.name.el : dataSetEntity.name.en}</dd>
            <dt>
              <span id="type">
                <Translate contentKey="socioscopeApp.dataSet.type">Type</Translate>
              </span>
            </dt>
            <dd>{dataSetEntity.type}</dd>
            <dt>
              <span id="comment">
                <Translate contentKey="socioscopeApp.dataSet.comment">Comment</Translate>
              </span>
            </dt>
            <dd>{currentLocale === 'el' ? dataSetEntity.comment.el : dataSetEntity.comment.en}</dd>
            <dt>
              <span id="createdDate">
                <Translate contentKey="socioscopeApp.dataSet.createdDate">Created Date</Translate>
              </span>
            </dt>
            <dd>
              <TextFormat value={dataSetEntity.createdDate} type="date" format={APP_DATE_FORMAT} />
            </dd>
            <dt>
              <Translate contentKey="socioscopeApp.dataSet.creator">Creator</Translate>
            </dt>
            <dd>{dataSetEntity.creator ? dataSetEntity.creator.login : ''}</dd>
            <dt>
              <Translate contentKey="socioscopeApp.dataSet.dimensions">Dimensions</Translate>
            </dt>
            <dd>
              {dataSetEntity.dimensions
                ? dataSetEntity.dimensions.map(otherEntity => (currentLocale === 'el' ? otherEntity.name.el : otherEntity.name.en + ' / '))
                : null}
            </dd>
            <dt>
              <Translate contentKey="socioscopeApp.dataSet.measures">Measures</Translate>
            </dt>
            <dd>
              {dataSetEntity.measures
                ? dataSetEntity.measures.map(otherEntity => (currentLocale === 'el' ? otherEntity.name.el : otherEntity.name.en + ' / '))
                : null}
            </dd>
          </dl>
          <Button tag={Link} to="/entity/data-set" replace color="info">
            <FontAwesomeIcon icon="arrow-left" />{' '}
            <span className="d-none d-md-inline">
              <Translate contentKey="entity.action.back">Back</Translate>
            </span>
          </Button>
          &nbsp;
          <Button tag={Link} to={`/entity/data-set/${dataSetEntity.id}/edit`} replace color="primary">
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
  dataSetEntity: storeState.dataSet.entity,
  currentLocale: storeState.locale.currentLocale
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DataSetDetail);
