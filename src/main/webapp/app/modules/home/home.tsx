import './home.scss';

import React from 'react';
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { Translate } from 'react-jhipster';
import { connect } from 'react-redux';
import { Row, Col, Card, CardText, CardBody, CardTitle } from 'reactstrap';

import { IRootState } from 'app/shared/reducers';
import { getSession } from 'app/shared/reducers/authentication';
import Politicians from 'app/modules/highlights/politicians';
import Schools from 'app/modules/highlights/schools';

export interface IHomeProp extends StateProps, DispatchProps {}

export class Home extends React.Component<IHomeProp> {
  componentDidMount() {
    this.props.getSession();
  }

  render() {
    const { account } = this.props;
    return (
      <div>
        <Row>
          <Col>
            <Card className="home" style={{ height: '100vh', width: '100%' }}>
              <CardBody>
                <CardTitle className="title">Ανοικτά Κοινωνικά Δεδομένα</CardTitle>
                <CardText className="text">
                  Το socioscope είναι μια πλατφόρμα οπτικοποίησης κοινωνικών και πολιτικών δεδομένων. Εξερευνήστε τις θεματικές και
                  διαμορφώστε τα δικά σας διαγράμματα, πίνακες και χάρτες.
                  <br />
                  <br />
                  <br />
                  <br />
                  <span className="link">
                    <HashLink to="/firstHighlight" tabIndex={0} replace={false}>
                      ΕΞΕΡΕΥΝΗΣΤΕ
                    </HashLink>
                  </span>
                </CardText>
              </CardBody>
            </Card>
          </Col>
        </Row>
        {/* for the first highlight */}
        <a tabIndex={0} id="/firstHighlight" />
        <Row style={{ marginTop: '-150px' }}>
          <Col sm="12" md={{ size: 12, offset: 0 }}>
            <Politicians />
          </Col>
        </Row>
        {/* for the last highlight */}
        <Row style={{ marginTop: '31px', marginBottom: '31px' }} className="schools">
          <Col sm="12" md={{ size: 12, offset: 0 }}>
            <Schools />
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
)(Home);
