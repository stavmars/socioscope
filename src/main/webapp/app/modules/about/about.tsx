import './about.scss';

import React, { createRef } from 'react';

import { connect } from 'react-redux';
import { getSession } from 'app/shared/reducers/authentication';
import { showHeader } from 'app/shared/reducers/header';
import { Grid, Header, Ref, Sticky } from 'semantic-ui-react';
import { NavHashLink } from 'react-router-hash-link';
import { translate } from 'react-jhipster';

export class About extends React.Component<DispatchProps> {
  contextRef = createRef();

  componentDidMount() {
    this.props.getSession();
    this.props.showHeader();
  }

  // only consider an event active if its event id is an odd number
  isActive = hash => (match, location) => {
    if (location.hash === hash) {
      return true;
    }
  };

  render() {
    return (
      <div className="about-page-view">
        <Header id="project" as="h1" className="about-page-title" content={translate('about.title')} textAlign="center" />
        <Ref innerRef={this.contextRef}>
          <Grid>
            <Grid.Row>
              <Grid.Column width={4} only="tablet computer">
                <Sticky context={this.contextRef} offset={110}>
                  <div className="about-page-menu">
                    <ul>
                      <li>
                        <NavHashLink isActive={this.isActive('#project')} smooth to="#project" replace={false}>
                          {translate('about.project')}
                        </NavHashLink>
                      </li>
                      <li>
                        <NavHashLink isActive={this.isActive('#team')} smooth to="#team" replace={false}>
                          {translate('about.team.title')}
                        </NavHashLink>
                      </li>
                      <li>
                        <NavHashLink isActive={this.isActive('#techTeam')} smooth to="#techTeam" replace={false}>
                          {translate('about.techTeam.title')}
                        </NavHashLink>
                      </li>
                    </ul>
                  </div>
                </Sticky>
              </Grid.Column>
              <Grid.Column computer={8} mobile={14}>
                <div className="about-page-content">
                  Το Καλειδοσκόπιο Κοινωνικών Δεδομένων αποτελεί συνεργασία μεταξύ του
                  <a
                    href="https://www.ekke.gr"
                    style={{ fontStyle: 'normal', fontFamily: 'ProximaNovaBold', color: '#FF5D39' }}
                    target="_blank"
                  >
                    {' '}
                    Εθνικού Κέντρου Κοινωνικών Ερευνών{' '}
                  </a>
                  και του
                  <a
                    href="https://www.athena-innovation.gr/el/imis_dm"
                    style={{ fontStyle: 'normal', fontFamily: 'ProximaNovaBold', color: '#FF5D39' }}
                    target="_blank"
                  >
                    {' '}
                    Ινστιτούτου Πληροφοριακών Συστημάτων του Ερευνητικού Κέντρου «ΑΘΗΝΑ».{' '}
                  </a>
                  Αναπτύχθηκε στα πλαίσια του έργου «Δυναμική Διαχείριση Βάσεων Κοινωνικών Δεδομένων και Χαρτογραφικών Αναπαραστάσεων» της
                  πρόσκλησης «ΚΡΗΠΙΣ» της ΓΓΕΤ (ΕΣΠΑ 2013-2015). Εμπλουτίστηκε και επανασχεδιάστηκε στα πλαίσια του έργου «Έρευνα,
                  Εκπαίδευση και Υποδομές: ο τριγωνισμός των αξόνων στρατηγικής ανάπτυξης του ΕΚΚΕ (REDI)», ΠΕ5: «Youth Print Web Platform
                  (YouWeP)» της ΓΓΕΤ (ΕΣΠΑ 2014-2020).
                  <br />
                  <br />
                  Αποτελεί πλατφόρμα οπτικής ανάλυσης και χαρτογραφικής αναπαράστασης κοινωνικών και πολιτικών δεδομένων με στόχο την
                  υποστήριξη και ενίσχυση της κοινωνικής έρευνας και τη διάθεση ανοιχτών κοινωνικών δεδομένων στο ευρύ κοινό. Τα στοιχεία
                  είναι κατηγοριοποιημένα γύρω από θεματικές περιοχές και διατίθενται ανοιχτά προς χρήση με άδεια
                  <a
                    href="http://creativecommons.org/licenses/by/4.0"
                    style={{ fontStyle: 'normal', fontFamily: 'ProximaNovaBold', color: '#FF5D39' }}
                    target="_blank"
                  >
                    {' '}
                    {'http://creativecommons.org/licenses/by/4.0/'}.
                  </a>
                  <br />
                  <br />
                  <br />
                  <br />
                  <h2 id="team">{translate('about.team.title')}</h2>
                  <span style={{ fontFamily: 'ProximaNovaBold' }}>{translate('about.team.theoni.name')}</span> /{' '}
                  {translate('about.team.theoni.role')}
                  <br />
                  <br />
                  <span style={{ fontFamily: 'ProximaNovaBold' }}>{translate('about.team.tsig.name')}</span> /{' '}
                  {translate('about.team.tsig.role')}
                  <br />
                  <br />
                  <span style={{ fontFamily: 'ProximaNovaBold' }}>{translate('about.team.kand.name')}</span> /{' '}
                  {translate('about.team.kand.role')}
                  <br />
                  <br />
                  <span style={{ fontFamily: 'ProximaNovaBold' }}>{translate('about.team.manina.name')}</span> /{' '}
                  {translate('about.team.manina.role')}
                  <br />
                  <br />
                  <br />
                  <h2 id="techTeam">{translate('about.techTeam.title')}</h2>
                  <h3>{translate('about.techTeam.analysis')}</h3>
                  <span style={{ fontFamily: 'ProximaNovaBold' }}>{translate('about.techTeam.gpapas.name')}</span> /{' '}
                  {translate('about.techTeam.gpapas.role')}
                  <br />
                  <br />
                  <br />
                  <h3>{translate('about.techTeam.develop')}</h3>
                  <span style={{ fontFamily: 'ProximaNovaBold' }}>{translate('about.techTeam.stav.name')}</span> /{' '}
                  {translate('about.techTeam.stav.role')}
                  <br />
                  <span style={{ fontFamily: 'ProximaNovaBold' }}>{translate('about.techTeam.astgian.name')}</span> /{' '}
                  {translate('about.techTeam.astgian.role')}
                </div>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Ref>
      </div>
    );
  }
}

const mapDispatchToProps = { getSession, showHeader };

type DispatchProps = typeof mapDispatchToProps;

export default connect(
  null,
  mapDispatchToProps
)(About);
