import React from 'react';
import { NavLink } from 'react-router-dom';
import './dataset-page.scss';
import { Button, Image, Menu } from 'semantic-ui-react';
import { IDataSet } from 'app/shared/model/data-set.model';
import { toggleMobileVisMenu } from 'app/shared/reducers/header';
import { connect } from 'react-redux';

export interface IVisMobileUpperToolbarProp extends DispatchProps {
  dataset: IDataSet;
  visType: string;
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
            <Image src="/content/images/Assets/Reset.svg" />
          </Menu.Item>
          <Menu.Item as={NavLink} to="?type=chart">
            {visType === 'chart' ? (
              <Image src={`/content/images/Assets/Chart-${colorScheme}.svg`} />
            ) : (
              <Image src={`/content/images/Assets/Chart.svg`} />
            )}
          </Menu.Item>
          <Menu.Item style={{ marginRight: '5%' }} as={NavLink} to="?type=map">
            {visType === 'map' ? (
              <Image src={`/content/images/Assets/Map-${colorScheme}.svg`} />
            ) : (
              <Image src={`/content/images/Assets/Map.svg`} />
            )}
          </Menu.Item>
        </Menu>
      </div>
    );
  }
}

const mapDispatchToProps = {
  toggleMobileVisMenu
};

type DispatchProps = typeof mapDispatchToProps;

export default connect(
  null,
  mapDispatchToProps
)(VisMobileUpperToolbar);
