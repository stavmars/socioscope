import React from 'react';
import { NavLink } from 'react-router-dom';
import './dataset-page.scss';
import { Checkbox, Dropdown, Grid, Image, List, Menu, Popup } from 'semantic-ui-react';
import _ from 'lodash';
import { IMeasure } from 'app/shared/model/measure.model';
import { IDataSet } from 'app/shared/model/data-set.model';
import { ISeriesOptions } from 'app/shared/model/series-options.model';
import { translate } from 'react-jhipster';
// tslint:disable:jsx-no-lambda

export interface IVisToolBarProp {
  dataset: IDataSet;
  seriesOptions: ISeriesOptions;
  visType: string;

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

export class VisToolbar extends React.Component<IVisToolBarProp, IVisToolBarState> {
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
    const { dataset, seriesOptions, visType } = this.props;
    const { colorScheme } = dataset;

    return (
      <div className={`vis-toolbar ${colorScheme}`}>
        <div className={colorScheme}>
          <Grid columns="equal">
            <Grid.Column>
              <Menu text className={colorScheme}>
                {dataset.measures.length === 2 && (
                  <Menu.Item style={{ marginRight: '25px' }}>
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
                )}
                <Menu.Item as={NavLink} to="?type=chart" active={visType === 'chart'} style={{ marginRight: '50px' }}>
                  {visType === 'chart' ? (
                    <Image src={`/content/images/Assets/Chart-${colorScheme}.svg`} style={{ marginRight: '20px' }} />
                  ) : (
                    <Image src={`/content/images/Assets/Chart.svg`} style={{ marginRight: '20px' }} />
                  )}
                  {translate('socioscopeApp.dataSet.visualization.graph')}
                </Menu.Item>
                <Menu.Item as={NavLink} to="?type=map" active={visType === 'map'} style={{ marginRight: '50px' }}>
                  {visType === 'map' ? (
                    <Image src={`/content/images/Assets/Map-${colorScheme}.svg`} style={{ marginRight: '20px' }} />
                  ) : (
                    <Image src={`/content/images/Assets/Map.svg`} style={{ marginRight: '20px' }} />
                  )}
                  {translate('socioscopeApp.dataSet.visualization.map')}
                </Menu.Item>
                {/*<Menu.Item as={NavLink} to="?type=list" active={visType === 'list'}>
                      {visType === 'list' ? (
                        <Image src={`/content/images/Assets/List-${colorScheme}.svg`} style={{ marginRight: '20px' }} />
                      ) : (
                        <Image src={`/content/images/Assets/List.svg`} style={{ marginRight: '20px' }} />
                      )}
                      Αποτελέσματα σε λίστα
                    </Menu.Item>*/}
              </Menu>
            </Grid.Column>
            <Grid.Column>
              <List horizontal floated="right">
                <List.Item>
                  <Dropdown
                    icon={null}
                    trigger={
                      !this.state.downloadActive ? (
                        <Image src="/content/images/Assets/Download-icon.svg" />
                      ) : (
                        <Image src={`/content/images/Assets/Download-icon-${colorScheme}.svg`} />
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
                </List.Item>
                <List.Item>
                  <Dropdown
                    icon={null}
                    trigger={
                      !this.state.shareActive ? (
                        <Image src="/content/images/Assets/share.svg" />
                      ) : (
                        <Image src={`/content/images/Assets/share-${colorScheme}.svg`} />
                      )
                    }
                    className={`download-dropdown ${colorScheme}`}
                    onClick={this.toggleShare}
                    onClose={this.toggleShare}
                    pointing="top right"
                  >
                    <Dropdown.Menu>
                      <Popup
                        on="click"
                        content="Copied link!"
                        trigger={<Dropdown.Item icon="linkify" text="Link" onClick={this.props.copyCurrentURL} />}
                        basic
                      />
                      <Dropdown.Item icon="twitter" text="Twitter" onClick={() => this.props.shareChartOrMap('twitter')} />
                      <Dropdown.Item icon="facebook f" text="Facebook" onClick={() => this.props.shareChartOrMap('facebook')} />
                      <Dropdown.Item icon="mail outline" text="Email" onClick={() => this.props.shareChartOrMap('email')} />
                    </Dropdown.Menu>
                  </Dropdown>
                </List.Item>
                <List.Item>
                  <Image src="/content/images/Assets/Tooltip.svg" style={{ marginTop: '-37px' }} />
                </List.Item>
              </List>
            </Grid.Column>
          </Grid>
        </div>
      </div>
    );
  }
}

export default VisToolbar;
