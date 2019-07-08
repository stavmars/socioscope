import './dataset-page.scss';
import React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';
import { IRootState } from 'app/shared/reducers';
import { getDataset } from 'app/modules/dataset-page/dataset-page-reducer';
import { translateEntityField } from 'app/shared/util/entity-utils';

export interface IDatasetPageAboutProp extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export class DatasetPageAbout extends React.Component<IDatasetPageAboutProp> {
  componentDidMount() {
    this.props.getDataset(this.props.match.params.id);
  }

  render() {
    const { dataset } = this.props;

    return (
      <div className={`dataset-page-about ${dataset.colorScheme}`}>
        <Grid>
          <Grid.Column width={5} />
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

const mapStateToProps = (storeState: IRootState) => ({
  dataset: storeState.datasetPage.dataset
});

const mapDispatchToProps = {
  getDataset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DatasetPageAbout);
