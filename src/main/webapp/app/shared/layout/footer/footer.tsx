import './footer.scss';

import React from 'react';
import { Col, Row, Card, CardBody } from 'reactstrap';
// tslint:disable max-line-length

const Footer = props => (
  <Card style={{ backgroundColor: '#000000', borderColor: '#000000' }}>
    <CardBody className="footer">
      <Row className="row-1">
        <Col xs="1" sm="1" />
        <Col xs="12" sm="4">
          <span style={{ color: '#EDEDED' }}>ΣΧΕΤΙΚΑ • ΟΡΟΙ ΧΡΗΣΗΣ • ΠΟΛΙΤΙΚΗ ΑΠΟΡΡΗΤΟΥ • DEVELOPERS</span>
        </Col>
        <Col xs="6" sm="2">
          <span style={{ color: '#EDEDED' }}>Μία συνεργασία των</span>
        </Col>
        <Col xs="6" sm="2">
          <span style={{ color: '#EDEDED' }}>CC BY 4.0</span>
        </Col>
        {/*<Col xs="auto" sm="auto"/>*/}
      </Row>
      <Row className="row-2">
        <Col xs="1" sm="1" />
        <Col xs="12" sm="4" className="photos">
          <img src="/content/images/Assets/Logo-white-footer.png" />
        </Col>
        <Col xs="6" sm="2" className="photos">
          <img src="/content/images/Assets/ekke.png" /> <img src="/content/images/Assets/athena.png" />
        </Col>
        <Col xs="6" sm="2" className="photos">
          <img src="/content/images/Assets/cc.png" />
          <img src="/content/images/Assets/person.png" />
        </Col>
        <Col xs="auto" sm="auto" style={{}}>
          <img src="/content/images/Assets/eu.png" />
          <img src="/content/images/Assets/nsrf.png" />
        </Col>
      </Row>
    </CardBody>
  </Card>
);

export default Footer;
