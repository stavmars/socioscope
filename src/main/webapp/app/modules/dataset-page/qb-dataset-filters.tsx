import React from 'react';
import './dataset-page.scss';
import { translateEntityField } from 'app/shared/util/entity-utils';
import { IDataSet } from 'app/shared/model/data-set.model';
import { ISeriesOptions } from 'app/shared/model/series-options.model';
import { setFilterValue } from 'app/modules/dataset-page/dataset-page-reducer';
import { Dropdown, Popup } from 'semantic-ui-react';

export interface IQbDatasetFiltersProp {
  dimensionCodes: any;
  dataset: IDataSet;
  fetchedCodeLists: boolean;
  seriesOptions: ISeriesOptions;
  setFilterValue: typeof setFilterValue;
}

export class QbDatasetFilters extends React.Component<IQbDatasetFiltersProp> {
  handleFilterChange = (e, { value }) => {
    const splitValue = value.split('$$$');
    this.props.setFilterValue(this.props.dataset, splitValue[0], splitValue[1]);
  };

  createDropdownOptions = (codes, arr, dimensionId) => {
    const mapCodeToOption = code => ({
      id: code.notation,
      key: code.notation,
      text: <span data-tooltip={translateEntityField(code.description)}>{translateEntityField(code.name)}</span>,
      value: dimensionId + '$$$' + code.notation,
      className: `filter-option-level-0`
    });
    codes.filter(code => !code.disabled).forEach(code => {
      arr.push(mapCodeToOption(code));
    });
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { dataset, dimensionCodes, seriesOptions } = this.props;
    const arr = [seriesOptions.xAxis, seriesOptions.compareBy];

    return (
      <div>
        {dataset.dimensions
          .filter(
            dimension =>
              !arr.includes(dimension.id) &&
              !dimension.disableFilter &&
              (!dimension.parentDimensionId || !arr.includes(dimension.parentDimensionId))
          )
          .map(dimension => {
            const dropdownOptions = [];
            if (dimension.type !== 'combined') {
              this.createDropdownOptions(dimensionCodes[dimension.id].codes, dropdownOptions, dimension.id);
            } else {
              dimension.composedOf.forEach(subDimId => {
                const subDimCodes = dimensionCodes[subDimId].codes;
                this.createDropdownOptions(subDimCodes, dropdownOptions, subDimId);
              });
            }

            let selectedValue = null;
            if (dimension.type === 'combined') {
              const selectedSubDim =
                dimension.composedOf && dimension.composedOf.find(subDimId => seriesOptions.dimensionFilters[subDimId] != null);
              if (selectedSubDim != null) {
                selectedValue = selectedSubDim + '$$$' + seriesOptions.dimensionFilters[selectedSubDim];
              }
            } else {
              const selectionId = seriesOptions.dimensionFilters[dimension.id];
              selectedValue = selectionId != null ? dimension.id + '$$$' + selectionId : null;
            }
            return (
              <div key={dimension.id} className="vis-qb-filter">
                <div className="vis-qb-filter-label">{`${translateEntityField(dimension.name)}:`}</div>
                <Dropdown
                  className={`vis-options-dropdown ${dataset.colorScheme}`}
                  key={dimension.id}
                  onChange={this.handleFilterChange}
                  options={dropdownOptions}
                  selection
                  search
                  placeholder={translateEntityField(dimension.noFilterText)}
                  fluid
                  clearable={!dimension.required}
                  disabled={dimension.parentDimensionId && !seriesOptions.dimensionFilters[dimension.parentDimensionId]}
                  noResultsMessage="Δε βρέθηκαν αποτελέσματα"
                  value={selectedValue}
                />
              </div>
            );
          })}
      </div>
    );
  }
}

export default QbDatasetFilters;
