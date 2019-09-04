import React from 'react';
import './dataset-page.scss';
import { Button, Image } from 'semantic-ui-react';
import { IDimension } from 'app/shared/model/dimension.model';
import { translateEntityField } from 'app/shared/util/entity-utils';
import { IDimensionCode } from 'app/shared/model/dimension-code.model';

export interface IButtonGroupFilterProp {
  dimension: IDimension;
  codes: IDimensionCode[];
  colorScheme: string;
}

export class ButtonGroupFilter extends React.Component<IButtonGroupFilterProp> {
  constructor(props) {
    super(props);
  }

  render() {
    const { dimension, codes, colorScheme } = this.props;
    return (
      <div className="button-group-filter">
        <div className="button-group-filter-label">{translateEntityField(dimension.name)}</div>
        <Button.Group>
          {codes.filter(code => code.iconURL || code.shortName).map(code => (
            <Button className={`button-group-filter-button ${colorScheme}`} key={code.notation}>
              {code.iconURL ? <Image src={code.iconURL} /> : <span>{translateEntityField(code.shortName)}</span>}
            </Button>
          ))}
        </Button.Group>
      </div>
    );
  }
}

export default ButtonGroupFilter;
