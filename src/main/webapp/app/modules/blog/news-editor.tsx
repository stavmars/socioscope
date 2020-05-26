/* tslint:disable:jsx-no-lambda */
import './news-editor.scss';
import React from 'react';
import { connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';
import { Button, Dimmer, Loader, Grid, Image, Input } from 'semantic-ui-react';
import {
  createEntity as createNewsPost,
  getEntity as getNewsPost,
  updateEntity as updateNewsPost,
  setBlob,
  reset
} from 'app/entities/news-post/news-post.reducer';
import { setFileData } from 'react-jhipster';
import moment, { Moment } from 'moment';

import CKEditor from '@ckeditor/ckeditor5-react';
import DecoupledEditor from 'ckeditor5-build-decoupled-document-base64-imageresize';
import { RouteComponentProps } from 'react-router-dom';
import { convertDateTimeFromServer } from 'app/shared/util/date-utils';

export interface INewsEditorProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export interface INewsEditorState {
  isNew: boolean;
  title: string;
  subtitle: string;
  published: boolean;
  date: Moment;
  saving: boolean;
}

class NewsEditor extends React.Component<INewsEditorProps, INewsEditorState> {
  editor = React.createRef<CKEditor>();

  constructor(props) {
    super(props);
    this.state = {
      isNew: !this.props.match.params || !this.props.match.params.id,
      title: '',
      subtitle: '',
      date: null,
      published: false,
      saving: false
    };
  }

  componentDidMount() {
    if (this.state.isNew) {
      this.props.reset();
    } else {
      this.props.getNewsPost(this.props.match.params.id);
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.updateSuccess !== this.props.updateSuccess && nextProps.updateSuccess) {
      this.handleClose();
    }
  }

  componentDidUpdate(prevProps: Readonly<INewsEditorProps>, prevState: Readonly<INewsEditorState>) {
    if (
      prevProps.newsPostEntity.id !== this.props.newsPostEntity.id ||
      (!this.state.isNew &&
        this.state.published === false &&
        this.state.title === '' &&
        this.state.subtitle === '' &&
        this.state.date === null)
    ) {
      this.setState({
        ...this.state,
        title: this.props.newsPostEntity.previewTitle,
        subtitle: this.props.newsPostEntity.previewSubtitle,
        date: this.props.newsPostEntity.postDate,
        published: this.props.newsPostEntity.published
      });
    } else if (prevProps.errorMessage !== this.props.errorMessage && this.props.errorMessage !== null) {
      alert(this.props.errorMessage);
      this.setState({
        ...this.state,
        saving: false
      });
    }
  }

  onBlobChange = (isAnImage, name) => event => {
    setFileData(event, (contentType, data) => this.props.setBlob(name, data, contentType), isAnImage);
  };

  onTitleChange = event => {
    this.setState({
      ...this.state,
      title: event.target.value
    });
  };

  onSubtitleChange = event => {
    this.setState({
      ...this.state,
      subtitle: event.target.value
    });
  };

  onDateChange = event => {
    this.setState({
      ...this.state,
      date: moment(event.target.value)
    });
  };

  clearBlob = name => () => {
    this.props.setBlob(name, undefined, undefined);
  };

  changePublish = () =>
    this.setState({
      ...this.state,
      published: !this.state.published
    });

  save = () => {
    this.setState({
      ...this.state,
      saving: true
    });
    const editorData = this.editor.current.editor.getData();
    const { newsPostEntity } = this.props;
    if (this.state.isNew) {
      this.props.createNewsPost({
        ...newsPostEntity,
        previewTitle: this.state.title,
        previewSubtitle: this.state.subtitle,
        postDate: this.state.date,
        published: this.state.published,
        content: `${editorData}`
      });
    } else {
      this.props.updateNewsPost({
        ...newsPostEntity,
        previewTitle: this.state.title,
        previewSubtitle: this.state.subtitle,
        postDate: this.state.date,
        published: this.state.published,
        content: `${editorData}`
      });
    }
  };

  handleClose = () => {
    this.setState({
      ...this.state,
      saving: false
    });
    this.props.history.push('/blog');
  };

  render() {
    const { loading, newsPostEntity } = this.props;
    const { isNew } = this.state;

    const { previewImage, previewImageContentType } = newsPostEntity;

    return loading ? (
      <Dimmer active page>
        <Loader />
      </Dimmer>
    ) : (
      <div className="news-editor-page">
        <span style={{ fontFamily: 'ProximaNovaRegular' }}>Add a Preview Title...</span>
        <br />
        <br />
        <Input
          id="news-post-previewTitle"
          type="text"
          name="previewTitle"
          value={this.state.title}
          onChange={this.onTitleChange}
          style={{
            width: '50%'
          }}
          required
        />
        <br />
        <br />
        <span style={{ fontFamily: 'ProximaNovaRegular' }}>Add a Preview Subtitle...</span>
        <br />
        <br />
        <Input
          id="news-post-previewSubtitle"
          type="text"
          name="previewSubtitle"
          value={this.state.subtitle}
          onChange={this.onSubtitleChange}
          style={{
            width: '50%'
          }}
          required
        />
        <br />
        <br />
        <span style={{ fontFamily: 'ProximaNovaRegular' }}>Add Post Date...</span>
        <br />
        <br />
        <Input
          id="news-post-postDate"
          type="date"
          name="postDate"
          placeholder={'YYYY-MM-DD'}
          onChange={this.onDateChange}
          value={convertDateTimeFromServer(this.state.date)}
        />
        <br />
        <br />
        <span style={{ fontFamily: 'ProximaNovaRegular' }}>Add a Preview Image...</span>
        <br />
        <br />
        {previewImage ? (
          <Grid style={{ width: '30vw' }}>
            <Grid.Row columns={2}>
              <Grid.Column>
                <Image src={`data:${previewImageContentType};base64,${previewImage}`} style={{ maxHeight: '200px' }} />
              </Grid.Column>
              <Grid.Column>
                <Button
                  onClick={this.clearBlob('previewImage')}
                  style={{
                    marginLeft: '20px',
                    marginTop: '70px'
                  }}
                  color="red"
                  icon="undo"
                  size="tiny"
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        ) : null}
        <br />
        <Input id="file_previewImage" type="file" onChange={this.onBlobChange(true, 'previewImage')} accept="image/*" />
        <br />
        <br />
        <span style={{ fontFamily: 'ProximaNovaRegular' }}>Check if post should be published...</span>{' '}
        <input type="checkbox" name="published" checked={this.state.published} onChange={this.changePublish} />
        <br />
        <br />
        <span style={{ fontFamily: 'ProximaNovaRegular' }}>Create post below...</span>
        <div className="news-editor-container">
          <CKEditor
            editor={DecoupledEditor}
            data={!isNew ? newsPostEntity.content : null}
            onInit={editor => {
              // Inserts the toolbar before the editable area.
              editor.ui.view.editable.element.parentElement.insertBefore(editor.ui.view.toolbar.element, editor.ui.view.editable.element);
            }}
            ref={this.editor}
          />
        </div>
        <Button
          content="Save post"
          primary
          onClick={this.save}
          loading={this.state.saving}
          style={{ fontFamily: 'ProximaNovaRegular', float: 'right', margin: '1em 0 0 1em' }}
        />
      </div>
    );
  }
}

const mapStateToProps = (storeState: IRootState) => ({
  newsPostEntity: storeState.newsPost.entity,
  updateSuccess: storeState.newsPost.updateSuccess,
  loading: storeState.newsPost.loading,
  errorMessage: storeState.newsPost.errorMessage
});

const mapDispatchToProps = {
  setBlob,
  reset,
  createNewsPost,
  getNewsPost,
  updateNewsPost
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewsEditor);
