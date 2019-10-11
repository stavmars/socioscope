import React from 'react';
import { NavLink } from 'react-router-dom';
import './dataset-page.scss';
import { Button, Image, Menu, Checkbox } from 'semantic-ui-react';
import { IDataSet } from 'app/shared/model/data-set.model';
import { toggleMobileVisMenu } from 'app/shared/reducers/header';
import { updateVisOptions } from 'app/modules/dataset-page/dataset-page-reducer';
import { connect } from 'react-redux';
import _ from 'lodash';
import { IDimension } from 'app/shared/model/dimension.model';

export interface IVisMobileUpperToolbarProp extends DispatchProps {
  dataset: IDataSet;
  visType: string;

  resetGraph(e): void;
  invertGraph(): void;
}

export class VisMobileUpperToolbar extends React.Component<IVisMobileUpperToolbarProp> {
  constructor(props) {
    super(props);
  }

  render() {
    const { dataset, visType } = this.props;
    const { colorScheme } = dataset;

    return (
      <div className="mob-vis-upper-toolbar">
        <Menu fluid text>
          <Menu.Item>
            <Image
              as={Button}
              onClick={this.props.toggleMobileVisMenu}
              style={{ padding: 0, margin: 0 }}
              src={`/content/images/Assets/Mobile-filters-${colorScheme}.svg`}
            />
          </Menu.Item>
          <Menu.Item>
            <h1
              style={{
                fontFamily: 'ProximaNovaSemibold',
                color: '#1E1E1E',
                fontSize: '12px'
              }}
            >
              Διαμορφώστε το γράφημα
            </h1>
          </Menu.Item>
          <Menu.Item position="right">
            <Image onClick={this.props.resetGraph} src="/content/images/Assets/Reset.svg" />
          </Menu.Item>
          <Menu.Item as={NavLink} to="?type=bar">
            {visType !== 'map' ? (
              <Image src={`/content/images/Assets/Chart-${colorScheme}.svg`} />
            ) : (
              <Image src={`/content/images/Assets/Chart.svg`} />
            )}
          </Menu.Item>
          {visType !== 'map' && (
            <Menu.Item style={{ marginRight: '25px' }}>
              <Image src={`/content/images/Assets/Chart-${colorScheme}.svg`} style={{ transform: 'rotate(90deg)' }} />
              <Checkbox
                className={colorScheme}
                toggle
                style={{ margin: '0 6px' }}
                onChange={this.props.invertGraph}
                checked={!(visType === 'column')}
              />
              <Image src={`/content/images/Assets/Chart-${colorScheme}.svg`} />
            </Menu.Item>
          )}
          {_.find(dataset.dimensions as IDimension[], obj => obj.type === 'geographic-area') && (
            <Menu.Item as={NavLink} to="?type=map" style={{ marginRight: '5%' }}>
              {visType === 'map' ? (
                <Image src={`/content/images/Assets/Map-${colorScheme}.svg`} />
              ) : (
                <Image src={`/content/images/Assets/Map.svg`} />
              )}
            </Menu.Item>
          )}
        </Menu>
      </div>
    );
  }
}

const mapDispatchToProps = {
  toggleMobileVisMenu,
  updateVisOptions
};

type DispatchProps = typeof mapDispatchToProps;

export default connect(
  null,
  mapDispatchToProps
)(VisMobileUpperToolbar);
