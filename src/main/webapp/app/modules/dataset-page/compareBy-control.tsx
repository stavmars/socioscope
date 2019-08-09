import React from 'react';
import './dataset-page.scss';
import { translateEntityField } from 'app/shared/util/entity-utils';
import { IDataSet } from 'app/shared/model/data-set.model';
import { ISeriesOptions } from 'app/shared/model/series-options.model';
import { IDimensionCode } from 'app/shared/model/dimension-code.model';
import { Accordion, Dropdown, Icon, Image } from 'semantic-ui-react';
import { addCode, removeCode, removeCompare, toggleCompareValue } from 'app/modules/dataset-page/dataset-page-reducer';
import { translate } from 'react-jhipster';
import CompareOptionList from 'app/modules/dataset-page/compare-option-list';
import _ from 'lodash';

// tslint:disable: jsx-no-lambda

export interface ICompareByControlProp {
  dimensionCodes: Map<string, IDimensionCode[]>;
  dataset: IDataSet;
  seriesOptions: ISeriesOptions;
  toggleCompareValue: typeof toggleCompareValue;
  addCode: typeof addCode;
  removeCode: typeof removeCode;
  removeCompare: typeof removeCompare;
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

  handleCodeCheckbox = (code: string, checked: boolean) => {
    if (checked) {
      if (this.props.seriesOptions.compareCodes.length === 1) {
        this.handleRemoveCompareBy();
      } else {
        this.props.removeCode(this.props.dataset, code);
      }
    } else {
      this.props.addCode(this.props.dataset, code);
    }
  };

  handleRemoveCompareBy = () => {
    this.props.removeCompare(this.props.dataset);
  };

  render() {
    const { dataset, dimensionCodes, seriesOptions } = this.props;
    const { dimensions, colorScheme } = dataset;
    const { expandedId } = this.state;
    const { compareCodes } = seriesOptions;
    const xAxisDimension = _.find(dataset.dimensions, { id: seriesOptions.xAxis });
    const compareDimension = _.find(dataset.dimensions, { id: seriesOptions.compareBy });

    return (
      <div className="vis-compareBy vis-options-menu-item">
        <div className="vis-options-menu-label">
          <Image inline src={`/content/images/Assets/compare-${dataset.colorScheme}.svg`} style={{ paddingRight: '23px' }} />
          {translate('socioscopeApp.dataSet.visualization.configure.compare')}
        </div>
        <Dropdown
          className={`vis-options-dropdown ${colorScheme}`}
          placeholder="Επιλέξτε 2 ή παραπάνω μεταβλητές"
          fluid
          scrolling
          disabled={xAxisDimension.type === 'composite'}
        >
          <Accordion as={Dropdown.Menu}>
            {dimensions.filter(dimension => !dimension.disableFilter).map(dimension => (
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
        {seriesOptions.compareBy && (
          <div className="remove-filters">
            <span className="remove-filter-dim-label" style={{ paddingBottom: '15px' }}>
              {translateEntityField(compareDimension.name)}{' '}
            </span>
            {_.map(
              dimensionCodes[compareDimension.id].codesByNotation,
              value =>
                _.includes(compareCodes, value.notation) && (
                  <div className="remove-filter" key={value.id} style={{ paddingBottom: '22px' }}>
                    <Image
                      inline
                      src={`/content/images/Assets/remove-filter-${colorScheme}.svg`}
                      onClick={() => this.handleCodeCheckbox(value.notation, _.includes(compareCodes, value.notation))}
                      style={{ paddingBottom: '3px' }}
                    />
                    <Icon name="circle" style={{ color: value.color, marginRight: '15px' }} />
                    <span className="remove-filter-value">{translateEntityField(value.name)}</span>
                  </div>
                )
            )}
          </div>
        )}
      </div>
    );
  }
}

export default CompareByControl;
