import './dataset-page.scss';
import React from 'react';
import DatasetCard from '../home/dataset-card';
import { IDataSet } from 'app/shared/model/data-set.model';

export interface IDatasetPageHighlightsProp {
  dataset: IDataSet;
}

export class DatasetPageHighlights extends React.Component<IDatasetPageHighlightsProp> {
  render() {
    const { dataset } = this.props;

    return (
      <div className={`dataset-page-highlights ${dataset.colorScheme}`}>
        {dataset.highlights
          ? dataset.highlights.map(highlight => (
              <div key={highlight.id}>
                <DatasetCard key={highlight.id} title="" dataset={dataset} headerImg="" highlight={highlight}>
                  <div dangerouslySetInnerHTML={{ __html: highlight.description }} />
                </DatasetCard>
                <div className={`divider ${dataset.colorScheme}`} />
              </div>
            ))
          : null}
      </div>
    );
  }
}

export default DatasetPageHighlights;
