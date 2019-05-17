import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, InputGroup, Col, Row, Table } from 'reactstrap';
import { AvForm, AvGroup, AvInput } from 'availity-reactstrap-validation';
// tslint:disable-next-line:no-unused-variable
import { Translate, translate, ICrudSearchAction, ICrudGetAllAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getSearchEntities, getEntities } from './dimension-code.reducer';
import { IDimensionCode } from 'app/shared/model/dimension-code.model';
// tslint:disable-next-line:no-unused-variable
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IDimensionCodeProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export interface IDimensionCodeState {
  search: string;
}

export class DimensionCode extends React.Component<IDimensionCodeProps, IDimensionCodeState> {
  state: IDimensionCodeState = {
    search: ''
  };

  componentDidMount() {
    this.props.getEntities();
  }

  search = () => {
    if (this.state.search) {
      this.props.getSearchEntities(this.state.search);
    }
  };

  clear = () => {
    this.props.getEntities();
    this.setState({
      search: ''
    });
  };

  handleSearch = event => this.setState({ search: event.target.value });

  render() {
    const { dimensionCodeList, match } = this.props;
    return (
      <div>
        <h2 id="dimension-code-heading">
          <Translate contentKey="socioscopeApp.dimensionCode.home.title">Dimension Codes</Translate>
          <Link to={`${match.url}/new`} className="btn btn-primary float-right jh-create-entity" id="jh-create-entity">
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="socioscopeApp.dimensionCode.home.createLabel">Create new Dimension Code</Translate>
          </Link>
        </h2>
        <Row>
          <Col sm="12">
            <AvForm onSubmit={this.search}>
              <AvGroup>
                <InputGroup>
                  <AvInput
                    type="text"
                    name="search"
                    value={this.state.search}
                    onChange={this.handleSearch}
                    placeholder={translate('socioscopeApp.dimensionCode.home.search')}
                  />
                  <Button className="input-group-addon">
                    <FontAwesomeIcon icon="search" />
                  </Button>
                  <Button type="reset" className="input-group-addon" onClick={this.clear}>
                    <FontAwesomeIcon icon="trash" />
                  </Button>
                </InputGroup>
              </AvGroup>
            </AvForm>
          </Col>
        </Row>
        <div className="table-responsive">
          <Table responsive>
            <thead>
              <tr>
                <th>
                  <Translate contentKey="global.field.id">ID</Translate>
                </th>
                <th>
                  <Translate contentKey="socioscopeApp.dimensionCode.dimensionId">Dimension Id</Translate>
                </th>
                <th>
                  <Translate contentKey="socioscopeApp.dimensionCode.notation">Notation</Translate>
                </th>
                <th>
                  <Translate contentKey="socioscopeApp.dimensionCode.name">Name</Translate>
                </th>
                <th>
                  <Translate contentKey="socioscopeApp.dimensionCode.description">Description</Translate>
                </th>
                <th>
                  <Translate contentKey="socioscopeApp.dimensionCode.parentId">Parent Id</Translate>
                </th>
                <th>
                  <Translate contentKey="socioscopeApp.dimensionCode.order">Order</Translate>
                </th>
                <th>
                  <Translate contentKey="socioscopeApp.dimensionCode.color">Color</Translate>
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {dimensionCodeList.map((dimensionCode, i) => (
                <tr key={`entity-${i}`}>
                  <td>
                    <Button tag={Link} to={`${match.url}/${dimensionCode.id}`} color="link" size="sm">
                      {dimensionCode.id}
                    </Button>
                  </td>
                  <td>{dimensionCode.dimensionId}</td>
                  <td>{dimensionCode.notation}</td>
                  <td>{dimensionCode.name}</td>
                  <td>{dimensionCode.description}</td>
                  <td>{dimensionCode.parentId}</td>
                  <td>{dimensionCode.order}</td>
                  <td>{dimensionCode.color}</td>
                  <td className="text-right">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`${match.url}/${dimensionCode.id}`} color="info" size="sm">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button tag={Link} to={`${match.url}/${dimensionCode.id}/edit`} color="primary" size="sm">
                        <FontAwesomeIcon icon="pencil-alt" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.edit">Edit</Translate>
                        </span>
                      </Button>
                      <Button tag={Link} to={`${match.url}/${dimensionCode.id}/delete`} color="danger" size="sm">
                        <FontAwesomeIcon icon="trash" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.delete">Delete</Translate>
                        </span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ dimensionCode }: IRootState) => ({
  dimensionCodeList: dimensionCode.entities
});

const mapDispatchToProps = {
  getSearchEntities,
  getEntities
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DimensionCode);
