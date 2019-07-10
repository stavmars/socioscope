import './dataset-page.scss';
import React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { IRootState } from 'app/shared/reducers';
import { translateEntityField } from 'app/shared/util/entity-utils';
import DatasetCard from '../home/dataset-card';

export interface IDatasetPageHighlightsProp extends StateProps, RouteComponentProps<{ id: string }> {}

export class DatasetPageHighlights extends React.Component<IDatasetPageHighlightsProp> {
  render() {
    const { datasetsById } = this.props;
    const dataset = datasetsById[this.props.match.params.id];

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
                  <div dangerouslySetInnerHTML={{ __html: value.description }} />
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
  datasetsById: storeState.dataSet.entitiesById
});

type StateProps = ReturnType<typeof mapStateToProps>;

export default connect(
  mapStateToProps,
  null
)(DatasetPageHighlights);
