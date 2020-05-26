/* tslint:disable:jsx-no-lambda */
import './news-editor.scss';
import React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { IRootState } from 'app/shared/reducers';
import { getEntity, reset } from 'app/entities/news-post/news-post.reducer';
import { Dimmer, Loader, Container } from 'semantic-ui-react';
import { defaultValue } from 'app/shared/model/news-post.model';

export interface INewsDisplayProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export class NewsDisplay extends React.Component<INewsDisplayProps> {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
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
    const { newsPost, loading, errorMessage } = this.props;

    return loading || newsPost === defaultValue ? (
      <Dimmer active page>
        <Loader />
      </Dimmer>
    ) : errorMessage === null ? (
      <div className="news-display-page">
        <Container>
          <div className="ck-content" dangerouslySetInnerHTML={{ __html: this.handleEmbedTags(newsPost.content) }} />
        </Container>
      </div>
    ) : (
      <div className="news-display-page">{errorMessage}</div>
    );
  }
}

const mapStateToProps = (storeState: IRootState) => ({
  newsPost: storeState.newsPost.entity,
  loading: storeState.newsPost.loading,
  errorMessage: storeState.newsPost.errorMessage
});

const mapDispatchToProps = {
  getEntity,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewsDisplay);
