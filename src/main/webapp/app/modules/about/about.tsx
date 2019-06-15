import './about.scss';

import React from 'react';
import { connect } from 'react-redux';
import { Row, Col, Alert } from 'reactstrap';
import { HashLink } from 'react-router-hash-link';

import { IRootState } from 'app/shared/reducers';
import { getSession } from 'app/shared/reducers/authentication';

export interface IAbooutProp extends StateProps, DispatchProps {}

export class About extends React.Component<IAbooutProp> {
  componentDidMount() {
    this.props.getSession();
  }

  render() {
    return (
      <div className="about">
        <a id="/about" />
        <Row>
          <Col sm="12" md={{ size: 6, offset: 4 }} className="title">
            Καλειδοσκόπιο κοινωνικών δεδομένων
          </Col>
        </Row>
        <Row>
          <Col xs="3" md={{ offset: 1 }} className="bullets">
            <ul>
              <li>
                <HashLink to="/about" replace={false} style={{ textDecorationColor: 'red', color: '#1e1e1e' }}>
                  Το έργο
                </HashLink>
              </li>
              <li>
                <HashLink to="/about#team" replace={false} style={{ textDecorationColor: 'red', color: '#1e1e1e' }}>
                  Επιστημονική Ομάδα
                </HashLink>
              </li>
              <li>
                <HashLink to="/about#sources" replace={false} style={{ textDecorationColor: 'red', color: '#1e1e1e' }}>
                  Πηγές
                </HashLink>
              </li>
              <li>
                <HashLink to="/about#techTeam" replace={false} style={{ textDecorationColor: 'red', color: '#1e1e1e' }}>
                  Τεχνικοί Υπεύθυνοι
                </HashLink>
              </li>
              <li>Developers</li>
            </ul>
          </Col>
          <Col className="content">
            Το Καλειδοσκόπιο Κοινωνικών Δεδομένων αναπτύχθηκε στα πλαίσια του έργου «Δυναμική Διαχείριση Βάσεων Κοινωνικών Δεδομένων και
            Χαρτογραφικών Αναπαραστάσεων» της πρόσκλησης «ΚΡΗΠΙΣ» της ΓΓΕΤ (2013-2015) μεταξύ του
            <span style={{ fontStyle: 'normal', fontFamily: 'ProximaNovaBold', color: '#FF5D39' }}>
              {' '}
              Εθνικού Κέντρου Κοινωνικών Ερευνών{' '}
            </span>
            και του
            <span style={{ fontStyle: 'normal', fontFamily: 'ProximaNovaBold', color: '#FF5D39' }}>
              {' '}
              Ινστιτούτου Πληροφοριακών Συστημάτων του Ερευνητικού Κέντρου «ΑΘΗΝΑ».{' '}
            </span>
            Αποτελεί πλατφόρμα οπτικής ανάλυσης και χαρτογραφικής αναπαράστασης κοινωνικών και πολιτικών δεδομένων με στόχο την υποστήριξη
            και ενίσχυση της κοινωνικής έρευνας και τη διάθεση ανοιχτών κοινωνικών δεδομένων στο ευρύ κοινό. Τα στοιχεία είναι
            κατηγοριοποιημένα γύρω από θεματικές περιοχές και διατίθενται ανοιχτά προς χρήση με άδεια
            <span style={{ fontStyle: 'normal', fontFamily: 'ProximaNovaBold', color: '#FF5D39' }}>
              {' '}
              {'http://creativecommons.org/licenses/by/4.0/'}.
            </span>
            <br />
            <br />
            <br />
            <br />
            <h2>
              <a id="team" />
              Επιστημονική ομάδα
            </h2>
            <span style={{ fontFamily: 'ProximaNovaBold' }}>Θεώνη Σταθοπούλου</span> / Διευθύντρια Ερευνών, ΕΚΚΕ, theosta@ekke.gr
            <br />
            <br />
            <span style={{ fontFamily: 'ProximaNovaBold' }}>Ιωάννα Τσίγγανου</span> / Διευθύντρια Ερευνών, ΕΚΚΕ, jtsiganou@ekke.gr
            <br />
            <br />
            <span style={{ fontFamily: 'ProximaNovaBold' }}>Γιώργος Κανδύλης</span> / Ερευνητής, gkandyli@ekke.gr
            <br />
            <br />
            <span style={{ fontFamily: 'ProximaNovaBold' }}>Μανίνα Κακεπάκη</span> / Ερευνήτρια, ΕΚΚΕ, mkakepaki@ekke.gr
            <br />
            <br />
            <br />
            <h2>
              <a id="sources" />
              Πηγές
            </h2>
            <h3>Εκδόσεις:</h3>
            <br />
            <br />
            <br />
            Έλληνες Βουλευτές και Ευρωβουλευτές: Εθνικές Εκλογές 22/9/1996, Ευρωεκλογές 12/6/1994. Αθήνα: Βουλή των Ελλήνων 1998.
            <br />
            <br />
            Έλληνες Βουλευτές και Ευρωβουλευτές: εθνικές εκλογές 9ης Απριλίου 2000, Ευρωεκλογές 13ης Ιουνίου 1999. Αθήνα: Βουλή των Ελλήνων
            2001, 2003.
            <br />
            <br />
            Έλληνες Βουλευτές και Ευρωβουλευτές: Εθνικές εκλογές 7ης Μαρτίου 2004-Ευρωεκλογές 13ης Ιουνίου 2004. Επτάλοφος: Βουλή των
            Ελλήνων 2005.
            <br />
            <br />
            Έλληνες Βουλευτές και Ευρωβουλευτές: Εθνικές εκλογές της 16ης Σεπτεμβρίου 2007 - Ευρωεκλογές της 7ης Ιουνίου 2008. Αθήνα, Βουλή
            των Ελλήνων 2009.
            <br />
            <br />
            Τζιοβάρας Γ. και Β. Χιώτης (2006) Ο Πολιτικός Χάρτης της Μεταπολίτευσης 1974-2004, Αθήνα Λιβάνης.
            <br />
            <br /> Μαλούτα, Μ. Μισός Αιώνας Γυναικείας Ψήφου. Μισός Αιώνας Γυναίκες στη Βουλή. Ίδρυμα της Βουλής των Ελλήνων, Αθήνα 2007
            <br />
            <br />
            Patrikios, S. and M. Chatzikonstantinou (2014) Dynastic Politics: Family Ties in the Greek Parliament, 2000–12, South European
            Society and Politics , Volume 20, Issue 1, pp. 93-111 [online appendix:
            <span>{'http://dx.doi.org/10.1080/13608746.2014.942989]'}</span>
            <br />
            <br />
            <h3>Ιστότοποι:</h3>
            <br />
            <br />
            <br />
            <span>{'http://www.ypes.gr/el/Elections/NationalElections/Results/'}</span>
            <br />
            <span>{'http://www.hellenicparliament.gr'}</span>
            <br />
            <br />
            <br />
            <br />
            <h2>
              <a id="techTeam" />
              Τεχνικοί Υπεύθυνοι
            </h2>
            <h3>Ανάλυση & Σχεδιασμός</h3>
            <span style={{ fontFamily: 'ProximaNovaBold' }}>Γιώργος Παπαστεφανάτος</span> / Ερευνητικός Συνεργάτης, Ε.Κ. ΑΘΗΝΑ),
            gpapas@imis.athena-innovation.gr
            <br />
            <br />
            <br />
            <h3>Ανάπτυξη Καλειδοσκοπίου</h3>
            <span style={{ fontFamily: 'ProximaNovaBold' }}>Σταύρος Μαρούλης</span> / Ερευνητικός Συνεργάτης, Ε.Κ. ΑΘΗΝΑ),
            stavmars@imis.athena-innovation.gr
          </Col>
          <Col xs="4" />
        </Row>
      </div>
    );
  }
}

const mapStateToProps = storeState => ({
  account: storeState.authentication.account,
  isAuthenticated: storeState.authentication.isAuthenticated
});

const mapDispatchToProps = { getSession };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(About);
