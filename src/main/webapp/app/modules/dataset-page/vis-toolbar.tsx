import React from 'react';
import { NavLink } from 'react-router-dom';
import './dataset-page.scss';
import { Checkbox, Dropdown, Grid, Image, List, Menu, Popup } from 'semantic-ui-react';
import _ from 'lodash';
import { IMeasure } from 'app/shared/model/measure.model';
import { IDataSet } from 'app/shared/model/data-set.model';
import { ISeriesOptions } from 'app/shared/model/series-options.model';
import { translate } from 'react-jhipster';

export interface IVisToolBarProp {
  dataset: IDataSet;
  seriesOptions: ISeriesOptions;
  visType: string;

  copyCurrentURL(): void;
  togglePercentage(): void;
}

export class VisToolbar extends React.Component<IVisToolBarProp> {
  constructor(props) {
    super(props);
  }

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
            <Grid.Column width={4}>
              <List floated="right" horizontal>
                <List.Item>
                  <Image src="/content/images/Assets/Download-icon.svg" />
                </List.Item>
                <List.Item>
                  <Dropdown icon="share alternate" className={`share-dropdown ${colorScheme}`} pointing="top right">
                    <Dropdown.Menu>
                      <Popup
                        on="click"
                        content="Copied link!"
                        trigger={<Dropdown.Item icon="linkify" text="Link" onClick={this.props.copyCurrentURL} />}
                        basic
                      />
                      <Dropdown.Item icon="twitter" text="Twitter" disabled />
                      <Dropdown.Item icon="facebook f" text="Facebook" disabled />
                      <Dropdown.Item icon="mail outline" text="Email" disabled />
                    </Dropdown.Menu>
                  </Dropdown>
                </List.Item>
                <List.Item>
                  <Image src="/content/images/Assets/Download-icon.svg" />
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
