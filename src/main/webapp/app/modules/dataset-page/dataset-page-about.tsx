import './dataset-page.scss';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';
import { translateEntityField } from 'app/shared/util/entity-utils';
import { IDataSet } from 'app/shared/model/data-set.model';

// tslint:disable: max-line-length

export interface IDatasetPageAboutProp {
  dataset: IDataSet;
}

export class DatasetPageAbout extends React.Component<IDatasetPageAboutProp> {
  render() {
    const { dataset } = this.props;

    return (
      <div className={`dataset-page-about ${dataset.colorScheme}`}>
        <Grid>
          <Grid.Column width={5}>
            <div className={`svg ${dataset.colorScheme}`}>
              <svg
                id="Group_153"
                data-name="Group 153"
                xmlns="http://www.w3.org/2000/svg"
                width="87.664"
                height="87.664"
                viewBox="0 0 87.664 87.664"
              >
                <g id="Group_113" data-name="Group 113">
                  <circle id="Ellipse_31" data-name="Ellipse 31" cx="5.919" cy="5.919" r="5.919" transform="translate(37.913 20.008)" />
                  <path
                    id="Path_822"
                    data-name="Path 822"
                    d="M208.849,198.044v19.508a4.924,4.924,0,1,1-9.849,0V198.044a4.924,4.924,0,1,1,9.849,0Z"
                    transform="translate(-160.092 -154.949)"
                  />
                  <path
                    id="Path_823"
                    data-name="Path 823"
                    d="M43.832,0A43.832,43.832,0,1,0,87.664,43.832,43.833,43.833,0,0,0,43.832,0ZM69.315,69.315a36.04,36.04,0,0,1-51.4-50.531q.215-.219.435-.435A36.04,36.04,0,1,1,69.75,68.88Q69.534,69.1,69.315,69.315Z"
                  />
                  <path
                    id="Path_824"
                    data-name="Path 824"
                    d="M43.832,0A43.832,43.832,0,1,0,87.664,43.832,43.833,43.833,0,0,0,43.832,0ZM69.315,69.315a36.04,36.04,0,0,1-51.4-50.531q.215-.219.435-.435A36.04,36.04,0,1,1,69.75,68.88Q69.534,69.1,69.315,69.315Z"
                  />
                </g>
              </svg>
            </div>
          </Grid.Column>
          <Grid.Column width={6}>
            <div className="dataset-page-about-content">
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              {translateEntityField(dataset.comment)}
              <br />
              <br />
              <span style={{ fontFamily: 'ProximaNovaBold' }}>Ερευνήτρια:</span> Μανίνα Κακεπάκη (ΕΚΚΕ) /{' '}
              <span style={{ fontFamily: 'ProximaNovaBold' }}>mkakepaki@ekke.gr</span>
              <br />
              <br />
              <span style={{ fontFamily: 'ProximaNovaBold' }}>Πηγές:</span> Singular Logic, Υπουργείο Εσωτερικών – Διεύθυνση Εκλογών.
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
            </div>
          </Grid.Column>
          <Grid.Column width={5} />
        </Grid>
      </div>
    );
  }
}

export default DatasetPageAbout;
