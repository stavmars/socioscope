import './home.scss';

import React from 'react';
import { HashLink } from 'react-router-hash-link';
import { connect } from 'react-redux';
import { getSession } from 'app/shared/reducers/authentication';
import { hideHeader, showHeader } from 'app/shared/reducers/header';

import { Container, Header, Visibility } from 'semantic-ui-react';
import AppHeader from 'app/shared/layout/header/header';
import CardCarousel from 'app/modules/home/card-carousel';
import DatasetCard from 'app/modules/home/dataset-card';

export interface IHomeProp extends StateProps, DispatchProps {}

export class Home extends React.Component<IHomeProp> {
  componentDidMount() {
    this.props.getSession();
  }

  render() {
    return (
      <div className="home-page-view">
        <Visibility once={false} onOffScreen={this.props.showHeader} onOnScreen={this.props.hideHeader}>
          <div style={{ marginBottom: 40 }}>
            <AppHeader className="home-page-header" isFixed={false} />
            <Container textAlign="center">
              <Header
                as="h1"
                content="Ανοικτά κοινωνικά Δεδομένα"
                style={{
                  fontFamily: 'BPnoScriptBold',
                  color: '#ffffff',
                  fontSize: '80px',
                  marginBottom: 0,
                  marginTop: '3em'
                }}
              />
              <Header
                as="h2"
                content="Το socioscope είναι μια πλατφόρμα οπτικοποίησης κοινωνικών και πολιτικών δεδομένων. Εξερευνήστε τις θεματικές και
                    διαμορφώστε τα δικά σας διαγράμματα, πίνακες και χάρτες."
                style={{
                  fontFamily: 'ProximaNovaSemibold',
                  fontSize: '20px',
                  color: '#ffffff',
                  marginTop: '31px',
                  maxWidth: '672px',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  marginBottom: '111px'
                }}
              />
              <HashLink
                to="#discover"
                replace={false}
                style={{
                  fontFamily: 'BPnoScriptBold',
                  fontSize: '30px',
                  color: '#ffffff',
                  borderBottom: '4px solid #FF5D39'
                }}
              >
                ΕΞΕΡΕΥΝΗΣΤΕ
              </HashLink>
            </Container>
          </div>
        </Visibility>
        <div id="discover" style={{ height: 120 }} />
        <div className="dataset-cards">
          <CardCarousel>
            <DatasetCard
              title="Εκλογικά Αποτελέσματα (1996 – 2015)"
              colorScheme="color-scheme-1"
              headerImg="/content/images/Assets/Elections.svg"
            >
              <span>
                2009-2015 » Το ΠΑΣΟΚ καταγράφει την μεγαλύτερη εκλογικά{' '}
                <span className="text-accent">ελεύθερη πτώση κόμματος της Μεταπολίτευσης</span>.
              </span>
            </DatasetCard>
            <DatasetCard
              title="Εκλογικά Αποτελέσματα (1996 – 2015)"
              colorScheme="color-scheme-1"
              headerImg="/content/images/Assets/Elections.svg"
            >
              <span>
                Aπό το 2007 καταγράφεται μια <span className="text-accent">σημαντική αύξηση της αποχής</span> που κορυφώνεται στο 37% στις
                εκλογές του Ιουνίου του 2012.
              </span>
            </DatasetCard>
            <DatasetCard
              title="Εκλογικά Αποτελέσματα (1996 – 2015)"
              colorScheme="color-scheme-1"
              headerImg="/content/images/Assets/Elections.svg"
            >
              <span>
                Στις εκλογές του Ιανουαρίου 2015 στην εκλογική περιφέρεια Αττικής η <span className="text-accent">Χρυσή Αυγή</span>{' '}
                συγκεντρώνει τα υψηλότερα ποσοστά της στους
                <span className="text-accent">Δήμους Ασπροπύργου (14,5%)</span> και <span className="text-accent">Αχαρνών (11,2%)</span>.
              </span>
            </DatasetCard>
          </CardCarousel>
          <CardCarousel>
            <DatasetCard title="Πολιτικό Προσωπικό" colorScheme="color-scheme-2" headerImg="/content/images/Assets/Politicians.svg">
              <span>
                Στις 1211 περιπτώσεις εκλεγμένων Βουλευτών για το διάστημα 1993 – 2019{' '}
                <span className="text-accent">το 83% είναι άνδρες και το 17% γυναίκες</span>.<br />
                <br />
                <br />
              </span>
            </DatasetCard>
            <DatasetCard title="Πολιτικό Προσωπικό" colorScheme="color-scheme-2" headerImg="/content/images/Assets/Politicians.svg">
              <span>
                Όσο <span className="text-accent">μεγαλύτερη η εκλογική περιφέρεια</span>, τόσο οι βουλευτές της προέρχονται από «πολιτική»
                οικογένεια. Στη <span className="text-accent">Β’ Αθήνας</span> σχεδον 1 στους 5 βουλευτές έχει{' '}
                <span className="text-accent">συγγενή με προηγούμενη θητεία</span> στο Κοινοβούλιο.
              </span>
            </DatasetCard>
            <DatasetCard title="Πολιτικό Προσωπικό" colorScheme="color-scheme-2" headerImg="/content/images/Assets/Politicians.svg">
              <span>
                Η τρέχουσα Βουλή είναι πιθανώς η πιο «μορφωμένη» της Μεταπολίτευσης καθώς έχει{' '}
                <span className="text-accent">τους περισσότερους κατόχους διδακτορικού (16,3%)</span>
                της τελευταίας εικοσιπενταετίας.
                <br />
                <br />
              </span>
            </DatasetCard>
          </CardCarousel>
          <CardCarousel>
            <DatasetCard
              title="Στάσεις και αντιλήψεις μαθητών Γυμνασίου"
              colorScheme="color-scheme-3"
              headerImg="/content/images/Assets/Teenagers.svg"
            >
              <span>
                Για τους περισσότερους μαθητές ο «Πραγματικός Έλληνας» είναι εκείνος που{' '}
                <span className="text-accent">«Επιθυμεί να είναι Έλληνας»</span>
                και όχι αυτός που <span className="text-accent">«Σέβεται τους θεσμούς της χώρας»</span>
              </span>
            </DatasetCard>
            <DatasetCard
              title="Στάσεις και αντιλήψεις μαθητών Γυμνασίου"
              colorScheme="color-scheme-3"
              headerImg="/content/images/Assets/Teenagers.svg"
            >
              <span>
                Τα υψηλότερα ποσοστά <span className="text-accent"> διαφωνίας με τους καθηγητές (54,6%)</span>
                προέρχονται από μαθητές <span className="text-accent">με γονείς υψηλής κοινωνικής θέσης</span>.
              </span>
            </DatasetCard>
            <DatasetCard
              title="Στάσεις και αντιλήψεις μαθητών Γυμνασίου"
              colorScheme="color-scheme-3"
              headerImg="/content/images/Assets/Teenagers.svg"
            >
              <span>
                Τα υψηλότερα ποσοστά <span className="text-accent"> διαφωνίας με τους καθηγητές (54,6%)</span>
                προέρχονται από μαθητές <span className="text-accent">με γονείς υψηλής κοινωνικής θέσης</span>.
              </span>
            </DatasetCard>
          </CardCarousel>
          <CardCarousel>
            <DatasetCard
              title="Κοινωνικές αντιπαραθέσεις και διαμαρτυρία"
              colorScheme="color-scheme-1"
              headerImg="/content/images/Assets/Protests.svg"
            >
              <span>Διαμαρτυρίες για εργατικά θέματα πανελλαδικώς.</span>
            </DatasetCard>
            <DatasetCard
              title="Κοινωνικές αντιπαραθέσεις και διαμαρτυρία"
              colorScheme="color-scheme-1"
              headerImg="/content/images/Assets/Protests.svg"
            >
              <span>Διαμαρτυρίες για εργατικά θέματα πανελλαδικώς.</span>
            </DatasetCard>
            <DatasetCard
              title="Κοινωνικές αντιπαραθέσεις και διαμαρτυρία"
              colorScheme="color-scheme-1"
              headerImg="/content/images/Assets/Protests.svg"
            >
              <span>Διαμαρτυρίες για εργατικά θέματα πανελλαδικώς.</span>
            </DatasetCard>
          </CardCarousel>
          <CardCarousel>
            <DatasetCard
              title="Φτώχεια και Κοινωνικός Αποκλεισμός"
              colorScheme="color-scheme-2"
              headerImg="/content/images/Assets/Poverty.svg"
            >
              <span>
                2006-2011 » Χρονική εξέλιξη του <span className="text-accent">εισοδήματος</span> των ελληνικών νοικοκυριών.
              </span>
            </DatasetCard>
            <DatasetCard
              title="Φτώχεια και Κοινωνικός Αποκλεισμός"
              colorScheme="color-scheme-2"
              headerImg="/content/images/Assets/Poverty.svg"
            >
              <span>
                2006-2011 » Χρονική εξέλιξη του <span className="text-accent">εισοδήματος</span> των ελληνικών νοικοκυριών.
              </span>
            </DatasetCard>
            <DatasetCard
              title="Φτώχεια και Κοινωνικός Αποκλεισμός"
              colorScheme="color-scheme-2"
              headerImg="/content/images/Assets/Poverty.svg"
            >
              <span>
                2006-2011 » Χρονική εξέλιξη του <span className="text-accent">εισοδήματος</span> των ελληνικών νοικοκυριών.
              </span>
            </DatasetCard>
          </CardCarousel>
          <CardCarousel>
            <DatasetCard title="Το εγκληματικό φαινόμενο" colorScheme="color-scheme-3" headerImg="/content/images/Assets/Criminality.svg">
              <span>
                Χρονική εξέλιξη του αριθμού των <span className="text-accent">ανθρωποκτονιών από πρόθεση</span> στην Ελλάδα.
              </span>
            </DatasetCard>
            <DatasetCard title="Το εγκληματικό φαινόμενο" colorScheme="color-scheme-3" headerImg="/content/images/Assets/Criminality.svg">
              <span>
                Χρονική εξέλιξη του αριθμού των <span className="text-accent">ανθρωποκτονιών από πρόθεση</span> στην Ελλάδα.
              </span>
            </DatasetCard>
            <DatasetCard title="Το εγκληματικό φαινόμενο" colorScheme="color-scheme-3" headerImg="/content/images/Assets/Criminality.svg">
              <span>
                Χρονική εξέλιξη του αριθμού των <span className="text-accent">ανθρωποκτονιών από πρόθεση</span> στην Ελλάδα.
              </span>
            </DatasetCard>
          </CardCarousel>
        </div>
      </div>
    );
  }
}

const mapStateToProps = storeState => ({
  account: storeState.authentication.account,
  isAuthenticated: storeState.authentication.isAuthenticated
});

const mapDispatchToProps = { getSession, showHeader, hideHeader };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
