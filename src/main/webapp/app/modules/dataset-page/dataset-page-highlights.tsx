import './dataset-page.scss';
import React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { IRootState } from 'app/shared/reducers';
import { getDataset } from 'app/modules/dataset-page/dataset-page-reducer';
import { translateEntityField } from 'app/shared/util/entity-utils';
import DatasetCard from '../home/dataset-card';

export interface IDatasetPageHighlightsProp extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export class DatasetPageHighlights extends React.Component<IDatasetPageHighlightsProp> {
  componentDidMount() {
    this.props.getDataset(this.props.match.params.id);
  }

  render() {
    const { dataset } = this.props;

    return (
      <div className={`dataset-page-highlights ${dataset.colorScheme}`}>
        {dataset.highlights
          ? dataset.highlights.map(value => (
              <div>
                <DatasetCard
                  title={translateEntityField(dataset.name)}
                  colorScheme={dataset.colorScheme}
                  headerImg="/content/images/Assets/Elections.svg"
                >
                  {value.description}
                </DatasetCard>
                <div className={`divider ${dataset.colorScheme}`} />
              </div>
            ))
          : null}
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
)(DatasetPageHighlights);
