/* tslint:disable:jsx-no-lambda */
import './post-editor.scss';
import React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { IRootState } from 'app/shared/reducers';
import { getEntity, reset } from 'app/entities/blog-post/blog-post.reducer';
import { Dimmer, Loader, Container } from 'semantic-ui-react';
import { defaultValue } from 'app/shared/model/blog-post.model';
import { showHeader } from 'app/shared/reducers/header';

export interface IPostDisplayProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export class PostDisplay extends React.Component<IPostDisplayProps> {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.showHeader();
    this.props.getEntity(this.props.match.params.id);
  }

  handleEmbedTags = htmlContent => {
    const oembed = htmlContent.split('</oembed>');
    let body = '';
    oembed.forEach((item, index) => {
      body += oembed[index] + '</oembed>';
      const oembed1 = item.split('url="')[1];
      if (oembed1) {
        const oembed2 = oembed1.split('">')[0];
        if (oembed2) {
          const youtube = oembed2.split('https://www.youtube.com/watch?v=')[1];
          if (youtube) {
            body +=
              '<div class="iframe-container">' +
              '<iframe' +
              ` width="100%" height="${window.outerHeight * 0.5}px"` +
              ' src="https://youtube.com/embed/' +
              youtube +
              '" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"' +
              ' allowfullscreen></iframe></div>';
          }
        }
      }
    });
    return body;
  };

  render() {
    const { blogPost, loading, errorMessage } = this.props;

    return loading || blogPost === defaultValue ? (
      <Dimmer active page>
        <Loader />
      </Dimmer>
    ) : errorMessage === null ? (
      <div className="blog-display-page">
        <Container>
          <h1 style={{ fontFamily: 'BpNoScriptBold', textAlign: 'center' }}>{blogPost.previewTitle}</h1>
          <div className="ck-content" dangerouslySetInnerHTML={{ __html: this.handleEmbedTags(blogPost.content) }} />
        </Container>
      </div>
    ) : (
      <div className="blog-display-page">{errorMessage}</div>
    );
  }
}

const mapStateToProps = (storeState: IRootState) => ({
  blogPost: storeState.blogPost.entity,
  loading: storeState.blogPost.loading,
  errorMessage: storeState.blogPost.errorMessage
});

const mapDispatchToProps = {
  showHeader,
  getEntity,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PostDisplay);
