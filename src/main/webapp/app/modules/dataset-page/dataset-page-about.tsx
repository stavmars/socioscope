import './dataset-page.scss';
import React from 'react';
import { Grid, Image, Responsive } from 'semantic-ui-react';
import { translateEntityField } from 'app/shared/util/entity-utils';
import { IDataSet } from 'app/shared/model/data-set.model';
import { translate } from 'react-jhipster';

// tslint:disable: max-line-length

export interface IDatasetPageAboutProp {
  dataset: IDataSet;
}

export class DatasetPageAbout extends React.Component<IDatasetPageAboutProp> {
  render() {
    const { dataset } = this.props;

    const AboutContent = () => (
      <div className="dataset-page-about-content">
        {translateEntityField(dataset.comment)}
        <br />
        <br />
        <span style={{ fontFamily: 'ProximaNovaBold' }}>{translate('about.sources.title')}:</span>
        {translateEntityField(dataset.sources)}
      </div>
    );

    return (
      <div className={`dataset-page-about ${dataset.colorScheme}`}>
        <Responsive {...Responsive.onlyMobile}>
          <Grid>
            <Grid.Row>
              <Image centered className="svg" src={`/content/images/Assets/research-info-${dataset.colorScheme}.svg`} />
            </Grid.Row>
            <Grid.Row>{AboutContent()}</Grid.Row>
          </Grid>
        </Responsive>
        <Responsive minWidth={Responsive.onlyTablet.minWidth}>
          <Grid>
            <Grid.Column width={5}>
              <Image className="svg" src={`/content/images/Assets/research-info-${dataset.colorScheme}.svg`} />
            </Grid.Column>
            <Grid.Column width={7}>{AboutContent()}</Grid.Column>
          </Grid>
        </Responsive>
      </div>
    );
  }
}

export default DatasetPageAbout;
