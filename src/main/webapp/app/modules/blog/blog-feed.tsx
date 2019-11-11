import './blog.scss';

import React from 'react';
import { connect } from 'react-redux';
import { getSession } from 'app/shared/reducers/authentication';
import { showHeader } from 'app/shared/reducers/header';
import { Button, Grid, Image } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

export class BlogFeed extends React.Component<DispatchProps> {
  componentDidMount() {
    this.props.getSession();
    this.props.showHeader();
  }

  render() {
    return (
      <div className="blog-feed">
        <h1 className="title">Blog</h1>
        <Grid centered>
          <Grid.Row className="blog-feed-item">
            <Grid.Column computer={3} mobile={14} verticalAlign="middle">
              <Image className="blog-feed-item-image" src="/content/images/Assets/74664662_590370811770654_338182250258497536_n.png" />
            </Grid.Column>
            <Grid.Column computer={5} mobile={14}>
              <h1 className="blog-feed-item-title">Πρόσκληση παρουσίασης του νέου Socioscope.gr</h1>
              <h3 className="blog-feed-item-subtitle">Τρίτη 19 Νοεμβρίου 2019</h3>
              <p className="blog-feed-item-text">
                Σήμερα όπου η ανάγκη για τεκμηριωμένα δεδομένα είναι πιο επιτακτική από ποτέ το του Εθνικού Κέντρου Κοινωνικών Ερευνών
                προσφέρει δεδομένα ανοικτά στο ευρύ κοινό από έρευνες σε ποικίλους τομείς της κοινωνικής και πολιτικής ζωής της Ελλάδας
              </p>
              <Button className="blog-feed-item-button" as={Link} to="/blog-page">
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
