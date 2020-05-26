import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, InputGroup, Col, Row, Table } from 'reactstrap';
import { AvForm, AvGroup, AvInput } from 'availity-reactstrap-validation';
// tslint:disable-next-line:no-unused-variable
import { openFile, byteSize, Translate, translate, ICrudSearchAction, ICrudGetAllAction, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getSearchEntities, getEntities } from './news-post.reducer';
import { INewsPost } from 'app/shared/model/news-post.model';
// tslint:disable-next-line:no-unused-variable
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface INewsPostProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export interface INewsPostState {
  search: string;
}

export class NewsPost extends React.Component<INewsPostProps, INewsPostState> {
  state: INewsPostState = {
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
    const { newsPostList, match } = this.props;
    return (
      <div>
        <h2 id="news-post-heading">
          <Translate contentKey="socioscopeApp.newsPost.home.title">News Posts</Translate>
          <Link to={`${match.url}/new`} className="btn btn-primary float-right jh-create-entity" id="jh-create-entity">
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="socioscopeApp.newsPost.home.createLabel">Create new News Post</Translate>
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
                    placeholder={translate('socioscopeApp.newsPost.home.search')}
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
                  <Translate contentKey="socioscopeApp.newsPost.content">Content</Translate>
                </th>
                <th>
                  <Translate contentKey="socioscopeApp.newsPost.previewImage">Preview Image</Translate>
                </th>
                <th>
                  <Translate contentKey="socioscopeApp.newsPost.previewTitle">Preview Title</Translate>
                </th>
                <th>
                  <Translate contentKey="socioscopeApp.newsPost.previewSubtitle">Preview Subtitle</Translate>
                </th>
                <th>
                  <Translate contentKey="socioscopeApp.newsPost.published">Published</Translate>
                </th>
                <th>
                  <Translate contentKey="socioscopeApp.newsPost.postDate">Post Date</Translate>
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {newsPostList.map((newsPost, i) => (
                <tr key={`entity-${i}`}>
                  <td>
                    <Button tag={Link} to={`${match.url}/${newsPost.id}`} color="link" size="sm">
                      {newsPost.id}
                    </Button>
                  </td>
                  <td>{newsPost.content}</td>
                  <td>
                    {newsPost.previewImage ? (
                      <div>
                        <a onClick={openFile(newsPost.previewImageContentType, newsPost.previewImage)}>
                          <img
                            src={`data:${newsPost.previewImageContentType};base64,${newsPost.previewImage}`}
                            style={{ maxHeight: '30px' }}
                          />
                          &nbsp;
                        </a>
                        <span>
                          {newsPost.previewImageContentType}, {byteSize(newsPost.previewImage)}
                        </span>
                      </div>
                    ) : null}
                  </td>
                  <td>{newsPost.previewTitle}</td>
                  <td>{newsPost.previewSubtitle}</td>
                  <td>{newsPost.published ? 'true' : 'false'}</td>
                  <td>
                    <TextFormat type="date" value={newsPost.postDate} format={APP_DATE_FORMAT} />
                  </td>
                  <td className="text-right">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`${match.url}/${newsPost.id}`} color="info" size="sm">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button tag={Link} to={`${match.url}/${newsPost.id}/edit`} color="primary" size="sm">
                        <FontAwesomeIcon icon="pencil-alt" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.edit">Edit</Translate>
                        </span>
                      </Button>
                      <Button tag={Link} to={`${match.url}/${newsPost.id}/delete`} color="danger" size="sm">
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

const mapStateToProps = ({ newsPost }: IRootState) => ({
  newsPostList: newsPost.entities
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
)(NewsPost);
