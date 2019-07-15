import React from 'react';
import './dataset-page.scss';
import { translateEntityField } from 'app/shared/util/entity-utils';
import { IDataSet } from 'app/shared/model/data-set.model';
import { ISeriesOptions } from 'app/shared/model/series-options.model';
import { IDimensionCode } from 'app/shared/model/dimension-code.model';
import { Dropdown } from 'semantic-ui-react';
import { setFilterValue } from 'app/modules/dataset-page/dataset-page-reducer';

export interface IQbDatasetFiltersProp {
  dimensionCodes: Map<string, IDimensionCode[]>;
  dataset: IDataSet;
  fetchedCodeLists: boolean;
  seriesOptions: ISeriesOptions;
  setFilterValue: typeof setFilterValue;
}

export class QbDatasetFilters extends React.Component<IQbDatasetFiltersProp> {
  constructor(props) {
    super(props);
  }

  handleFilterChange = dimensionId => (e, { value }) => {
    this.props.setFilterValue(this.props.dataset, dimensionId, value);
  };

  render() {
    const { dataset, dimensionCodes, fetchedCodeLists, seriesOptions } = this.props;
    return (
      <div>
        {dataset.dimensions
          .filter(dimension => dimension.id !== seriesOptions.xAxis && dimension.id !== seriesOptions.compareBy)
          .map(dimension => (
            <Dropdown
              className={`vis-options-dropdown ${dataset.colorScheme}`}
              key={dimension.id}
              onChange={this.handleFilterChange(dimension.id)}
              options={dimensionCodes[dimension.id].codes.map(code => ({
                id: code.notation,
                text: translateEntityField(code.name),
                value: code.notation
              }))}
              selection
              search
              fluid
              noResultsMessage="Δε βρέθηκαν αποτελέσματα"
              value={seriesOptions.dimensionFilters[dimension.id]}
            />
          ))}
      </div>
    );
  }
}

export default QbDatasetFilters;
