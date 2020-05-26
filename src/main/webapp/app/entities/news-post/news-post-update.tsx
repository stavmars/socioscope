import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
// tslint:disable-next-line:no-unused-variable
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, setFileData, openFile, byteSize, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntity, updateEntity, createEntity, setBlob, reset } from './news-post.reducer';
import { INewsPost } from 'app/shared/model/news-post.model';
// tslint:disable-next-line:no-unused-variable
import { convertDateTimeFromServer } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface INewsPostUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export interface INewsPostUpdateState {
  isNew: boolean;
}

export class NewsPostUpdate extends React.Component<INewsPostUpdateProps, INewsPostUpdateState> {
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
      const { newsPostEntity } = this.props;
      const entity = {
        ...newsPostEntity,
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
    this.props.history.push('/entity/news-post');
  };

  render() {
    const { newsPostEntity, loading, updating } = this.props;
    const { isNew } = this.state;

    const { previewImage, previewImageContentType } = newsPostEntity;

    return (
      <div>
        <Row className="justify-content-center">
          <Col md="8">
            <h2 id="socioscopeApp.newsPost.home.createOrEditLabel">
              <Translate contentKey="socioscopeApp.newsPost.home.createOrEditLabel">Create or edit a NewsPost</Translate>
            </h2>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md="8">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <AvForm model={isNew ? {} : newsPostEntity} onSubmit={this.saveEntity}>
                {!isNew ? (
                  <AvGroup>
                    <Label for="id">
                      <Translate contentKey="global.field.id">ID</Translate>
                    </Label>
                    <AvInput id="news-post-id" type="text" className="form-control" name="id" required readOnly />
                  </AvGroup>
                ) : null}
                <AvGroup>
                  <Label id="contentLabel" for="content">
                    <Translate contentKey="socioscopeApp.newsPost.content">Content</Translate>
                  </Label>
                  <AvField id="news-post-content" type="text" name="content" />
                </AvGroup>
                <AvGroup>
                  <AvGroup>
                    <Label id="previewImageLabel" for="previewImage">
                      <Translate contentKey="socioscopeApp.newsPost.previewImage">Preview Image</Translate>
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
                  <Label id="previewTitleLabel" for="previewTitle">
                    <Translate contentKey="socioscopeApp.newsPost.previewTitle">Preview Title</Translate>
                  </Label>
                  <AvField id="news-post-previewTitle" type="text" name="previewTitle" />
                </AvGroup>
                <AvGroup>
                  <Label id="previewSubtitleLabel" for="previewSubtitle">
                    <Translate contentKey="socioscopeApp.newsPost.previewSubtitle">Preview Subtitle</Translate>
                  </Label>
                  <AvField id="news-post-previewSubtitle" type="text" name="previewSubtitle" />
                </AvGroup>
                <AvGroup>
                  <Label id="publishedLabel" check>
                    <AvInput id="news-post-published" type="checkbox" className="form-control" name="published" />
                    <Translate contentKey="socioscopeApp.newsPost.published">Published</Translate>
                  </Label>
                </AvGroup>
                <AvGroup>
                  <Label id="postDateLabel" for="postDate">
                    <Translate contentKey="socioscopeApp.newsPost.postDate">Post Date</Translate>
                  </Label>
                  <AvInput
                    id="news-post-postDate"
                    type="datetime-local"
                    className="form-control"
                    name="postDate"
                    value={isNew ? null : convertDateTimeFromServer(this.props.newsPostEntity.postDate)}
                  />
                </AvGroup>
                <Button tag={Link} id="cancel-save" to="/entity/news-post" replace color="info">
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
  newsPostEntity: storeState.newsPost.entity,
  loading: storeState.newsPost.loading,
  updating: storeState.newsPost.updating,
  updateSuccess: storeState.newsPost.updateSuccess
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
)(NewsPostUpdate);
