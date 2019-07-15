import './dataset-page.scss';
import React from 'react';
import { Grid, Menu } from 'semantic-ui-react';
import { translateEntityField } from 'app/shared/util/entity-utils';
import { IDataSet } from 'app/shared/model/data-set.model';
import { NavLink } from 'react-router-dom';
import { Translate } from 'react-jhipster';
import { toggleTopicsMenu } from 'app/shared/reducers/header';
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

    return (
      <div
        className={`dataset-page-tab-menu` + (isMinimized ? ' minimized' : '')}
        style={{ backgroundImage: `url(/content/images/Assets/${dataset.id}.jpg` }}
      >
        <div className={`dataset-page-tab-menu-top` + (isMinimized ? ' minimized' : '')}>
          <div className={`dataset-page-title` + (isMinimized ? ' minimized' : '')}>
            {isMinimized ? (
              <Menu text>
                <Menu.Item style={{ padding: '0 32px 58px 34px', marginTop: '-56px' }}>
                  {/*<Image src={`/content/images/Assets/${dataset.id}-${dataset.colorScheme}.svg`} style={{ padding: '0 32px 58px 34px', marginTop: '-56px', color: 'red' }} />*/}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="53.322"
                    height="51.521"
                    fill={colors[dataset.colorScheme]}
                    viewBox="0 0 53.322 51.521"
                  >
                    <defs>
                      <clipPath id="a">
                        <rect className="a" width="53.322" height="51.522" />
                      </clipPath>
                    </defs>
                    <g className="b">
                      <path
                        className="c"
                        d="M50.227,39.874a1.1,1.1,0,0,0-1.036-.729H43.116V30.127a3.287,3.287,0,0,0-3.287-3.287h-.816V24.1a4.882,4.882,0,0,0-1.293-3.287L21.89,4.463a4.931,4.931,0,0,0-6.279-.668L8.045,8.835a4.382,4.382,0,0,0-1.912,4.213L7.607,24.308A6.733,6.733,0,0,0,9.25,28.571l2.613,3.041v7.534H6.818a1.1,1.1,0,0,0-1.041.751L1.394,53.083a1.1,1.1,0,0,0,1.041,1.4h51.14a1.1,1.1,0,0,0,1.041-1.441ZM9.793,24.226a1.053,1.053,0,0,0,0-.131L8.281,12.769a2.191,2.191,0,0,1,.981-2.115l7.566-5.041a2.74,2.74,0,0,1,3.507.378l15.79,16.322a2.68,2.68,0,0,1,.7,1.808v2.739H22.066l-1-1.978a1.1,1.1,0,0,0-1.956.986l6.153,12.18a2.685,2.685,0,0,1-3.37,3.709l-.181-.071a2.7,2.7,0,0,1-1.348-1.151l-4.082-6.991a4.954,4.954,0,0,0-.515-.718l-4.882-5.682A4.536,4.536,0,0,1,9.793,24.226ZM14.11,34.258a2.682,2.682,0,0,1,.285.394l4.087,7.008a4.9,4.9,0,0,0,2.444,2.087l.181.071a4.935,4.935,0,0,0,1.781.334,4.882,4.882,0,0,0,4.339-7.079l-4.054-8.043H39.828a1.1,1.1,0,0,1,1.1,1.1V47.111H14.034V34.165ZM3.958,52.294,7.612,41.337h4.23v5.808H9.711a1.1,1.1,0,1,0,0,2.192H45.127a1.1,1.1,0,0,0,0-2.192H43.116V41.337H48.4l3.654,10.958Z"
                        transform="translate(-1.35 -2.964)"
                      />
                    </g>
                  </svg>
                </Menu.Item>
                <Menu.Item>
                  <h1>{translateEntityField(dataset.name)}</h1>
                </Menu.Item>
                <Menu.Item position="right" onClick={this.props.toggleTopicsMenu}>
                  <span className="dataset-page-tab-menu-top-topics">
                    <Translate contentKey="global.menu.topics" />
                  </span>
                </Menu.Item>
              </Menu>
            ) : (
              <h1>{translateEntityField(dataset.name)}</h1>
            )}
          </div>
        </div>
        <Grid textAlign="center" style={{ margin: 0, padding: 0 }}>
          <Grid.Row columns={3} style={{ margin: 0, padding: 0 }}>
            <Grid.Column className="dataset-page-tab-menu-item" as={NavLink} exact to={`/dataset/${dataset.id}`}>
              <div>Highlights</div>
            </Grid.Column>
            <Grid.Column className="dataset-page-tab-menu-item" as={NavLink} to={`/dataset/${dataset.id}/data`}>
              <div>Δεδομένα</div>
            </Grid.Column>
            <Grid.Column className="dataset-page-tab-menu-item" as={NavLink} exact to={`/dataset/${dataset.id}/about`}>
              <div>Ταυτότητα Έρευνας</div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

const mapDispatchToProps = { toggleTopicsMenu };

type DispatchProps = typeof mapDispatchToProps;

export default connect(
  null,
  mapDispatchToProps
)(DatasetPageTabMenu);
