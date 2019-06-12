import './schools.scss';

import React from 'react';
import { Row, Col, Card, CardText, CardBody, CardTitle, CardImg } from 'reactstrap';
// tslint:disable max-line-length

const Schools = () => (
  <Card body style={{ backgroundColor: '#D8FFF6', borderColor: '#D8FFF6', width: '95%', left: '2.5%' }}>
    <CardBody className="schools-card-body">
      <img className="card-img" src="/content/images/Assets/Teenagers.svg" alt="Card image cap" />
      <CardTitle className="card-title">Στάσεις και αντιλήψεις μαθητών Γυμνασίου</CardTitle>
      <Row>
        <Col className="col-1" xs="auto">
          <div id="Group_98">
            <svg className="Line_29">
              <path id="Line_29" d="M 0 0 L 453.53515625 0" />
            </svg>
            <svg className="Line_30">
              <path id="Line_30" d="M 0 0 L 453.53515625 0" />
            </svg>
            <svg className="Line_31">
              <path id="Line_31" d="M 0 0 L 453.53515625 0" />
            </svg>
            <svg className="Line_32">
              <path id="Line_32" d="M 0 0 L 453.53515625 0" />
            </svg>
            <svg className="Rectangle_1099">
              <rect id="Rectangle_1099" rx="0" ry="0" x="0" y="0" width="13.097" height="235.401" />
            </svg>
            <svg className="Rectangle_1114">
              <rect id="Rectangle_1114" rx="0" ry="0" x="0" y="0" width="13.097" height="175.824" />
            </svg>
            <svg className="Rectangle_1116">
              <rect id="Rectangle_1116" rx="0" ry="0" x="0" y="0" width="13.097" height="169.642" />
            </svg>
            <svg className="Rectangle_1113">
              <rect id="Rectangle_1113" rx="0" ry="0" x="0" y="0" width="13.097" height="142.401" />
            </svg>
            <svg className="Rectangle_1115">
              <rect id="Rectangle_1115" rx="0" ry="0" x="0" y="0" width="13.097" height="142.401" />
            </svg>
            <svg className="Path_687" viewBox="0 0 13.097 109.401">
              <path id="Path_687" d="M 0 0 L 13.09704780578613 0 L 13.09704780578613 109.4009399414062 L 0 109.4009399414062 L 0 0 Z" />
            </svg>
            <div id="ID0">
              <span>0</span>
            </div>
            <div id="ID25_">
              <span>
                25
                <br />
              </span>
            </div>
            <div id="ID50">
              <span>50</span>
            </div>
            <div id="ID75">
              <span>75</span>
            </div>
            <div id="ID100">
              <span>100</span>
            </div>
            <svg className="Line_33">
              <path id="Line_33" d="M 0 0.02978515625 L 453.5350341796875 0" />
            </svg>
          </div>
        </Col>
        <Col className="col-2" xs="6">
          <CardText className="card-text">
            <span>Για τους περισσότερους μαθητές ο </span>
            <span>«Πραγματικός Έλληνας»</span>
            <span> είναι εκείνος που </span>
            <span style={{ color: '#FF5D39' }}>«Επιθυμεί να είναι Έλληνας»</span>
            <span> και όχι αυτός που </span>
            <span style={{ color: '#EBAD96' }}>«Σέβεται τους θεσμούς της χώρας»</span>
          </CardText>
        </Col>
      </Row>
    </CardBody>
  </Card>
);

export default Schools;
