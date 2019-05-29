import './home.scss';

import React from 'react';
import { Link } from 'react-router-dom';
import { Translate } from 'react-jhipster';
import { connect } from 'react-redux';
import { Row, Col, Alert } from 'reactstrap';

import { IRootState } from 'app/shared/reducers';
import { getSession } from 'app/shared/reducers/authentication';

export interface IHomeProp extends StateProps, DispatchProps {}

export class Home extends React.Component<IHomeProp> {
  componentDidMount() {
    this.props.getSession();
  }

  render() {
    const { account } = this.props;
    return (
      <Row>
        <Col>
          <h2>Ανοικτά Κοινωνικά Δεδομένα</h2>
          <p className="lead">
            Το socioscope είναι μια πλατφόρμα οπτικοποίησης κοινωνικών και πολιτικών δεδομένων. Εξερευνήστε τις θεματικές και διαμορφώστε τα
            δικά σας διαγράμματα, πίνακες και χάρτες.
          </p>
          <h3>ΕΞΕΡΕΥΝΗΣΤΕ</h3>
        </Col>
      </Row>
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
