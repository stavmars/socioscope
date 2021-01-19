/* tslint:disable:jsx-no-lambda */
import './blog.scss';

import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Button, Dimmer, Grid, Image, Loader, Modal } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
import { IRootState } from 'app/shared/reducers';
import { deleteEntity, getEntities } from 'app/entities/blog-post/blog-post.reducer';
import moment from 'moment';
import { Translate } from 'react-jhipster';

export interface IBlogFeedProps extends StateProps, DispatchProps {}

export interface IBlogFeedState {
  deleteModal: boolean;
}

export class BlogFeed extends React.Component<IBlogFeedProps, IBlogFeedState> {
  constructor(props) {
    super(props);
    this.state = {
      deleteModal: false
    };
  }

  componentDidMount() {
    this.props.getEntities();
  }

  confirmDelete = id => {
    this.props.deleteEntity(id);
    this.setState({ deleteModal: false });
  };

  render() {
    const { isAuthenticated, loading, blogPosts } = this.props;

    return loading ? (
      <Dimmer active page>
        <Loader />
      </Dimmer>
    ) : (
      <div className="blog-feed">
        <h1 className="title">Blog</h1>
        <Grid centered>
          {isAuthenticated && (
            <Grid>
              <Grid.Row>
                <Grid.Column>
                  <Button content="Create Post" as={NavLink} to="/post-editor/new" style={{ backgroundColor: 'white', color: '#401b00' }} />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          )}
          {_.orderBy(blogPosts, post => moment(post.postDate), ['desc']).map(
            blogPost =>
              (isAuthenticated || blogPost.published) && (
                <Grid.Row key={blogPost.id} className="blog-feed-item" columns={isAuthenticated ? 3 : 2}>
                  <Grid.Column textAlign="center" computer={3} mobile={14}>
                    {blogPost.previewImage ? (
                      <Image
                        size="medium"
                        className="blog-feed-item-image"
                        src={`data:${blogPost.previewImageContentType};base64,${blogPost.previewImage}`}
                      />
                    ) : (
                      <Image size="medium" className="blog-feed-item-image" src="/content/images/Logo-white.svg" />
                    )}
                  </Grid.Column>
                  <Grid.Column computer={6} mobile={14}>
                    <NavLink to={`/post-display/${blogPost.id}`}>
                      <h2 className="blog-feed-item-title">{blogPost.previewTitle}</h2>
                    </NavLink>
                    <div className="blog-feed-item-subtitle">{moment(blogPost.postDate).format('DD.MM.YYYY')}</div>
                    <p className="blog-feed-item-text">{blogPost.previewText}</p>
                    <Button className="blog-feed-item-button" as={NavLink} to={`/post-display/${blogPost.id}`}>
                      ΠΕΡΙΣΣΟΤΕΡΑ
                    </Button>
                  </Grid.Column>
                  {isAuthenticated && (
                    <Grid.Column only="computer" verticalAlign="middle" computer={1}>
                      <Button
                        icon="edit"
                        as={NavLink}
                        to={`/post-editor/${blogPost.id}/edit`}
                        style={{ backgroundColor: '#777eff', color: 'white' }}
                      />
                      <br />
                      <br />
                      <Modal
                        open={this.state.deleteModal}
                        onClose={() => this.setState({ deleteModal: false })}
                        onOpen={() => this.setState({ deleteModal: true })}
                        trigger={<Button icon="delete" style={{ backgroundColor: '#ff6666', color: 'white' }} />}
                      >
                        <Modal.Header>
                          <Translate contentKey="entity.delete.title">Confirm delete operation</Translate>
                        </Modal.Header>
                        <Modal.Content id="socioscopeApp.blogPost.delete.question">
                          <Translate contentKey="socioscopeApp.blogPost.delete.question" interpolate={{ id: blogPost.id }}>
                            Are you sure you want to delete this BlogPost?
                          </Translate>
                        </Modal.Content>
                        <Modal.Actions>
                          <Button onClick={() => this.setState({ deleteModal: false })}>
                            <Translate contentKey="entity.action.cancel">Cancel</Translate>
                          </Button>
                          <Button id="jhi-confirm-delete-blogPost" color="red" onClick={() => this.confirmDelete(blogPost.id)}>
                            <Translate contentKey="entity.action.delete">Delete</Translate>
                          </Button>
                        </Modal.Actions>
                      </Modal>
                    </Grid.Column>
                  )}
                </Grid.Row>
              )
          )}
          {/* Six D.O.G.S Event */}
          <Grid.Row className="blog-feed-item">
            <Grid.Column textAlign="center" computer={3} mobile={14}>
              <Image
                centered
                as={NavLink}
                to="/blog/six-dogs-event"
                size="medium"
                className="blog-feed-item-image"
                src="/content/images/Assets/six-dogs-event-invitation.jpg"
              />
            </Grid.Column>
            <Grid.Column computer={6} mobile={14}>
              <NavLink to="/blog/six-dogs-event">
                <h2 className="blog-feed-item-title">Ένα εργαλείο για Δημοσιογράφους: Παρουσίαση του Socioscope.gr</h2>
              </NavLink>
              <div className="blog-feed-item-subtitle">Τρίτη 19 Νοεμβρίου 2019</div>
              <p className="blog-feed-item-text">
                Σήμερα όπου η ανάγκη για τεκμηριωμένα δεδομένα είναι πιο επιτακτική από ποτέ το του Εθνικού Κέντρου Κοινωνικών Ερευνών
                προσφέρει δεδομένα ανοικτά στο ευρύ κοινό από έρευνες σε ποικίλους τομείς της κοινωνικής και πολιτικής ζωής της Ελλάδας
              </p>
              <Button className="blog-feed-item-button" as={NavLink} to="/blog/six-dogs-event">
                ΠΕΡΙΣΣΟΤΕΡΑ
              </Button>
            </Grid.Column>
          </Grid.Row>
          {/* Press Release */}
          <Grid.Row className="blog-feed-item">
            <Grid.Column textAlign="center" computer={3} mobile={14}>
              <Image
                centered
                as={NavLink}
                to="/blog/press-release"
                size="medium"
                className="blog-feed-item-image"
                src="/content/images/Assets/ekke-president.jpg"
              />
            </Grid.Column>
            <Grid.Column computer={6} mobile={14}>
              <NavLink to="/blog/six-dogs-event">
                <h2 className="blog-feed-item-title">Δελτίο Τύπου Παρουσίασης του Socioscope.gr</h2>
              </NavLink>
              <div className="blog-feed-item-subtitle">Παρασκευή 22 Νοεμβρίου 2019</div>
              <p className="blog-feed-item-text">
                Socioscope σημαίνει... έρευνα, δεδομένα, τεκμηριωμένες πληροφορίες και πολλά περισσότερα, τα οποία εξερεύνησαν όσοι και όσες
                παρευρέθηκαν στην πρώτη επίσημη διαδραστική παρουσίασή του.
              </p>
              <Button className="blog-feed-item-button" as={NavLink} to="/blog/press-release">
                ΠΕΡΙΣΣΟΤΕΡΑ
              </Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = (storeState: IRootState) => ({
  isAuthenticated: storeState.authentication.isAuthenticated,
  blogPosts: storeState.blogPost.entities,
  loading: storeState.blogPost.loading
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
