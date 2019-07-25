import React from 'react';
import './dataset-page.scss';
import { Checkbox, Dropdown, Image, Menu, Popup } from 'semantic-ui-react';
import { IDataSet } from 'app/shared/model/data-set.model';

export interface IVisMobileLowerToolbarProp {
  dataset: IDataSet;

  copyCurrentURL(): void;
}

export class VisMobileLowerToolbar extends React.Component<IVisMobileLowerToolbarProp> {
  constructor(props) {
    super(props);
  }

  render() {
    const { dataset } = this.props;
    const { colorScheme } = dataset;

    return (
      <div className="mob-vis-lower-toolbar">
        <Menu fluid text className={colorScheme}>
          <Menu.Item style={{ left: '5%' }}>
            <Image src="/content/images/Assets/Metric.svg" />
            <Checkbox className={colorScheme} toggle style={{ margin: '0 6px' }} />
            <Image src="/content/images/Assets/Percentage.svg" />
          </Menu.Item>
          <Menu.Item position="right">
            <Image src="/content/images/Assets/Download-icon.svg" style={{ width: '34.86px', height: '34.86px' }} />
          </Menu.Item>
          <Menu.Item>
            <Dropdown icon="share alternate" className={`share-dropdown ${colorScheme}`} pointing="top right">
              <Dropdown.Menu>
                <Popup
                  on="click"
                  content="Copied link!"
                  trigger={<Dropdown.Item icon="linkify" text="Σύνδεσμος" onClick={this.props.copyCurrentURL} />}
                  basic
                />
                <Dropdown.Item icon="twitter" text="Twitter" disabled />
                <Dropdown.Item icon="facebook f" text="Facebook" disabled />
                <Dropdown.Item icon="mail outline" text="Email" disabled />
              </Dropdown.Menu>
            </Dropdown>
          </Menu.Item>
          <Menu.Item style={{ marginRight: '5%' }}>
            <Image src="/content/images/Assets/mobile-menu-icon.png" />
          </Menu.Item>
        </Menu>
      </div>
    );
  }
}

export default VisMobileLowerToolbar;
