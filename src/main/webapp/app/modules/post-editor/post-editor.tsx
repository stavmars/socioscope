/* tslint:disable:jsx-no-lambda */
import './post-editor.scss';
import React from 'react';
import { connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';
import { Button, Dimmer, Loader, Grid, Image, Input } from 'semantic-ui-react';
import {
  createEntity as createBlogPost,
  getEntity as getBlogPost,
  updateEntity as updateBlogPost,
  setBlob,
  reset
} from 'app/entities/blog-post/blog-post.reducer';
import { setFileData } from 'react-jhipster';
import moment, { Moment } from 'moment';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@jgrayfibersmith/ckeditor5-build-classic-full-with-base64-upload';
import { RouteComponentProps } from 'react-router-dom';
import { convertDateTimeFromServer } from 'app/shared/util/date-utils';
import { showHeader } from 'app/shared/reducers/header';

export interface IPostEditorProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export interface IPostEditorState {
  isNew: boolean;
  title: string;
  text: string;
  published: boolean;
  date: Moment;
  saving: boolean;
}

export class PostEditor extends React.Component<IPostEditorProps, IPostEditorState> {
  editor = React.createRef<CKEditor>();

  constructor(props) {
    super(props);
    this.state = {
      isNew: !this.props.match.params || !this.props.match.params.id,
      title: '',
      text: '',
      date: moment(),
      published: false,
      saving: false
    };
  }

  componentDidMount() {
    this.props.showHeader();
    if (this.state.isNew) {
      this.props.reset();
    } else {
      this.props.getBlogPost(this.props.match.params.id);
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.updateSuccess !== this.props.updateSuccess && nextProps.updateSuccess) {
      this.handleClose();
    }
  }

  componentDidUpdate(prevProps: Readonly<IPostEditorProps>, prevState: Readonly<IPostEditorState>) {
    if (
      prevProps.blogPostEntity.id !== this.props.blogPostEntity.id ||
      (!this.state.isNew && this.state.published === false && this.state.title === '' && this.state.text === '')
    ) {
      this.setState({
        ...this.state,
        title: this.props.blogPostEntity.previewTitle,
        text: this.props.blogPostEntity.previewText,
        date: this.props.blogPostEntity.postDate,
        published: this.props.blogPostEntity.published
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

  onTextChange = event => {
    this.setState({
      ...this.state,
      text: event.target.value
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
    const { blogPostEntity } = this.props;
    if (this.state.isNew) {
      this.props.createBlogPost({
        ...blogPostEntity,
        previewTitle: this.state.title,
        previewText: this.state.text,
        postDate: this.state.date,
        published: this.state.published,
        content: `${editorData}`
      });
    } else {
      this.props.updateBlogPost({
        ...blogPostEntity,
        previewTitle: this.state.title,
        previewText: this.state.text,
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
    this.props.history.goBack();
  };

  render() {
    const { loading, blogPostEntity } = this.props;
    const { isNew } = this.state;

    return loading ? (
      <Dimmer active page>
        <Loader />
      </Dimmer>
    ) : (
      <div className="blog-editor-page">
        <h1 style={{ fontFamily: 'BPnoScriptBold', textAlign: 'center' }}>Create/Edit a Blog Post</h1>
        <span style={{ fontFamily: 'BPnoScript' }}>Add a Preview Title...</span>
        <br />
        <br />
        <Input
          id="blog-post-previewTitle"
          type="textarea"
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
        <span style={{ fontFamily: 'BPnoScript' }}>Add a Preview Text...</span>
        <br />
        <br />
        <Input
          id="blog-post-previewTitle"
          type="textarea"
          name="previewText"
          size="large"
          value={this.state.text}
          onChange={this.onTextChange}
          style={{
            width: '50%'
          }}
        />
        <br />
        <br />
        <span style={{ fontFamily: 'BPnoScript' }}>Add Post Date...</span>
        <br />
        <br />
        <Input
          id="blog-post-postDate"
          type="date"
          name="postDate"
          onChange={this.onDateChange}
          value={convertDateTimeFromServer(this.state.date)}
        />
        <br />
        <br />
        <span style={{ fontFamily: 'BPnoScript' }}>Add a Preview Image...</span>
        <br />
        <br />
        {blogPostEntity && blogPostEntity.previewImage ? (
          <Grid style={{ width: '30vw' }}>
            <Grid.Row columns={2}>
              <Grid.Column>
                <Image
                  src={`data:${blogPostEntity.previewImageContentType};base64,${blogPostEntity.previewImage}`}
                  style={{ maxHeight: '200px' }}
                />
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
        <span style={{ fontFamily: 'BPnoScript' }}>Check if post should be published...</span>{' '}
        <input type="checkbox" name="published" checked={this.state.published} onChange={this.changePublish} />
        <br />
        <br />
        <span style={{ fontFamily: 'BPnoScript' }}>Create post below...</span>
        <div className="blog-editor-container">
          <CKEditor editor={ClassicEditor} data={!isNew ? blogPostEntity.content : null} ref={this.editor} />
        </div>
        <Button
          content="Save post"
          primary
          onClick={this.save}
          loading={this.state.saving}
          style={{ fontFamily: 'BPnoScript', float: 'right', margin: '1em 0 0 1em' }}
        />
      </div>
    );
  }
}

const mapStateToProps = (storeState: IRootState) => ({
  blogPostEntity: storeState.blogPost.entity,
  updateSuccess: storeState.blogPost.updateSuccess,
  loading: storeState.blogPost.loading,
  errorMessage: storeState.blogPost.errorMessage
});

const mapDispatchToProps = {
  showHeader,
  setBlob,
  reset,
  createBlogPost,
  getBlogPost,
  updateBlogPost
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PostEditor);
