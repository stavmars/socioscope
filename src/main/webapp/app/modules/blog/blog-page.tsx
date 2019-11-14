/* tslint:disable:max-line-length */
import './blog.scss';

import React from 'react';
import { connect } from 'react-redux';
import { getSession } from 'app/shared/reducers/authentication';
import { showHeader } from 'app/shared/reducers/header';
import { Button, Container, Grid, Icon, Image, Menu } from 'semantic-ui-react';

export class BlogPage extends React.Component<DispatchProps> {
  componentDidMount() {
    this.props.showHeader();
  }

  render() {
    return (
      <div className="blog-page">
        <h1 className="blog-page-title">Πρόσκληση παρουσίασης του νέου Socioscope.gr</h1>
        <Grid centered padded className="blog-page-grid">
          <Grid.Row className="info-row">
            <Grid.Column className="blog-page-col-1">
              <Image className="blog-page-image" src="/content/images/Assets/Calendar.png" />
              Πότε;
            </Grid.Column>
            <Grid.Column computer={3} mobile={10} className="blog-page-answer" verticalAlign="middle">
              Τρίτη 19 Νοεμβρίου 2019
            </Grid.Column>
          </Grid.Row>
          <Grid.Row
            className="info-row"
            as="a"
            href="https://www.google.com/maps/place/six+d.o.g.s/@37.9774684,23.7268116,15z/data=!4m2!3m1!1s0x0:0x1064e7b168cee196?sa=X&ved=2ahUKEwjerP6JltjlAhUyxaYKHWNmAEoQ_BIwCnoECA8QCA"
            target="_blank"
          >
            <Grid.Column className="blog-page-col-1">
              <Image className="blog-page-image" src="/content/images/Assets/Pin.png" />
              Πού;
            </Grid.Column>
            <Grid.Column computer={3} mobile={10} className="blog-page-answer" verticalAlign="middle">
              six d.o.g.s (Στο Gig Space) Αβραμιώτου 6-8, Αθήνα 105 51
            </Grid.Column>
          </Grid.Row>
          <Grid.Row className="info-row">
            <Grid.Column className="blog-page-col-1">
              <Image className="blog-page-image" src="/content/images/Assets/Clock.png" />
              Ώρα;
            </Grid.Column>
            <Grid.Column computer={3} mobile={10} className="blog-page-answer" verticalAlign="middle">
              14:00 - 16:00
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Container text className="blog-page-description">
          <p>
            Σήμερα όπου η ανάγκη για τεκμηριωμένα δεδομένα είναι πιο επιτακτική από ποτέ, το <b>Socioscope.gr</b> του{' '}
            <a href="https://www.ekke.gr" target="_blank">
              Εθνικού Κέντρου Κοινωνικών Ερευνών
            </a>
            , προσφέρει δεδομένα <b>ανοικτά</b> στο ευρύ κοινό από έρευνες σε ποικίλους τομείς της <b>κοινωνικής</b> και <b>πολιτικής</b>{' '}
            ζωής της Ελλάδας
          </p>
          <p>Στην παρουσίαση μεταξύ άλλων θα μάθουμε:</p>
          <ul>
            <li>
              <b>πώς να αντλούμε τα δεδομένα</b> που μας ενδιαφέρουν
            </li>
            <li>
              <b>πώς να τα μεταφράζουμε</b> στα πλαίσια της αρθρογραφίας/έρευνας
            </li>
            <li>
              <b>πώς να εξάγουμε γραφήματα</b> έτοιμα προς δημοσίευση
            </li>
          </ul>
          <p>
            και όλα αυτά με μια ανοιχτή <b>συζήτηση</b> μεταξύ διοργανωτών και συμμετεχόντων.
          </p>
          <p>Σας περιμένουμε</p>
          <p>
            <b>Μανίνα Κακεπάκη</b> Ερευνήτρια ΙΚΕ-ΕΚΚΕ /{' '}
            <a href="mailto:mkakepaki@ekke.gr" target="_blank">
              mkakepaki@ekke.gr
            </a>
          </p>
          <p>
            <b>Κατερίνα Ηλιού</b> Ερευνήτρια ΙΚΕ-ΕΚΚΕ /{' '}
            <a href="mailto:kiliou@ekke.gr" target="_blank">
              kiliou@ekke.gr
            </a>
          </p>
          <Button
            className="blog-page-register"
            as="a"
            href="https://docs.google.com/forms/d/e/1FAIpQLScluDhIE8v956Kuvr0iGceLwSV4nvRUAEPc2ru60HKY6POIng/viewform"
            target="_blank"
          >
            Δηλώστε Συμμετοχή
          </Button>
          <Menu className="blog-page-contact" text borderless style={{ backgroundColor: 'transparent', borderStyle: 'none' }}>
            <Menu.Item as="a" href="https://www.facebook.com/socioscope/" target="_blank">
              <Icon name="facebook official" />
              Socioscope.gr
            </Menu.Item>
            <Menu.Item>
              <Icon name="text telephone" />
              210 7491613
            </Menu.Item>
          </Menu>
        </Container>
      </div>
    );
  }
}

const mapDispatchToProps = { getSession, showHeader };

type DispatchProps = typeof mapDispatchToProps;

export default connect(
  null,
  mapDispatchToProps
)(BlogPage);
