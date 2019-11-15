import React from 'react';
import './dataset-page.scss';
import { IDimension } from 'app/shared/model/dimension.model';
import { IDimensionCode } from 'app/shared/model/dimension-code.model';
import { removeFilter, setFilterValue } from 'app/modules/dataset-page/dataset-page-reducer';
import { ISeriesOptions } from 'app/shared/model/series-options.model';
import { IDataSet } from 'app/shared/model/data-set.model';
import Slider, { createSliderWithTooltip } from 'rc-slider';
import 'rc-slider/assets/index.css';
import { accentColors } from 'app/config/constants';
import { translateEntityField } from 'app/shared/util/entity-utils';
import { Image, Popup } from 'semantic-ui-react';
import _ from 'lodash';

const Handle = Slider.Handle;

export interface ISliderFilterProp {
  dataset: IDataSet;
  dimension: IDimension;
  codes: IDimensionCode[];
  setFilterValue: typeof setFilterValue;
  removeFilter: typeof removeFilter;
  seriesOptions: ISeriesOptions;
  removable: boolean;
}

export interface ISliderFilterState {
  value: number;
}

export class SliderFilter extends React.Component<ISliderFilterProp, ISliderFilterState> {
  constructor(props) {
    super(props);
    this.state = {
      value: this.findSelectedCodeIndex()
    };
  }

  componentDidUpdate(prevProps) {
    const { dimension } = this.props;
    if (this.props.seriesOptions.dimensionFilters[dimension.id] !== prevProps.seriesOptions.dimensionFilters[dimension.id]) {
      this.setState({
        value: this.findSelectedCodeIndex()
      });
    }
  }

  handle = props => {
    const { value, dragging, index, ...restProps } = props;
    const code = this.props.codes[value];
    return (
      <Popup
        content={translateEntityField(code.shortName) || translateEntityField(code.name)}
        open
        position="bottom left"
        trigger={<Handle value={value} {...restProps} />}
      />
    );
  };

  findSelectedCodeIndex = () => {
    const { dimension } = this.props;
    const { dimensionFilters } = this.props.seriesOptions;
    const selectedIndex = _.findIndex(this.props.codes, { notation: dimensionFilters[dimension.id] });
    return selectedIndex < 0 ? null : selectedIndex;
  };

  handleRemoveFilter = dimensionId => {
    this.props.removeFilter(this.props.dataset, dimensionId);
  };

  onChange = value => {
    this.setState({
      value
    });
  };

  onAfterChange = () => {
    const { value } = this.state;
    const { dimension, codes, dataset } = this.props;
    const { dimensionFilters } = this.props.seriesOptions;
    const currentFilterNotation = dimensionFilters[dimension.id];
    if (codes[value] && codes[value].notation !== currentFilterNotation) {
      this.props.setFilterValue(dataset, dimension.id, codes[value].notation);
    }
  };

  // tslint:disable:jsx-no-lambda
  render() {
    const { dimension, codes, dataset, seriesOptions, removable } = this.props;
    const currentFilterValue = seriesOptions.dimensionFilters[dimension.id];
    const marks = codes.reduce((acc, code, index) => {
      acc[index] = <span className="slider-filter-mark">{translateEntityField(code.shortName) || translateEntityField(code.name)}</span>;
      return acc;
    }, {});
    return (
      <div className="slider-filter">
        <div className="slider-filter-label">{translateEntityField(dimension.name)}</div>
        {this.state.value != null &&
          removable && (
            <Image
              inline
              src={`/content/images/Assets/remove-filter-${dataset.colorScheme}.svg`}
              onClick={() => this.handleRemoveFilter(dimension.id)}
            />
          )}
        <div style={{ height: 50, paddingTop: 5 }}>
          <Slider
            min={-1}
            max={codes.length}
            marks={marks}
            included={false}
            step={null}
            className={dataset.colorScheme}
            railStyle={{ backgroundColor: accentColors[dataset.colorScheme], opacity: 0.3 }}
            handleStyle={{ borderColor: accentColors[dataset.colorScheme] }} /*handle={this.handle}*/
            value={this.state.value}
            onChange={this.onChange}
            onAfterChange={this.onAfterChange}
          />
        </div>
      </div>
    );
  }
}

export default SliderFilter;
