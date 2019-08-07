import React from 'react';
import './dataset-page.scss';
import { Image, GridRow, ImageGroup, Label, Responsive, GridColumn, Header, Menu } from 'semantic-ui-react';
import { IDataSet } from 'app/shared/model/data-set.model';
import { IMeasure } from 'app/shared/model/measure.model';
import _ from 'lodash';
import { ISeriesOptions } from 'app/shared/model/series-options.model';
import { accentColors } from 'app/config/constants';
import { translate } from 'react-jhipster';

export interface IVisColumnButtonsProp {
  dataset: IDataSet;
  seriesOptions: ISeriesOptions;
  dimensionCodes: any;
}

export class VisColumnButtons extends React.Component<IVisColumnButtonsProp> {
  constructor(props) {
    super(props);
  }

  render() {
    const { dataset, seriesOptions, dimensionCodes } = this.props;

    return (
      <div>
        <Responsive {...Responsive.onlyComputer}>
          <GridRow className="gender" mobile={16} tablet={6} computer={4} textAlign="right" style={{ paddingBottom: '50px' }}>
            <Header
              content={translate('socioscopeApp.dataSet.visualization.rightColumn.sex')}
              textAlign="right"
              style={{ fontFamily: 'ProximaNovaSemibold', fontSize: '16px' }}
            />
            <Label.Group style={{ width: 'auto', float: 'right' }}>
              <Label className={dataset.colorScheme}>
                <Image rounded src="/content/images/Assets/Boy.svg" />
              </Label>
              <Label className={dataset.colorScheme}>
                <Image rounded src="/content/images/Assets/Girl.svg" />
              </Label>
            </Label.Group>
          </GridRow>
          <GridRow className="school-class" mobile={16} tablet={6} computer={4} style={{ padding: '10px 0' }}>
            <Header
              content={translate('socioscopeApp.dataSet.visualization.rightColumn.class')}
              textAlign="right"
              style={{ fontFamily: 'ProximaNovaSemibold', fontSize: '16px' }}
            />
            <Label.Group style={{ width: 'auto', float: 'right' }}>
              <Label className={dataset.colorScheme}>
                <span style={{ fontSize: '30px', color: '#ffff' }}>A'</span>
              </Label>
              <Label className={dataset.colorScheme}>
                <span style={{ fontSize: '30px', color: '#ffff' }}>Β'</span>
              </Label>
              <Label className={dataset.colorScheme}>
                <span style={{ fontSize: '30px', color: '#ffff' }}>Γ'</span>
              </Label>
            </Label.Group>
          </GridRow>
          <GridRow className="social-status" mobile={16} tablet={6} computer={4} style={{ paddingTop: '50px' }}>
            <Header
              content={translate('socioscopeApp.dataSet.visualization.rightColumn.status')}
              textAlign="right"
              style={{ fontFamily: 'ProximaNovaSemibold', fontSize: '16px' }}
            />
            <Label.Group style={{ width: 'auto', float: 'right' }}>
              <Label className={dataset.colorScheme}>
                <Image rounded src="/content/images/Assets/Social-1.svg" />
              </Label>
              <Label className={dataset.colorScheme}>
                <Image rounded src="/content/images/Assets/Social-2.svg" />
              </Label>
              <Label className={dataset.colorScheme}>
                <Image rounded src="/content/images/Assets/Social-3.svg" />
              </Label>
            </Label.Group>
          </GridRow>
        </Responsive>
        <Responsive {...Responsive.onlyMobile}>
          <GridRow centered>
            <Menu style={{ backgroundColor: 'transparent', borderStyle: 'none', width: 'auto' }}>
              <Label className={dataset.colorScheme}>
                <Image rounded src="/content/images/Assets/Boy.svg" />
              </Label>
              <Label className={dataset.colorScheme}>
                <Image rounded src="/content/images/Assets/Girl.svg" />
              </Label>
              <Label
                className={dataset.colorScheme}
                style={{ marginLeft: '3%', fontSize: '16px', color: '#ffff', padding: '11px 11px' }}
                content="Α΄"
              />
              <Label className={dataset.colorScheme} style={{ fontSize: '16px', color: '#ffff', padding: '11px 11px' }} content="Β΄" />
              <Label className={dataset.colorScheme} style={{ fontSize: '16px', color: '#ffff', padding: '11px 11px' }} content="Γ΄" />
              <Label className={dataset.colorScheme} style={{ marginLeft: '3%' }}>
                <Image rounded src="/content/images/Assets/Social-1.svg" />
              </Label>
              <Label className={dataset.colorScheme}>
                <Image rounded src="/content/images/Assets/Social-2.svg" />
              </Label>
              <Label className={dataset.colorScheme}>
                <Image rounded src="/content/images/Assets/Social-3.svg" />
              </Label>
            </Menu>
          </GridRow>
        </Responsive>
      </div>
    );
  }
}

export default VisColumnButtons;
