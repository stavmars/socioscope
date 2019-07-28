import React from 'react';
import { connect } from 'react-redux';

import { IRootState } from 'app/shared/reducers';
import './dataset-page.scss';
import { Accordion, Dropdown, List } from 'semantic-ui-react';
import { translateEntityField } from 'app/shared/util/entity-utils';
import { IDataSet } from 'app/shared/model/data-set.model';
import { ISeriesOptions } from 'app/shared/model/series-options.model';
import { setFilterValue } from 'app/modules/dataset-page/dataset-page-reducer';

export interface IRawDatasetFiltersProp {
  dimensionCodes: any;
  dataset: IDataSet;
  fetchedCodeLists: boolean;
  seriesOptions: ISeriesOptions;
  setFilterValue: typeof setFilterValue;
}

export interface IRawDatasetFiltersState {
  expandedId: string;
}

export class RawDatasetFilters extends React.Component<IRawDatasetFiltersProp, IRawDatasetFiltersState> {
  constructor(props) {
    super(props);
    this.state = {
      expandedId: null
    };
  }

  handleFilterChange = dimensionId => (e, { code }) => {
    e.stopPropagation();
    this.props.setFilterValue(this.props.dataset, dimensionId, code);
  };

  handleAccordionClick = (e, props) => {
    e.stopPropagation();
    const { index } = props;
    const { expandedId } = this.state;
    const newIndex = expandedId === index ? null : index;
    this.setState({ expandedId: newIndex });
  };

  render() {
    const { dataset, dimensionCodes, fetchedCodeLists, seriesOptions } = this.props;
    const { expandedId } = this.state;

    return (
      <div>
        <Dropdown className={`vis-options-dropdown ${dataset.colorScheme}`} fluid scrolling placeholder="Επιλέξτε 1 ή παραπάνω φίλτρα">
          <Accordion as={Dropdown.Menu}>
            {dataset.dimensions.map(dimension => (
              <Dropdown.Item
                key={dimension.id}
                disabled={dimension.id === seriesOptions.xAxis || dimension.id === seriesOptions.compareBy}
                onClick={this.handleAccordionClick}
                index={dimension.id}
              >
                <Accordion.Title
                  onClick={this.handleAccordionClick}
                  index={dimension.id}
                  className="filter-accordion-title"
                  active={expandedId === dimension.id}
                  content={translateEntityField(dimension.name)}
                />
                <Accordion.Content active={expandedId === dimension.id}>
                  <List relaxed verticalAlign="middle">
                    {dimensionCodes[dimension.id].codes.map(code => (
                      <List.Item onClick={this.handleFilterChange(dimension.id)} code={code.notation} key={code.notation}>
                        <List.Icon
                          name={code.notation === seriesOptions.dimensionFilters[dimension.id] ? 'dot circle outline' : 'circle outline'}
                        />
                        <List.Content>
                          <List.Description>{translateEntityField(code.name)}</List.Description>
                        </List.Content>
                      </List.Item>
                    ))}
                  </List>
                </Accordion.Content>
              </Dropdown.Item>
            ))}
          </Accordion>
        </Dropdown>
      </div>
    );
  }
}

const mapStateToProps = (storeState: IRootState) => ({
  dimensionCodes: storeState.datasetPage.dimensionCodes,
  fetchedCodeLists: storeState.datasetPage.fetchedCodeLists,
  seriesOptions: storeState.datasetPage.seriesOptions
});

type StateProps = ReturnType<typeof mapStateToProps>;

export default connect(
  mapStateToProps,
  null
)(RawDatasetFilters);
