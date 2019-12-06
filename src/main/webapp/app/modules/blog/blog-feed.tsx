import './blog.scss';

import React from 'react';
import { Button, Grid, Image } from 'semantic-ui-react';
import { Link, NavLink } from 'react-router-dom';

export class BlogFeed extends React.Component {
  render() {
    return (
      <div className="blog-feed">
        <h1 className="title">Blog</h1>
        <Grid centered>
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

export default BlogFeed;
