import './blog.scss';

import React from 'react';
import { connect } from 'react-redux';
import { getSession } from 'app/shared/reducers/authentication';
import { showHeader } from 'app/shared/reducers/header';
import { Button, Grid, Image } from 'semantic-ui-react';
import { Link, NavLink } from 'react-router-dom';

export class BlogFeed extends React.Component<DispatchProps> {
  componentDidMount() {
    this.props.showHeader();
  }

  render() {
    return (
      <div className="blog-feed">
        <h1 className="title">Blog</h1>
        <Grid centered>
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
        </Grid>
      </div>
    );
  }
}

const mapDispatchToProps = { getSession, showHeader };

type DispatchProps = typeof mapDispatchToProps;

export default connect(
  null,
  mapDispatchToProps
)(BlogFeed);
