import './blog.scss';

import React from 'react';
import { Button, Grid, Image } from 'semantic-ui-react';
import { Link, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';
import { deleteEntity, getEntities } from 'app/entities/news-post/news-post.reducer';
import moment from 'moment';
import _ from 'lodash';

export interface IBlogFeedProps extends StateProps, DispatchProps {}

export class BlogFeed extends React.Component<IBlogFeedProps> {
  componentDidMount() {
    this.props.getEntities();
  }

  render() {
    const { isAuthenticated, loading, newsPosts } = this.props;

    return (
      <div className="blog-feed">
        <h1 className="title">
          Blog
          <br />
          {isAuthenticated && (
            <Button
              content="Create Blog Post"
              as={NavLink}
              to="/blog/editor/new"
              style={{ backgroundColor: 'white', fontFamily: 'ProximaNovaBold' }}
            />
          )}
        </h1>
        {loading ? (
          <div />
        ) : (
          <Grid centered style={{ marginBottom: '50px' }}>
            {_.orderBy(newsPosts, post => moment(post.postDate), ['desc']).map(
              newsPost =>
                (isAuthenticated || newsPost.published) && (
                  <Grid.Row key={newsPost.id} className="blog-feed-item" columns={isAuthenticated ? 3 : 2}>
                    <Grid.Column computer={3} mobile={14}>
                      {newsPost.previewImage ? (
                        <Image src={`data:${newsPost.previewImageContentType};base64,${newsPost.previewImage}`} size="medium" />
                      ) : (
                        <Image className="news-page-image" src="content/images/HeaderLogo.png" />
                      )}
                    </Grid.Column>
                    <Grid.Column computer={6} mobile={14} verticalAlign="middle">
                      <h2 className="blog-feed-item-title">{newsPost.previewTitle}</h2>
                      <div className="blog-feed-item-subtitle">{moment(newsPost.postDate).format('DD.MM.YYYY')}</div>
                      <p className="blog-feed-item-text">{newsPost.previewSubtitle}</p>
                      <Button className="news-page-more-button" floated="right" as={NavLink} to={`/blog/display/${newsPost.id}`}>
                        Περισσότερα
                      </Button>
                    </Grid.Column>
                    {isAuthenticated && (
                      <Grid.Column only="computer" verticalAlign="middle" computer={1}>
                        <Button
                          icon="edit"
                          as={NavLink}
                          to={`/blog/editor/${newsPost.id}/edit`}
                          style={{ backgroundColor: '#777eff', color: 'white' }}
                        />
                        <br />
                        <br />
                        <Button
                          icon="delete"
                          as={NavLink}
                          to={`/entity/news-post/${newsPost.id}/delete`}
                          style={{ backgroundColor: '#ff6666', color: 'white' }}
                        />
                      </Grid.Column>
                    )}
                  </Grid.Row>
                )
            )}
          </Grid>
        )}
      </div>
    );
  }
}

const mapStateToProps = (storeState: IRootState) => ({
  isAuthenticated: storeState.authentication.isAuthenticated,
  newsPosts: storeState.newsPost.entities,
  loading: storeState.newsPost.loading
});

const mapDispatchToProps = {
  getEntities,
  deleteEntity
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BlogFeed);
