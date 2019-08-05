import React from 'react';
import './dataset-page.scss';
import { translateEntityField } from 'app/shared/util/entity-utils';
import { IDataSet } from 'app/shared/model/data-set.model';
import { IDimensionCode } from 'app/shared/model/dimension-code.model';
import { List } from 'semantic-ui-react';
import { toggleCompareValue } from 'app/modules/dataset-page/dataset-page-reducer';
import { IDimension } from 'app/shared/model/dimension.model';
import _ from 'lodash';

export interface ICompareOptionListProp {
  codes: IDimensionCode[];
  dataset: IDataSet;
  compareCodes: any;
  dimension: IDimension;
  toggleCompareValue: typeof toggleCompareValue;
}

export class CompareOptionList extends React.Component<ICompareOptionListProp> {
  constructor(props) {
    super(props);
  }

  toggleCompareByOption = (e, { code }) => {
    this.props.toggleCompareValue(this.props.dataset, this.props.dimension.id, code);
    e.stopPropagation();
  };

  render() {
    const { compareCodes } = this.props;
    const createCompareByOptions = (codes: IDimensionCode[]) =>
      codes.map(code => (
        <List.Item onClick={this.toggleCompareByOption} code={code.notation} key={code.notation}>
          <List.Icon name={_.includes(compareCodes, code.notation) ? 'check square outline' : 'square outline'} />
          <List.Content>
            <List.Description className="dropdown-description">{translateEntityField(code.name)}</List.Description>
            {code.children && <List.List>{createCompareByOptions(code.children)}</List.List>}
          </List.Content>
        </List.Item>
      ));

    return (
      <List relaxed verticalAlign="middle">
        {createCompareByOptions(this.props.codes)}
      </List>
    );
  }
}

export default CompareOptionList;
