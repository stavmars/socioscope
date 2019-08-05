import React from 'react';
import './dataset-page.scss';
import { Image, GridRow, ImageGroup, Label, Responsive, GridColumn } from 'semantic-ui-react';
import { IDataSet } from 'app/shared/model/data-set.model';
import { IMeasure } from 'app/shared/model/measure.model';
import _ from 'lodash';
import { ISeriesOptions } from 'app/shared/model/series-options.model';
import { accentColors } from 'app/config/constants';

export interface IVisColumnButtonsProp {
  dataset: IDataSet;
  seriesOptions: ISeriesOptions;
}

export class VisColumnButtons extends React.Component<IVisColumnButtonsProp> {
  constructor(props) {
    super(props);
  }

  render() {
    const { dataset, seriesOptions } = this.props;

    return (
      <div>
        <Responsive {...Responsive.onlyComputer}>
          <GridRow className="gender" mobile={16} tablet={6} computer={4}>
            <Label.Group>
              <Label className={dataset.colorScheme}>
                <Image rounded src="/content/images/Assets/Boy.svg" />
              </Label>
              <Label className={dataset.colorScheme}>
                <Image rounded src="/content/images/Assets/Girl.svg" />
              </Label>
            </Label.Group>
          </GridRow>
          <GridRow className="school-class" mobile={16} tablet={6} computer={4}>
            <Label.Group>
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
          <GridRow className="social-status" mobile={16} tablet={6} computer={4}>
            <Label.Group>
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
            <div style={{ display: 'inline', marginLeft: '25%' }}>
              <Label size="mini" className={dataset.colorScheme}>
                <Image rounded src="/content/images/Assets/Boy.svg" />
              </Label>
              <Label size="mini" className={dataset.colorScheme}>
                <Image rounded src="/content/images/Assets/Girl.svg" />
              </Label>
              <Label size="mini" className={dataset.colorScheme} style={{ marginLeft: '3%' }}>
                <Image rounded src="/content/images/Assets/Social-1.svg" />
              </Label>
              <Label size="mini" className={dataset.colorScheme}>
                <Image rounded src="/content/images/Assets/Social-2.svg" />
              </Label>
              <Label size="mini" className={dataset.colorScheme}>
                <Image rounded src="/content/images/Assets/Social-3.svg" />
              </Label>
            </div>
            <Label.Group style={{ marginLeft: '35%' }}>
              <Label size="mini" className={dataset.colorScheme} style={{ fontSize: '14px', color: '#ffff' }} content="Α΄" />
              <Label size="mini" className={dataset.colorScheme} style={{ fontSize: '14px', color: '#ffff' }} content="Β΄" />
              <Label size="mini" className={dataset.colorScheme} style={{ fontSize: '14px', color: '#ffff' }} content="Γ΄" />
            </Label.Group>
          </GridRow>
        </Responsive>
      </div>
    );
  }
}

export default VisColumnButtons;
