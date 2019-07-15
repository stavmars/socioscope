import React from 'react';
import './dataset-page.scss';
import { translateEntityField } from 'app/shared/util/entity-utils';
import { IDataSet } from 'app/shared/model/data-set.model';
import { ISeriesOptions } from 'app/shared/model/series-options.model';
import { IDimensionCode } from 'app/shared/model/dimension-code.model';
import { Accordion, Checkbox, Dropdown, Form } from 'semantic-ui-react';
import { changeCompareBy } from 'app/modules/dataset-page/dataset-page-reducer';

export interface ICompareByControlProp {
  dimensionCodes: Map<string, IDimensionCode[]>;
  dataset: IDataSet;
  seriesOptions: ISeriesOptions;
  colorsAccent: any;
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
    console.log(e, data);
    e.stopPropagation();
  };

  render() {
    const { dataset, dimensionCodes, seriesOptions, colorsAccent } = this.props;
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
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="20" viewBox="0 0 30 20" fill={colorsAccent[colorScheme]}>
            <defs />
            <g transform="translate(-1036.885 363.024)">
              <rect className="a" width="6.283" height="6.45" transform="translate(1036.885 -363.024)" />
              <rect className="a" width="6.283" height="6.45" transform="translate(1036.885 -354.724)" />
              <rect className="a" width="6.283" height="3.225" transform="translate(1036.885 -346.424)" />
              <rect className="a" width="6.283" height="4.352" transform="translate(1044.79 -357.624)" />
              <rect className="a" width="6.283" height="4.352" transform="translate(1044.79 -351.499)" />
              <rect className="a" width="6.283" height="2.176" transform="translate(1044.79 -345.375)" />
              <rect className="a" width="6.283" height="4.006" transform="translate(1052.696 -353.874)" />
              <rect className="a" width="6.283" height="5.075" transform="translate(1052.696 -348.274)" />
              <rect className="a" width="6.283" height="2.526" transform="translate(1060.602 -350.8)" />
              <rect className="a" width="6.283" height="3.4" transform="translate(1060.602 -346.424)" />
            </g>
          </svg>{' '}
          … και να συγκρίνω ως προς:
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
