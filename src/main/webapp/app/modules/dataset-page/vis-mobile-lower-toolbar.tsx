import React from 'react';
import './dataset-page.scss';
import { Checkbox, Dropdown, Image, Menu, Popup } from 'semantic-ui-react';
import { IDataSet } from 'app/shared/model/data-set.model';
import { IMeasure } from 'app/shared/model/measure.model';
import _ from 'lodash';
import { ISeriesOptions } from 'app/shared/model/series-options.model';
import { translate } from 'react-jhipster';
// tslint:disable:jsx-no-lambda

export interface IVisMobileLowerToolbarProp {
  dataset: IDataSet;
  seriesOptions: ISeriesOptions;

  copyCurrentURL(): void;
  togglePercentage(): void;
  exportChartOrMap(action): void;
  shareChartOrMap(action): void;
}

export interface IVisToolBarState {
  downloadActive: boolean;
  shareActive: boolean;
  tooltipActive: boolean;
}

export class VisMobileLowerToolbar extends React.Component<IVisMobileLowerToolbarProp, IVisToolBarState> {
  constructor(props) {
    super(props);
    this.state = {
      downloadActive: false,
      shareActive: false,
      tooltipActive: false
    };
  }

  toggleDownload = () => {
    this.setState({ ...this.state, downloadActive: !this.state.downloadActive });
  };

  toggleShare = () => {
    this.setState({ ...this.state, shareActive: !this.state.shareActive });
  };

  toggleTooltip = () => {
    this.setState({ ...this.state, tooltipActive: !this.state.tooltipActive });
  };

  render() {
    const { dataset, seriesOptions } = this.props;
    const { colorScheme } = dataset;

    return (
      <div className="mob-vis-lower-toolbar">
        <Menu fluid text className={colorScheme}>
          <Menu.Item style={{ left: '5%' }}>
            <Image src="/content/images/Assets/Metric.svg" />
            <Checkbox
              className={colorScheme}
              toggle
              style={{ margin: '0 6px' }}
              onChange={this.props.togglePercentage}
              checked={_.find(dataset.measures as IMeasure[], { id: seriesOptions.measure }).type === 'percentage'}
            />
            <Image src="/content/images/Assets/Percentage.svg" />
          </Menu.Item>
          <Menu.Item position="right">
            <Dropdown
              icon={null}
              trigger={
                !this.state.downloadActive ? (
                  <Image src="/content/images/Assets/Download-icon.svg" style={{ width: '34.86px', height: '34.86px' }} />
                ) : (
                  <Image src={`/content/images/Assets/Download-icon-${colorScheme}.svg`} style={{ width: '34.86px', height: '34.86px' }} />
                )
              }
              className={`download-dropdown ${colorScheme}`}
              onClick={this.toggleDownload}
              onClose={this.toggleDownload}
            >
              <Dropdown.Menu>
                <Dropdown.Item
                  text={translate('socioscopeApp.dataSet.visualization.print')}
                  onClick={() => this.props.exportChartOrMap('print')}
                />
                <Dropdown.Header content={translate('socioscopeApp.dataSet.visualization.download')} />
                <Dropdown.Item text="PNG" onClick={() => this.props.exportChartOrMap('png')} />
                <Dropdown.Item text="JPEG" onClick={() => this.props.exportChartOrMap('jpeg')} />
                <Dropdown.Item text="SVG" onClick={() => this.props.exportChartOrMap('svg')} />
                <Dropdown.Item text="PDF" onClick={() => this.props.exportChartOrMap('pdf')} />
              </Dropdown.Menu>
            </Dropdown>
          </Menu.Item>
          <Menu.Item>
            <Dropdown
              icon={null}
              trigger={
                !this.state.shareActive ? (
                  <Image src="/content/images/Assets/share.svg" style={{ width: '34.86px', height: '34.86px' }} />
                ) : (
                  <Image src={`/content/images/Assets/share-${colorScheme}.svg`} style={{ width: '34.86px', height: '34.86px' }} />
                )
              }
              className={`share-dropdown ${colorScheme}`}
              onClick={this.toggleShare}
              onClose={this.toggleShare}
              pointing="top right"
            >
              <Dropdown.Menu>
                <Popup
                  on="click"
                  content={translate('copy.message')}
                  style={{
                    fontSize: '11px'
                  }}
                  trigger={<Dropdown.Item icon="linkify" text="Link" onClick={this.props.copyCurrentURL} />}
                  basic
                />
                <Dropdown.Item icon="twitter" text="Twitter" onClick={() => this.props.shareChartOrMap('twitter')} />
                <Dropdown.Item icon="facebook f" text="Facebook" onClick={() => this.props.shareChartOrMap('facebook')} />
                <Dropdown.Item icon="mail outline" text="Email" onClick={() => this.props.shareChartOrMap('email')} />
              </Dropdown.Menu>
            </Dropdown>
          </Menu.Item>
        </Menu>
      </div>
    );
  }
}

export default VisMobileLowerToolbar;
