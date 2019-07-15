import './dataset-page.scss';
import React from 'react';
import { translateEntityField } from 'app/shared/util/entity-utils';
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
          ? dataset.highlights.map(value => (
              <div>
                <DatasetCard title="" colorScheme={dataset.colorScheme} headerImg="">
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

export default DatasetPageHighlights;
