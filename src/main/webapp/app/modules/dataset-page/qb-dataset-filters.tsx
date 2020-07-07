import React from 'react';
import './dataset-page.scss';
import { translateEntityField } from 'app/shared/util/entity-utils';
import { IDataSet } from 'app/shared/model/data-set.model';
import { ISeriesOptions } from 'app/shared/model/series-options.model';
import { IDimensionCode } from 'app/shared/model/dimension-code.model';
import { Dropdown } from 'semantic-ui-react';
import { setFilterValue } from 'app/modules/dataset-page/dataset-page-reducer';

export interface IQbDatasetFiltersProp {
  dimensionCodes: any;
  dataset: IDataSet;
  fetchedCodeLists: boolean;
  seriesOptions: ISeriesOptions;
  setFilterValue: typeof setFilterValue;
}

export class QbDatasetFilters extends React.Component<IQbDatasetFiltersProp> {
  handleFilterChange = dimensionId => (e, { value }) => {
    this.props.setFilterValue(this.props.dataset, dimensionId, value);
  };

  createDropdownOptions = (codes, arr, level) => {
    const mapCodeToOption = code => ({
      id: code.notation,
      key: code.notation,
      text: translateEntityField(code.name),
      value: code.notation,
      className: `filter-option-level-${level}`
    });
    codes.forEach(code => {
      arr.push(mapCodeToOption(code));
      code.children && this.createDropdownOptions(code.children, arr, level + 1);
    });
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { dataset, dimensionCodes, seriesOptions } = this.props;
    return (
      <div>
        {dataset.dimensions
          .filter(dimension => dimension.id !== seriesOptions.xAxis && dimension.id !== seriesOptions.compareBy && !dimension.disableFilter)
          .map(dimension => {
            const dropdownOptions = [];
            this.createDropdownOptions(dimensionCodes[dimension.id].codes, dropdownOptions, 0);
            return (
              <div key={dimension.id} className="vis-qb-filter">
                <div className="vis-qb-filter-label">{`${translateEntityField(dimension.name)}:`}</div>
                <Dropdown
                  className={`vis-options-dropdown ${dataset.colorScheme}`}
                  key={dimension.id}
                  onChange={this.handleFilterChange(dimension.id)}
                  options={dropdownOptions}
                  selection
                  search
                  fluid
                  clearable
                  noResultsMessage="Δε βρέθηκαν αποτελέσματα"
                  value={seriesOptions.dimensionFilters[dimension.id]}
                />
              </div>
            );
          })}
      </div>
    );
  }
}

export default QbDatasetFilters;
