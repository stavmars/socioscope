import React from 'react';
import './dataset-page.scss';
import { Button, Icon, Image, Popup } from 'semantic-ui-react';
import { IDimension } from 'app/shared/model/dimension.model';
import { translateEntityField } from 'app/shared/util/entity-utils';
import { IDimensionCode } from 'app/shared/model/dimension-code.model';
import { removeFilter, setFilterValue } from 'app/modules/dataset-page/dataset-page-reducer';
import { ISeriesOptions } from 'app/shared/model/series-options.model';
import { IDataSet } from 'app/shared/model/data-set.model';

export interface IButtonGroupFilterProp {
  dataset: IDataSet;
  dimension: IDimension;
  codes: IDimensionCode[];
  setFilterValue: typeof setFilterValue;
  removeFilter: typeof removeFilter;
  seriesOptions: ISeriesOptions;
}

export class ButtonGroupFilter extends React.Component<IButtonGroupFilterProp> {
  constructor(props) {
    super(props);
  }

  handleFilterChange = (code: IDimensionCode) => () => {
    const { dimension } = this.props;
    const { dimensionFilters } = this.props.seriesOptions;
    const currentFilterValue = dimensionFilters[dimension.id];
    if (currentFilterValue && currentFilterValue === code.notation) {
      this.props.removeFilter(this.props.dataset, dimension.id);
    } else {
      this.props.setFilterValue(this.props.dataset, dimension.id, code.notation);
    }
  };

  render() {
    const { dimension, codes, dataset, seriesOptions } = this.props;
    const currentFilterValue = seriesOptions.dimensionFilters[dimension.id];
    const details = translateEntityField(dimension.details);
    return (
      <div className="button-group-filter">
        <div className="button-group-filter-label">
          <span>{translateEntityField(dimension.name)}</span>
          {details && (
            <Popup wide trigger={<Icon link name="info circle" className={dataset.colorScheme} style={{ verticalAlign: 'top' }} />}>
              <Popup.Content dangerouslySetInnerHTML={{ __html: details }} />
            </Popup>
          )}
        </div>
        <Button.Group>
          {codes.filter(code => code.iconURL || code.shortName).map(code => (
            <Button
              active={code.notation === currentFilterValue}
              onClick={this.handleFilterChange(code)}
              className={`button-group-filter-button ${dataset.colorScheme}`}
              key={code.notation}
            >
              {code.iconURL ? <Image src={code.iconURL} /> : <span>{translateEntityField(code.shortName)}</span>}
            </Button>
          ))}
        </Button.Group>
      </div>
    );
  }
}

export default ButtonGroupFilter;
