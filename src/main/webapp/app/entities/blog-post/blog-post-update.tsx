import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
// tslint:disable-next-line:no-unused-variable
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, setFileData, openFile, byteSize, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntity, updateEntity, createEntity, setBlob, reset } from './blog-post.reducer';
import { IBlogPost } from 'app/shared/model/blog-post.model';
// tslint:disable-next-line:no-unused-variable
import { convertDateTimeFromServer } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IBlogPostUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export interface IBlogPostUpdateState {
  isNew: boolean;
}

export class BlogPostUpdate extends React.Component<IBlogPostUpdateProps, IBlogPostUpdateState> {
  constructor(props) {
    super(props);
    this.state = {
      isNew: !this.props.match.params || !this.props.match.params.id
    };
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.updateSuccess !== this.props.updateSuccess && nextProps.updateSuccess) {
      this.handleClose();
    }
  }

  componentDidMount() {
    if (this.state.isNew) {
      this.props.reset();
    } else {
      this.props.getEntity(this.props.match.params.id);
    }
  }

  onBlobChange = (isAnImage, name) => event => {
    setFileData(event, (contentType, data) => this.props.setBlob(name, data, contentType), isAnImage);
  };

  clearBlob = name => () => {
    this.props.setBlob(name, undefined, undefined);
  };

  saveEntity = (event, errors, values) => {
    values.postDate = new Date(values.postDate);

    if (errors.length === 0) {
      const { blogPostEntity } = this.props;
      const entity = {
        ...blogPostEntity,
        ...values
      };

      if (this.state.isNew) {
        this.props.createEntity(entity);
      } else {
        this.props.updateEntity(entity);
      }
    }
  };

  handleClose = () => {
    this.props.history.push('/entity/blog-post');
  };

  render() {
    const { blogPostEntity, loading, updating } = this.props;
    const { isNew } = this.state;

    const { previewImage, previewImageContentType } = blogPostEntity;

    return (
      <div>
        <Row className="justify-content-center">
          <Col md="8">
            <h2 id="socioscopeApp.blogPost.home.createOrEditLabel">
              <Translate contentKey="socioscopeApp.blogPost.home.createOrEditLabel">Create or edit a BlogPost</Translate>
            </h2>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md="8">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <AvForm model={isNew ? {} : blogPostEntity} onSubmit={this.saveEntity}>
                {!isNew ? (
                  <AvGroup>
                    <Label for="id">
                      <Translate contentKey="global.field.id">ID</Translate>
                    </Label>
                    <AvInput id="blog-post-id" type="text" className="form-control" name="id" required readOnly />
                  </AvGroup>
                ) : null}
                <AvGroup>
                  <Label id="previewTitleLabel" for="previewTitle">
                    <Translate contentKey="socioscopeApp.blogPost.previewTitle">Preview Title</Translate>
                  </Label>
                  <AvField
                    id="blog-post-previewTitle"
                    type="text"
                    name="previewTitle"
                    validate={{
                      required: { value: true, errorMessage: translate('entity.validation.required') }
                    }}
                  />
                </AvGroup>
                <AvGroup>
                  <AvGroup>
                    <Label id="previewImageLabel" for="previewImage">
                      <Translate contentKey="socioscopeApp.blogPost.previewImage">Preview Image</Translate>
                    </Label>
                    <br />
                    {previewImage ? (
                      <div>
                        <a onClick={openFile(previewImageContentType, previewImage)}>
                          <img src={`data:${previewImageContentType};base64,${previewImage}`} style={{ maxHeight: '100px' }} />
                        </a>
                        <br />
                        <Row>
                          <Col md="11">
                            <span>
                              {previewImageContentType}, {byteSize(previewImage)}
                            </span>
                          </Col>
                          <Col md="1">
                            <Button color="danger" onClick={this.clearBlob('previewImage')}>
                              <FontAwesomeIcon icon="times-circle" />
                            </Button>
                          </Col>
                        </Row>
                      </div>
                    ) : null}
                    <input id="file_previewImage" type="file" onChange={this.onBlobChange(true, 'previewImage')} accept="image/*" />
                    <AvInput type="hidden" name="previewImage" value={previewImage} />
                  </AvGroup>
                </AvGroup>
                <AvGroup>
                  <Label id="contentLabel" for="content">
                    <Translate contentKey="socioscopeApp.blogPost.content">Content</Translate>
                  </Label>
                  <AvField
                    id="blog-post-content"
                    type="text"
                    name="content"
                    validate={{
                      required: { value: true, errorMessage: translate('entity.validation.required') }
                    }}
                  />
                </AvGroup>
                <AvGroup>
                  <Label id="postDateLabel" for="postDate">
                    <Translate contentKey="socioscopeApp.blogPost.postDate">Post Date</Translate>
                  </Label>
                  <AvInput
                    id="blog-post-postDate"
                    type="datetime-local"
                    className="form-control"
                    name="postDate"
                    value={isNew ? null : convertDateTimeFromServer(this.props.blogPostEntity.postDate)}
                  />
                </AvGroup>
                <AvGroup>
                  <Label id="publishedLabel" check>
                    <AvInput id="blog-post-published" type="checkbox" className="form-control" name="published" />
                    <Translate contentKey="socioscopeApp.blogPost.published">Published</Translate>
                  </Label>
                </AvGroup>
                <AvGroup>
                  <Label id="previewTextLabel" for="previewText">
                    <Translate contentKey="socioscopeApp.blogPost.previewText">Preview Text</Translate>
                  </Label>
                  <AvField id="blog-post-previewText" type="text" name="previewText" />
                </AvGroup>
                <Button tag={Link} id="cancel-save" to="/entity/blog-post" replace color="info">
                  <FontAwesomeIcon icon="arrow-left" />
                  &nbsp;
                  <span className="d-none d-md-inline">
                    <Translate contentKey="entity.action.back">Back</Translate>
                  </span>
                </Button>
                &nbsp;
                <Button color="primary" id="save-entity" type="submit" disabled={updating}>
                  <FontAwesomeIcon icon="save" />
                  &nbsp;
                  <Translate contentKey="entity.action.save">Save</Translate>
                </Button>
              </AvForm>
            )}
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = (storeState: IRootState) => ({
  blogPostEntity: storeState.blogPost.entity,
  loading: storeState.blogPost.loading,
  updating: storeState.blogPost.updating,
  updateSuccess: storeState.blogPost.updateSuccess
});

const mapDispatchToProps = {
  getEntity,
  updateEntity,
  setBlob,
  createEntity,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BlogPostUpdate);
