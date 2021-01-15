import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Row, Table } from 'reactstrap';
// tslint:disable-next-line:no-unused-variable
import { openFile, byteSize, Translate, ICrudGetAllAction, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntities } from './blog-post.reducer';
import { IBlogPost } from 'app/shared/model/blog-post.model';
// tslint:disable-next-line:no-unused-variable
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IBlogPostProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export class BlogPost extends React.Component<IBlogPostProps> {
  componentDidMount() {
    this.props.getEntities();
  }

  render() {
    const { blogPostList, match } = this.props;
    return (
      <div>
        <h2 id="blog-post-heading">
          <Translate contentKey="socioscopeApp.blogPost.home.title">Blog Posts</Translate>
          <Link to={`${match.url}/new`} className="btn btn-primary float-right jh-create-entity" id="jh-create-entity">
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="socioscopeApp.blogPost.home.createLabel">Create new Blog Post</Translate>
          </Link>
        </h2>
        <div className="table-responsive">
          <Table responsive>
            <thead>
              <tr>
                <th>
                  <Translate contentKey="global.field.id">ID</Translate>
                </th>
                <th>
                  <Translate contentKey="socioscopeApp.blogPost.previewTitle">Preview Title</Translate>
                </th>
                <th>
                  <Translate contentKey="socioscopeApp.blogPost.previewImage">Preview Image</Translate>
                </th>
                <th>
                  <Translate contentKey="socioscopeApp.blogPost.content">Content</Translate>
                </th>
                <th>
                  <Translate contentKey="socioscopeApp.blogPost.postDate">Post Date</Translate>
                </th>
                <th>
                  <Translate contentKey="socioscopeApp.blogPost.published">Published</Translate>
                </th>
                <th>
                  <Translate contentKey="socioscopeApp.blogPost.previewText">Preview Text</Translate>
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {blogPostList.map((blogPost, i) => (
                <tr key={`entity-${i}`}>
                  <td>
                    <Button tag={Link} to={`${match.url}/${blogPost.id}`} color="link" size="sm">
                      {blogPost.id}
                    </Button>
                  </td>
                  <td>{blogPost.previewTitle}</td>
                  <td>
                    {blogPost.previewImage ? (
                      <div>
                        <a onClick={openFile(blogPost.previewImageContentType, blogPost.previewImage)}>
                          <img
                            src={`data:${blogPost.previewImageContentType};base64,${blogPost.previewImage}`}
                            style={{ maxHeight: '30px' }}
                          />
                          &nbsp;
                        </a>
                        <span>
                          {blogPost.previewImageContentType}, {byteSize(blogPost.previewImage)}
                        </span>
                      </div>
                    ) : null}
                  </td>
                  <td>{blogPost.content}</td>
                  <td>
                    <TextFormat type="date" value={blogPost.postDate} format={APP_DATE_FORMAT} />
                  </td>
                  <td>{blogPost.published ? 'true' : 'false'}</td>
                  <td>{blogPost.previewText}</td>
                  <td className="text-right">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`${match.url}/${blogPost.id}`} color="info" size="sm">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button tag={Link} to={`${match.url}/${blogPost.id}/edit`} color="primary" size="sm">
                        <FontAwesomeIcon icon="pencil-alt" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.edit">Edit</Translate>
                        </span>
                      </Button>
                      <Button tag={Link} to={`${match.url}/${blogPost.id}/delete`} color="danger" size="sm">
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

const mapStateToProps = ({ blogPost }: IRootState) => ({
  blogPostList: blogPost.entities
});

const mapDispatchToProps = {
  getEntities
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BlogPost);
