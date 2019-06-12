import './politicians.scss';

import React from 'react';
import { Row, Col, Card, CardText, CardBody, CardTitle, CardImg } from 'reactstrap';
// tslint:disable max-line-length

const Politicians = () => (
  <Card body style={{ backgroundColor: '#FFEFD8', borderColor: '#FFEFD8', width: '95%', left: '2.5%' }}>
    <CardBody className="politicians-card-body">
      <CardImg className="card-img" src="/content/images/Assets/Politicians.svg" alt="Card image cap" />
      <Row>
        <Col>
          <CardTitle className="card-title">Πολιτικό Προσωπικό</CardTitle>
        </Col>
      </Row>
      <Row>
        <Col className="col-1" xs="auto">
          <div id="Group_96">
            <div id="Group_94">
              <div id="Group_91">
                <div id="Group_90">
                  <svg className="Path_685" viewBox="617.693 157.241 123.062 139.377">
                    <path
                      id="Path_685"
                      d="M 740.7548217773438 296.6179504394531 L 617.6929931640625 231.1846160888672 C 642.2665405273438 184.96826171875 688.411376953125 157.2409973144531 740.7548217773438 157.2409973144531 L 740.7548217773438 296.6179504394531 Z"
                    />
                  </svg>
                </div>
              </div>
              <div id="Group_93">
                <div id="Group_92">
                  <svg className="Path_686" viewBox="602.406 157.241 278.754 278.753">
                    <path
                      id="Path_686"
                      d="M 741.782958984375 296.6179504394531 L 741.782958984375 157.2409973144531 C 818.7586669921875 157.2409973144531 881.159912109375 219.6422882080078 881.159912109375 296.6179504394531 C 881.159912109375 373.5936584472656 818.7586669921875 435.9938659667969 741.782958984375 435.9938659667969 C 664.8073120117188 435.9938659667969 602.406005859375 373.5936584472656 602.406005859375 296.6179504394531 C 602.406005859375 271.9857482910156 607.1563720703125 252.9331359863281 618.7211303710938 231.1846160888672 L 741.782958984375 296.6179504394531 Z"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div id="Group_95" />
          </div>
          <div id="______">
            <span>άνδρες</span>
          </div>
          <div id="_________A0_Text_30">
            <span>γυναίκες</span>
          </div>
          <div id="ID17_">
            <span>17%</span>
          </div>
          <div id="ID83_">
            <span>83%</span>
          </div>
        </Col>
        <Col className="col-2" xs="6">
          <CardText className="card-text">
            <span>Στις 1211 περιπτώσεις εκλεγμένων Βουλευτών για το διάστημα 1993 – 2019 το 83% είναι </span>
            <span className="men">άνδρες</span>
            <span> και το 17% </span>
            <span className="women">γυναίκες</span>
            <span>. </span>
          </CardText>
        </Col>
      </Row>
    </CardBody>
  </Card>
);

export default Politicians;
