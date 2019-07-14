import React from 'react';
import { connect } from 'react-redux';

import { IRootState } from 'app/shared/reducers';
import './dataset-page.scss';
import { Accordion, Dropdown, Form, Radio } from 'semantic-ui-react';
import { translateEntityField } from 'app/shared/util/entity-utils';
import { IDataSet } from 'app/shared/model/data-set.model';
import { ISeriesOptions } from 'app/shared/model/series-options.model';
import { IDimensionCode } from 'app/shared/model/dimension-code.model';

export interface IRawDatasetFiltersProp {
  dimensionCodes: Map<string, IDimensionCode[]>;
  dataset: IDataSet;
  fetchedCodeLists: boolean;
  seriesOptions: ISeriesOptions;
}

export interface IRawDatasetFiltersState {
  activeAccordionIndex: string;
}

export class RawDatasetFilters extends React.Component<IRawDatasetFiltersProp, IRawDatasetFiltersState> {
  constructor(props) {
    super(props);
    this.state = {
      activeAccordionIndex: null
    };
  }

  handleAccordionClick = (e, titleProps) => {
    e.stopPropagation();
    const { index } = titleProps;
    const { activeAccordionIndex } = this.state;
    const newIndex = activeAccordionIndex === index ? -1 : index;

    this.setState({ activeAccordionIndex: newIndex });
  };

  render() {
    const { dataset, dimensionCodes, fetchedCodeLists, seriesOptions } = this.props;

    return (
      <div>
        <Dropdown closeOnChange={false} multiple selection fluid placeholder="Επιλέξτε 1 ή παραπάνω φίλτρα">
          <Dropdown.Menu as={Accordion} vertical>
            {dataset.dimensions.map(dimension => (
              <div>
                <Accordion.Title
                  content={translateEntityField(dimension.name)}
                  index={dimension.id}
                  active={this.state.activeAccordionIndex === dimension.id}
                  onClick={this.handleAccordionClick}
                />
                <Accordion.Content active={this.state.activeAccordionIndex === dimension.id}>
                  <Form>
                    {fetchedCodeLists &&
                      dimensionCodes[dimension.id].map(code => (
                        <Form.Field>
                          <Radio label={translateEntityField(code.name)} name={`${dimension.id}-radio-group`} value={code.id} />
                        </Form.Field>
                      ))}
                  </Form>
                </Accordion.Content>
              </div>
            ))}
          </Dropdown.Menu>
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
