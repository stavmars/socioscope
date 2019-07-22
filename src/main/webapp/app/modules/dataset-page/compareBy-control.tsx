import React from 'react';
import './dataset-page.scss';
import { translateEntityField } from 'app/shared/util/entity-utils';
import { IDataSet } from 'app/shared/model/data-set.model';
import { ISeriesOptions } from 'app/shared/model/series-options.model';
import { IDimensionCode } from 'app/shared/model/dimension-code.model';
import { Accordion, Checkbox, Dropdown, Form, Image } from 'semantic-ui-react';
import { changeCompareBy } from 'app/modules/dataset-page/dataset-page-reducer';

export interface ICompareByControlProp {
  dimensionCodes: Map<string, IDimensionCode[]>;
  dataset: IDataSet;
  seriesOptions: ISeriesOptions;
  changeCompareBy: typeof changeCompareBy;
}

export interface ICompareByControlState {
  activeIndex: string;
}

export class CompareByControl extends React.Component<ICompareByControlProp, ICompareByControlState> {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: null
    };
  }

  handleCompareByChange = (e, { value }) => this.props.changeCompareBy(value);

  handleAccordionClick = (e, props) => {
    e.stopPropagation();
    const { index } = props;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? null : index;
    this.setState({ activeIndex: newIndex });
  };

  toggleCompareByOption = (e, data: object) => {
    e.stopPropagation();
  };

  render() {
    const { dataset, dimensionCodes, seriesOptions } = this.props;
    const { dimensions, colorScheme } = dataset;
    const { activeIndex } = this.state;

    const compareByOptions = dimensions.map(dimension => ({
      id: dimension.id,
      text: translateEntityField(dimension.name),
      value: dimension.id,
      disabled: dimension.id === seriesOptions.xAxis
    }));

    /*    const createCodeOptions = (codes: IDimensionCode[]) =>
          <List relaxed>
            {codes.map(code =>
              <List.Item key={code.notation}>
                <Checkbox label={translateEntityField(code.name)} onClick={this.toggleCompareByOption} checked/>
                {code.children && createCodeOptions(code.children)}
              </List.Item>)}
          </List>;*/

    const createCodeOptions = (codes: IDimensionCode[]) => (
      <Form>
        {codes.map(code => (
          <Form.Field key={code.notation}>
            <Checkbox label={translateEntityField(code.name)} onClick={this.toggleCompareByOption} />
          </Form.Field>
        ))}
      </Form>
    );

    return (
      <div className="vis-compareBy vis-options-menu-item">
        <div className="vis-options-menu-label">
          <Image inline src={`/content/images/Assets/compare-${dataset.colorScheme}.svg`} style={{ paddingRight: '23px' }} />… και να
          συγκρίνω ως προς:
        </div>
        <Dropdown
          className={`vis-options-dropdown ${colorScheme}`}
          onChange={this.handleCompareByChange}
          placeholder="Επιλέξτε 2 ή παραπάνω μεταβλητές"
          fluid
          scrolling
        >
          <Dropdown.Menu>
            {dimensions.map(dimension => (
              <Dropdown.Item
                key={dimension.id}
                disabled={dimension.id === seriesOptions.xAxis}
                index={dimension.id}
                onClick={this.handleAccordionClick}
              >
                <Accordion>
                  <Accordion.Title active={activeIndex === dimension.id} content={translateEntityField(dimension.name)} />
                  <Accordion.Content active={activeIndex === dimension.id}>
                    {createCodeOptions(dimensionCodes[dimension.id].codes)}
                  </Accordion.Content>
                </Accordion>
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </div>
    );
  }
}

export default CompareByControl;
