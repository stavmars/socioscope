import './dataset-page.scss';
import React from 'react';
import { Grid, Image, Menu, Responsive } from 'semantic-ui-react';
import { translateEntityField } from 'app/shared/util/entity-utils';
import { IDataSet } from 'app/shared/model/data-set.model';
import { NavLink } from 'react-router-dom';
import { translate } from 'react-jhipster';
import { toggleMobileMenu, toggleTopicsMenu } from 'app/shared/reducers/header';
import { connect } from 'react-redux';

// tslint:disable max-line-length

export interface IDatasetPageTabMenuProp extends DispatchProps {
  dataset: IDataSet;
  isMinimized?: boolean;
}

export class DatasetPageTabMenu extends React.Component<IDatasetPageTabMenuProp> {
  render() {
    const { dataset, isMinimized } = this.props;
    const colors = {};

    colors['color-scheme-1'] = '#fffed7';
    colors['color-scheme-2'] = '#ffefd8';
    colors['color-scheme-3'] = '#d8fff6';

    const activeStyle = {
      backgroundColor: colors[dataset.colorScheme],
      color: '#1e1e1e'
    };

    return (
      <div
        className={`dataset-page-tab-menu` + (isMinimized ? ' minimized' : '')}
        style={{ background: `url(/content/images/Assets/${dataset.id}.jpg) 0%/cover no-repeat` }}
      >
        <div className={`dataset-page-tab-menu-top` + (isMinimized ? ' minimized' : '')}>
          <div className={`dataset-page-title` + (isMinimized ? ' minimized' : '')}>
            {isMinimized ? (
              <div>
                <Responsive {...Responsive.onlyMobile}>
                  <Image
                    className="datasetIcon"
                    centered
                    src={`/content/images/Assets/${dataset.id}-${dataset.colorScheme}.svg`}
                    style={{ paddingTop: 20 }}
                  />
                  <h2 className={dataset.colorScheme}>{translateEntityField(dataset.name)}</h2>
                </Responsive>
                <Responsive minWidth={Responsive.onlyTablet.minWidth}>
                  <Menu text className="minimized-menu">
                    <Menu.Item>
                      <div className="datasetIcon-position">
                        <Image className="datasetIcon" src={`/content/images/Assets/${dataset.id}-${dataset.colorScheme}.svg`} />
                      </div>
                    </Menu.Item>
                    <Menu.Item>
                      <h1 className={dataset.colorScheme}>{translateEntityField(dataset.name)}</h1>
                    </Menu.Item>
                  </Menu>
                </Responsive>
              </div>
            ) : (
              <div>
                <Image className="datasetIcon" centered src={`/content/images/Assets/${dataset.id}-${dataset.colorScheme}.svg`} />
                <h1 className={dataset.colorScheme}>{translateEntityField(dataset.name)}</h1>
              </div>
            )}
          </div>
        </div>
        <Grid textAlign="center" style={{ margin: 0, padding: 0 }}>
          <Grid.Row columns={3} style={{ margin: 0, padding: 0 }}>
            <Grid.Column className={`dataset-page-tab-menu-item ${dataset.colorScheme}`} as={NavLink} exact to={`/dataset/${dataset.id}`}>
              <div>Highlights</div>
            </Grid.Column>
            <Grid.Column className={`dataset-page-tab-menu-item ${dataset.colorScheme}`} as={NavLink} to={`/dataset/${dataset.id}/data`}>
              <div>{translate('socioscopeApp.dataSet.tabMenu.data')}</div>
            </Grid.Column>
            <Grid.Column
              className={`dataset-page-tab-menu-item ${dataset.colorScheme}`}
              as={NavLink}
              exact
              to={`/dataset/${dataset.id}/about`}
            >
              <div>{translate('socioscopeApp.dataSet.tabMenu.id')}</div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

const mapDispatchToProps = { toggleTopicsMenu, toggleMobileMenu };

type DispatchProps = typeof mapDispatchToProps;

export default connect(
  null,
  mapDispatchToProps
)(DatasetPageTabMenu);
