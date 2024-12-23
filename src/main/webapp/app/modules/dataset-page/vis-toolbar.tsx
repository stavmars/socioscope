import React from 'react';
import { NavLink } from 'react-router-dom';
import './dataset-page.scss';
import { Checkbox, Dropdown, Grid, Image, List, Menu, Popup, Form } from 'semantic-ui-react';
import _ from 'lodash';
import { IMeasure } from 'app/shared/model/measure.model';
import { IDataSet } from 'app/shared/model/data-set.model';
import { ISeriesOptions } from 'app/shared/model/series-options.model';
import { translate } from 'react-jhipster';
import { IDimension } from 'app/shared/model/dimension.model';
import { urlEncodeVisOptions } from './dataset-page-reducer';

// tslint:disable:jsx-no-lambda

export interface IVisToolBarProp {
  dataset: IDataSet;
  seriesOptions: ISeriesOptions;
  visType: string;
  subType: string;

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
    const { dataset, seriesOptions, visType, subType } = this.props;
    const { colorScheme } = dataset;

    return (
      <div className={`vis-toolbar ${colorScheme}`}>
        <div className={colorScheme}>
          <Grid>
            <Grid.Column width={12}>
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
                {visType !== 'map' &&
                  _.find(dataset.dimensions, { id: seriesOptions.xAxis }).type !== 'time' && (
                    <Menu.Item>
                      <Form style={{ paddingTop: '15px' }}>
                        <Form.Group inline>
                          <Form.Field>
                            <Checkbox
                              radio
                              label={
                                subType === 'column' ? (
                                  <Image src={`/content/images/Assets/Chart-${colorScheme}.svg`} />
                                ) : (
                                  <Image src={`/content/images/Assets/Chart.svg`} />
                                )
                              }
                              checked={subType === 'column'}
                              as={NavLink}
                              to={'?' + urlEncodeVisOptions({ visType, subType: 'column', seriesOptions })}
                            />
                          </Form.Field>
                          <Form.Field>
                            <Checkbox
                              radio
                              label={
                                subType === 'bar' ? (
                                  <Image src={`/content/images/Assets/Chart-${colorScheme}.svg`} style={{ transform: 'rotate(90deg)' }} />
                                ) : (
                                  <Image src={`/content/images/Assets/Chart.svg`} style={{ transform: 'rotate(90deg)' }} />
                                )
                              }
                              checked={subType === 'bar'}
                              as={NavLink}
                              to={'?' + urlEncodeVisOptions({ visType, subType: 'bar', seriesOptions })}
                            />
                          </Form.Field>
                        </Form.Group>
                      </Form>
                    </Menu.Item>
                  )}
                {_.find(dataset.dimensions as IDimension[], obj => obj.type === 'geographic-area') && (
                  <div style={{ display: 'inherit' }}>
                    <Menu.Item
                      as={NavLink}
                      to={'?' + urlEncodeVisOptions({ visType: 'chart', subType: 'column', seriesOptions })}
                      active={visType === 'chart'}
                      style={{ marginRight: '20px' }}
                    >
                      {visType === 'chart' ? (
                        <Image src={`/content/images/Assets/Chart-${colorScheme}.svg`} style={{ marginRight: '20px' }} />
                      ) : (
                        <Image src={`/content/images/Assets/Chart.svg`} style={{ marginRight: '20px' }} />
                      )}
                      {translate('socioscopeApp.dataSet.visualization.graph')}
                    </Menu.Item>
                    <Menu.Item
                      as={NavLink}
                      to={'?' + urlEncodeVisOptions({ visType: 'map', seriesOptions: dataset.defaultOptions })}
                      active={visType === 'map'}
                      style={{ marginRight: '20px' }}
                    >
                      {visType === 'map' ? (
                        <Image src={`/content/images/Assets/Map-${colorScheme}.svg`} style={{ marginRight: '20px' }} />
                      ) : (
                        <Image src={`/content/images/Assets/Map.svg`} style={{ marginRight: '20px' }} />
                      )}
                      {translate('socioscopeApp.dataSet.visualization.map')}
                    </Menu.Item>
                  </div>
                )}
              </Menu>
            </Grid.Column>
            <Grid.Column width={4}>
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
                          fontSize: '12px'
                        }}
                        trigger={<Dropdown.Item icon="linkify" text="Link" onClick={this.props.copyCurrentURL} />}
                        basic
                      />
                      <Dropdown.Item icon="twitter" text="Twitter" onClick={() => this.props.shareChartOrMap('twitter')} />
                      <Dropdown.Item icon="facebook f" text="Facebook" onClick={() => this.props.shareChartOrMap('facebook')} />
                      <Dropdown.Item icon="mail outline" text="Email" onClick={() => this.props.shareChartOrMap('email')} />
                    </Dropdown.Menu>
                  </Dropdown>
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
