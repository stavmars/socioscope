import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
// tslint:disable-next-line:no-unused-variable
import { Translate, ICrudGetAction, openFile, byteSize, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './blog-post.reducer';
import { IBlogPost } from 'app/shared/model/blog-post.model';
// tslint:disable-next-line:no-unused-variable
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IBlogPostDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export class BlogPostDetail extends React.Component<IBlogPostDetailProps> {
  componentDidMount() {
    this.props.getEntity(this.props.match.params.id);
  }

  render() {
    const { blogPostEntity } = this.props;
    return (
      <Row>
        <Col md="8">
          <h2>
            <Translate contentKey="socioscopeApp.blogPost.detail.title">BlogPost</Translate> [<b>{blogPostEntity.id}</b>]
          </h2>
          <dl className="jh-entity-details">
            <dt>
              <span id="previewTitle">
                <Translate contentKey="socioscopeApp.blogPost.previewTitle">Preview Title</Translate>
              </span>
            </dt>
            <dd>{blogPostEntity.previewTitle}</dd>
            <dt>
              <span id="previewImage">
                <Translate contentKey="socioscopeApp.blogPost.previewImage">Preview Image</Translate>
              </span>
            </dt>
            <dd>
              {blogPostEntity.previewImage ? (
                <div>
                  <a onClick={openFile(blogPostEntity.previewImageContentType, blogPostEntity.previewImage)}>
                    <img
                      src={`data:${blogPostEntity.previewImageContentType};base64,${blogPostEntity.previewImage}`}
                      style={{ maxHeight: '30px' }}
                    />
                  </a>
                  <span>
                    {blogPostEntity.previewImageContentType}, {byteSize(blogPostEntity.previewImage)}
                  </span>
                </div>
              ) : null}
            </dd>
            <dt>
              <span id="content">
                <Translate contentKey="socioscopeApp.blogPost.content">Content</Translate>
              </span>
            </dt>
            <dd>{blogPostEntity.content}</dd>
            <dt>
              <span id="postDate">
                <Translate contentKey="socioscopeApp.blogPost.postDate">Post Date</Translate>
              </span>
            </dt>
            <dd>
              <TextFormat value={blogPostEntity.postDate} type="date" format={APP_DATE_FORMAT} />
            </dd>
            <dt>
              <span id="published">
                <Translate contentKey="socioscopeApp.blogPost.published">Published</Translate>
              </span>
            </dt>
            <dd>{blogPostEntity.published ? 'true' : 'false'}</dd>
            <dt>
              <span id="previewText">
                <Translate contentKey="socioscopeApp.blogPost.previewText">Preview Text</Translate>
              </span>
            </dt>
            <dd>{blogPostEntity.previewText}</dd>
          </dl>
          <Button tag={Link} to="/entity/blog-post" replace color="info">
            <FontAwesomeIcon icon="arrow-left" />{' '}
            <span className="d-none d-md-inline">
              <Translate contentKey="entity.action.back">Back</Translate>
            </span>
          </Button>
          &nbsp;
          <Button tag={Link} to={`/entity/blog-post/${blogPostEntity.id}/edit`} replace color="primary">
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

const mapStateToProps = ({ blogPost }: IRootState) => ({
  blogPostEntity: blogPost.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BlogPostDetail);
