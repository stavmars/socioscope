/* tslint:disable:jsx-no-lambda */
import './post-editor.scss';
import React from 'react';
import { connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';
import { Button, Dimmer, Loader, Grid, Image, Form, Container } from 'semantic-ui-react';
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
import { showHeader } from 'app/shared/reducers/header';
import greekUtils from 'greek-utils';

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
        id: greekUtils
          .toGreeklish(this.state.title)
          .toLowerCase()
          .replace(/ /g, '_')
          .replace(/[^a-zA-Z0-9-_]/g, ''),
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
      <Form className="blog-editor-page" onSubmit={this.save}>
        <h1 style={{ fontFamily: 'BPnoScriptBold', textAlign: 'center' }}>Create/Edit a Blog Post</h1>
        <Container>
          <Form.Input
            id="blog-post-previewTitle"
            type="textarea"
            name="previewTitle"
            label="Add a Preview Title..."
            value={this.state.title}
            onChange={this.onTitleChange}
            required
          />
          <Form.Input
            id="blog-post-previewTitle"
            type="textarea"
            name="previewText"
            label="Add a Preview Text..."
            size="large"
            value={this.state.text}
            onChange={this.onTextChange}
            required
          />
          <Form.Input
            id="blog-post-postDate"
            type="date"
            name="postDate"
            label="Add Post Date..."
            onChange={this.onDateChange}
            value={moment(this.state.date).format('YYYY-MM-DD')}
            required
          />
          <Form.Input
            id="file_previewImage"
            label="Add a Preview Image..."
            type="file"
            onChange={this.onBlobChange(true, 'previewImage')}
            accept="image/*"
          />
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
          <Form.Checkbox
            type="checkbox"
            name="published"
            label="Check if post should be published..."
            checked={this.state.published}
            onChange={this.changePublish}
          />
        </Container>
        <br />
        <br />
        <div className="blog-editor-container">
          <CKEditor
            editor={ClassicEditor}
            data={!isNew ? blogPostEntity.content : '<h1 style="text-align: center">Remove this heading and start writing</h1>'}
            ref={this.editor}
          />
        </div>
        <Button
          content="Save post"
          primary
          type="submit"
          loading={this.state.saving}
          style={{ fontFamily: 'BPnoScript', float: 'right', margin: '1em 0 0 1em' }}
        />
      </Form>
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
