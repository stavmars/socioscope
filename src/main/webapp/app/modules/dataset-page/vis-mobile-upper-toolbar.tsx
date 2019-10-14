import React from 'react';
import { NavLink } from 'react-router-dom';
import './dataset-page.scss';
import { Button, Image, Menu, Checkbox, Form } from 'semantic-ui-react';
import { IDataSet } from 'app/shared/model/data-set.model';
import { toggleMobileVisMenu } from 'app/shared/reducers/header';
import { updateVisOptions } from 'app/modules/dataset-page/dataset-page-reducer';
import { connect } from 'react-redux';
import _ from 'lodash';
import { IDimension } from 'app/shared/model/dimension.model';
import { urlEncodeVisOptions } from './dataset-page-vis';
import { ISeriesOptions } from 'app/shared/model/series-options.model';

export interface IVisMobileUpperToolbarProp extends DispatchProps {
  dataset: IDataSet;
  visType: string;
  seriesOptions: ISeriesOptions;

  resetGraph(e): void;
}

export class VisMobileUpperToolbar extends React.Component<IVisMobileUpperToolbarProp> {
  constructor(props) {
    super(props);
  }

  render() {
    const { dataset, visType, seriesOptions } = this.props;
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
          <Menu.Item>
            <Form style={{ paddingTop: '15px' }}>
              <Form.Group inline>
                <Form.Field>
                  <Checkbox
                    radio
                    label={
                      visType === 'bar' ? (
                        <Image src={`/content/images/Assets/Chart-${colorScheme}.svg`} />
                      ) : (
                        <Image src={`/content/images/Assets/Chart.svg`} />
                      )
                    }
                    checked={visType === 'bar'}
                    as={NavLink}
                    to={'?' + urlEncodeVisOptions({ visType: 'bar', seriesOptions })}
                  />
                </Form.Field>
                <Form.Field>
                  <Checkbox
                    radio
                    label={
                      visType === 'column' ? (
                        <Image src={`/content/images/Assets/Chart-${colorScheme}.svg`} style={{ transform: 'rotate(90deg)' }} />
                      ) : (
                        <Image src={`/content/images/Assets/Chart.svg`} style={{ transform: 'rotate(90deg)' }} />
                      )
                    }
                    checked={visType === 'column'}
                    as={NavLink}
                    to={'?' + urlEncodeVisOptions({ visType: 'column', seriesOptions })}
                  />
                </Form.Field>
                {_.find(dataset.dimensions as IDimension[], obj => obj.type === 'geographic-area') && (
                  <Form.Field>
                    <Checkbox
                      radio
                      label={
                        visType === 'map' ? (
                          <Image src={`/content/images/Assets/Map-${colorScheme}.svg`} />
                        ) : (
                          <Image src={`/content/images/Assets/Map.svg`} />
                        )
                      }
                      checked={visType === 'map'}
                      as={NavLink}
                      to={'?' + urlEncodeVisOptions({ visType: 'map', seriesOptions: {} })}
                    />
                  </Form.Field>
                )}
              </Form.Group>
            </Form>
          </Menu.Item>
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
