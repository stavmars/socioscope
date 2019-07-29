import React from 'react';
import './dataset-page.scss';
import { translateEntityField } from 'app/shared/util/entity-utils';
import { IDataSet } from 'app/shared/model/data-set.model';
import { ISeriesOptions } from 'app/shared/model/series-options.model';
import { IDimensionCode } from 'app/shared/model/dimension-code.model';
import { Accordion, Dropdown, Image, List } from 'semantic-ui-react';
import { toggleCompareValue } from 'app/modules/dataset-page/dataset-page-reducer';
import { translate } from 'react-jhipster';
import { IDimension } from 'app/shared/model/dimension.model';
import CompareOptionList from 'app/modules/dataset-page/compare-option-list';

export interface ICompareByControlProp {
  dimensionCodes: Map<string, IDimensionCode[]>;
  dataset: IDataSet;
  seriesOptions: ISeriesOptions;
  toggleCompareValue: typeof toggleCompareValue;
}

export interface ICompareByControlState {
  expandedId: string;
}

export class CompareByControl extends React.Component<ICompareByControlProp, ICompareByControlState> {
  constructor(props) {
    super(props);
    this.state = {
      expandedId: null
    };
  }

  handleAccordionClick = (e, props) => {
    e.stopPropagation();
    const { index } = props;
    const { expandedId } = this.state;
    const newIndex = expandedId === index ? null : index;
    this.setState({ expandedId: newIndex });
  };

  toggleCompareByOption = (e, { dimension, code }) => {
    this.props.toggleCompareValue(this.props.dataset, dimension, code);
    e.stopPropagation();
  };

  render() {
    const { dataset, dimensionCodes, seriesOptions } = this.props;
    const { dimensions, colorScheme } = dataset;
    const { expandedId } = this.state;
    const { compareCodes } = seriesOptions;

    const compareByOptions = dimensions.map(dimension => ({
      id: dimension.id,
      text: translateEntityField(dimension.name),
      value: dimension.id,
      disabled: dimension.id === seriesOptions.xAxis
    }));

    const createCompareByOptions = (dimension: IDimension, codes: IDimensionCode[]) =>
      codes.map(code => (
        <List.Item onClick={this.toggleCompareByOption} code={code.notation} key={code.notation}>
          <List.Icon name={compareCodes && compareCodes[code.notation] ? 'check square outline' : 'square outline'} />
          <List.Content>
            {/*<List.Header>{translateEntityField(code.name)}</List.Header>*/}
            <List.Description>{translateEntityField(code.name)}</List.Description>
            {code.children && (
              <List.List relaxed verticalAlign="middle">
                {createCompareByOptions(dimension, code.children)}
              </List.List>
            )}
          </List.Content>
        </List.Item>
      ));

    return (
      <div className="vis-compareBy vis-options-menu-item">
        <div className="vis-options-menu-label">
          <Image inline src={`/content/images/Assets/compare-${dataset.colorScheme}.svg`} style={{ paddingRight: '23px' }} />
          {translate('socioscopeApp.dataSet.visualization.configure.compare')}
        </div>
        <Dropdown className={`vis-options-dropdown ${colorScheme}`} placeholder="Επιλέξτε 2 ή παραπάνω μεταβλητές" fluid scrolling>
          <Accordion as={Dropdown.Menu}>
            {dimensions.map(dimension => (
              <Dropdown.Item
                key={dimension.id}
                disabled={dimension.id === seriesOptions.xAxis}
                onClick={this.handleAccordionClick}
                index={dimension.id}
              >
                <Accordion.Title
                  onClick={this.handleAccordionClick}
                  index={dimension.id}
                  className="compare-by-accordion-title"
                  active={expandedId === dimension.id}
                  content={translateEntityField(dimension.name)}
                />
                <Accordion.Content active={expandedId === dimension.id}>
                  <CompareOptionList
                    codes={dimensionCodes[dimension.id].codes}
                    dataset={dataset}
                    compareCodes={compareCodes}
                    dimension={dimension}
                    toggleCompareValue={this.props.toggleCompareValue}
                  />
                </Accordion.Content>
              </Dropdown.Item>
            ))}
          </Accordion>
        </Dropdown>
      </div>
    );
  }
}

export default CompareByControl;
