import './about.scss';

import React from 'react';
import { connect } from 'react-redux';
import { Row, Col, Alert } from 'reactstrap';

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
        <Row>
          <h2>Καλειδοσκόπιο κοινωνικών δεδομένων</h2>
          <Col>
            <p className="bullets">
              <ul>
                <li>Το έργο</li>
                <li>Επιστημονική Ομάδα</li>
                <li>Πηγές</li>
                <li>Τεχνικοί Υπεύθυνοι</li>
                <li>Developers</li>
              </ul>
            </p>
          </Col>
          <Col>
            <p className="content">
              Το Καλειδοσκόπιο Κοινωνικών Δεδομένων αναπτύχθηκε στα πλαίσια του έργου «Δυναμική Διαχείριση Βάσεων Κοινωνικών Δεδομένων και
              Χαρτογραφικών Αναπαραστάσεων» της πρόσκλησης «ΚΡΗΠΙΣ» της ΓΓΕΤ (2013-2015) μεταξύ του Εθνικού Κέντρου Κοινωνικών Ερευνών και
              του Ινστιτούτου Πληροφοριακών Συστημάτων του Ερευνητικού Κέντρου «ΑΘΗΝΑ». Αποτελεί πλατφόρμα οπτικής ανάλυσης και
              χαρτογραφικής αναπαράστασης κοινωνικών και πολιτικών δεδομένων με στόχο την υποστήριξη και ενίσχυση της κοινωνικής έρευνας και
              τη διάθεση ανοιχτών κοινωνικών δεδομένων στο ευρύ κοινό. Τα στοιχεία είναι κατηγοριοποιημένα γύρω από θεματικές περιοχές και
              διατίθενται ανοιχτά προς χρήση με άδεια http://creativecommons.org/licenses/by/4.0/. Επιστημονική ομάδα Θεώνη Σταθοπούλου /
              Διευθύντρια Ερευνών, ΕΚΚΕ, theosta@ekke.gr Ιωάννα Τσίγγανου / Διευθύντρια Ερευνών, ΕΚΚΕ, jtsiganou@ekke.gr Γιώργος Κανδύλης /
              Ερευνητής, gkandyli@ekke.gr Μανίνα Κακεπάκη / Ερευνήτρια, ΕΚΚΕ, mkakepaki@ekke.gr Πηγές Εκδόσεις: Έλληνες Βουλευτές και
              Ευρωβουλευτές: Εθνικές Εκλογές 22/9/1996, Ευρωεκλογές 12/6/1994. Αθήνα: Βουλή των Ελλήνων 1998. Έλληνες Βουλευτές και
              Ευρωβουλευτές: εθνικές εκλογές 9ης Απριλίου 2000, Ευρωεκλογές 13ης Ιουνίου 1999. Αθήνα: Βουλή των Ελλήνων 2001, 2003. Έλληνες
              Βουλευτές και Ευρωβουλευτές: Εθνικές εκλογές 7ης Μαρτίου 2004-Ευρωεκλογές 13ης Ιουνίου 2004. Επτάλοφος: Βουλή των Ελλήνων
              2005. Έλληνες Βουλευτές και Ευρωβουλευτές: Εθνικές εκλογές της 16ης Σεπτεμβρίου 2007 - Ευρωεκλογές της 7ης Ιουνίου 2008.
              Αθήνα, Βουλή των Ελλήνων 2009. Τζιοβάρας Γ. και Β. Χιώτης (2006) Ο Πολιτικός Χάρτης της Μεταπολίτευσης 1974-2004, Αθήνα
              Λιβάνης. Παντελίδου Μαλούτα, Μ. Μισός Αιώνας Γυναικείας Ψήφου. Μισός Αιώνας Γυναίκες στη Βουλή. Ίδρυμα της Βουλής των Ελλήνων,
              Αθήνα 2007 Patrikios, S. and M. Chatzikonstantinou (2014) Dynastic Politics: Family Ties in the Greek Parliament, 2000–12,
              South European Society and Politics , Volume 20, Issue 1, pp. 93-111 [online appendix:
              http://dx.doi.org/10.1080/13608746.2014.942989] Ιστότοποι: http://www.ypes.gr/el/Elections/NationalElections/Results/
              http://www.hellenicparliament.gr Τεχνικοί Υπεύθυνοι Ανάλυση & Σχεδιασμός Γιώργος Παπαστεφανάτος / Ερευνητικός Συνεργάτης, Ε.Κ.
              ΑΘΗΝΑ), gpapas@imis.athena-innovation.gr Ανάπτυξη Καλειδοσκοπίου Σταύρος Μαρούλης / Ερευνητικός Συνεργάτης, Ε.Κ. ΑΘΗΝΑ),
              stavmars@imis.athena-innovation.gr
            </p>
          </Col>
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
