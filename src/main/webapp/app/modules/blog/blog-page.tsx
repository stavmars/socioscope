/* tslint:disable:max-line-length */
import './blog.scss';

import React from 'react';
import { Button, Container, Grid, Icon, Image, Menu } from 'semantic-ui-react';

const sixDogs = () => (
  <div>
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
        , προσφέρει δεδομένα <b>ανοικτά</b> στο ευρύ κοινό από έρευνες σε ποικίλους τομείς της <b>κοινωνικής</b> και <b>πολιτικής</b> ζωής
        της Ελλάδας
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

const pressRelease = () => (
  <div>
    <h1 className="blog-page-title">Δελτίο Τύπου Παρουσίασης του Socioscope.gr</h1>
    <Container text className="blog-page-description">
      <p>
        Μια συνάντηση με αγαπητούς καλεσμένους, την οποία διοργάνωσε το{' '}
        <a href="https://www.ekke.gr" target="_blank">
          Εθνικό Κέντρο Κοινωνικών Ερευνών
        </a>
        (ΕΚΚΕ) στις 19 Νοεμβρίου στο six d.o.g.s στην Αθήνα. Καλεσμένοι από το χώρο της δημοσιογραφίας, της ακαδημαϊκής κοινότητας και των
        εποπτευόμενων φορέων του
        <b> ΕΚΚΕ</b> είχαν την ευκαιρία να περιηγηθούν στα δεδομένα του <b>Socioscope.gr</b>, να δουν τις λειτουργίες της πλατφόρμας, να την
        εξερευνήσουν, να λύσουν απορίες και να έχουν πλέον στα χέρια τους ένα δυνατό εργαλείο.
      </p>
      <p>
        Ο πρόεδρος του Δ.Σ. του <b>ΕΚΚΕ</b>, καθ. Νίκος Δεμερτζής, κατά την εναρκτήρια ομιλία του αναφέρθηκε στον καινοτόμο χαρακτήρα του
        έργου, με έμφαση στη σημασία των τεκμηριωμένων δεδομένων και την αξία της διεπιστημονικότητας κατά τη μελέτη κοινωνικών
        αλληλεπιδράσεων.
      </p>
      <p>
        Και από τη θεωρία... περάσαμε στην πράξη! Οι Ερευνήτριες του Ινστιτούτου Κοινωνικών Ερευνών του <b>ΕΚΚΕ</b> και επιστημονικές
        υπεύθυνες των θεματικών που παρουσιάστηκαν, Δρ. Μανίνα Κακεπάκη και Δρ. Κατερίνα Ηλιού μας “σύστησαν” αρχικά τη μοναδική απογραφική
        βάση όλων των βουλευτών/-τριών που εκλέχθηκαν στο Ελληνικό Κοινοβούλιο (1989-2019) και φιλοξενείται στο <b>Socioscope.gr</b>. Στη
        συνέχεια παρουσίασαν αποτελέσματα από τη θεματική του <b>Socioscope.gr</b> για το προφίλ και τις αξίες των εφήβων με δεδομένα
        έρευνας πεδίου που πραγματοποιήθηκε το 2018 σε 4 σχολικές μονάδες της Αττικής.
      </p>
      <p>
        Για όλα τα παραπάνω, ο επιστημονικός συνεργάτης του έργου Δρ.Κωστής Πιερίδης μας παρουσίασε διαδραστικά και με παραδείγματα πώς
        μπορούμε να αντλούμε τα δεδομένα που μας ενδιαφέρουν, να κατανοούμε τις απεικονίσεις και να τις “μεταφράζουμε” έτσι ώστε να
        εμπλουτίζουμε το ρεπορτάζ μας.
      </p>
      <p>
        Η συνάντηση έκλεισε με ένα σύντομο χαιρετισμό από τους λοιπούς συνεργάτες. Τον Δρ. Γιώργο Παπαστεφανάτο, επιστημονικό συνεργάτη του
        Ινστιτούτου Πληροφοριακών Συστημάτων του{' '}
        <a href="https://www.athena-innovation.gr/" target="_blank">
          Ε.Κ ΑΘΗΝΑ
        </a>{' '}
        και τον Λεωνίδα Οικονόμου από τη{' '}
        <a href="https://www.roleplay.gr/" target="_blank">
          Roleplay
        </a>
        .
      </p>
      <p>
        Κλείνοντας, η υπεύθυνη επικοινωνίας και διάχυσης του έργου Ειρήνη Κυριαζοπούλου, έκανε μια σύντομη παρουσίαση της έρευνας που
        ετοιμάζει η ίδια ομάδα του <b>ΕΚΚΕ</b> και αφορά στους νέους/-ες από 17-29 ετών στην Ελλάδα. Πραγματοποιήθηκε μάλιστα, η πρώτη
        επίσημη προβολή του promotion video που ετοιμάστηκε για τους σκοπούς αυτούς.
      </p>
      <p>
        Ευχαριστούμε όσους / -ες μας τίμησαν με την παρουσία τους και με χαρά συνεχίζουμε να παρέχουμε συνεχή υποστήριξη στο έργο όσων
        αξιοποιούν το <b>Socioscope.gr</b> .
      </p>
      <Image src="/content/images/Assets/ekke-president.jpg" />
      <p>
        Ο πρόεδρος του Δ.Σ. του <b>ΕΚΚΕ</b>, καθ. Νίκος Δεμερτζής αναφέρθηκε μεταξύ άλλων στη σημασία των τεκμηριωμένων δεδομένων σήμερα και
        την αξία της διεπιστημονικότητας κατά τη μελέτη κοινωνικών αλληλεπιδράσεων.
      </p>
      <Image src="/content/images/Assets/iliou-start.jpg" />
      <p>
        Η Δρ. Κατερίνα Ηλιού, εισάγει το κοινό στην πλατφόρμα του <b>Socioscope.gr</b> δίνοντας έμφαση στα κοινωνικά δεδομένα που φιλοξενεί.
      </p>
      <Image src="/content/images/Assets/kakepaki-politics.jpg" />
      <p>
        Η Δρ. Μανίνα Κακεπάκη ζητά από το κοινό να "ψηφίσει" σε μια σειρά από Polls που πραγματοποίησε με δεδομένα που αφορούν στην
        Κοινοβουλευτική Εκπροσώπηση της Ελλάδας από το 1989 έως και το 2019.
      </p>
      <Image src="/content/images/Assets/pierides-step.jpg" />
      <p>
        Ο Δρ. Κωστής Πιερίδης, ξεναγεί το κοινό βήμα - βήμα στην πλατφόρμα του <b>Socioscope.gr</b>, αναλύοντας πολιτικά δεδομένα από
        διαφορετικές Κοινοβουλευτικές περιόδους.
      </p>
      <p>
        <b>Υ.Γ.</b> Facts are stubborn, but statistics are more pliable -Mark Twain .
      </p>
      <p>Ας μιλήσουμε για δεδομένα στο...</p>
      <p>
        <a href="https://www.facebook.com/socioscope/" target="_blank">
          Facebook
        </a>
      </p>
    </Container>
  </div>
);

export interface IBlogPageProps {
  page: string;
}

export class BlogPage extends React.Component<IBlogPageProps> {
  render() {
    let blogPage;
    switch (this.props.page) {
      case 'six-dogs-event':
        blogPage = sixDogs();
        break;
      case 'press-release':
        blogPage = pressRelease();
        break;
      default:
        blogPage = '';
        break;
    }

    return <div className="blog-page">{blogPage}</div>;
  }
}

export default BlogPage;
