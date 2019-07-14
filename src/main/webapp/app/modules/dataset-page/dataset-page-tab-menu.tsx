import './dataset-page.scss';
import React from 'react';
import { Grid } from 'semantic-ui-react';
import { translateEntityField } from 'app/shared/util/entity-utils';
import { IDataSet } from 'app/shared/model/data-set.model';
import { NavLink } from 'react-router-dom';

export interface IDatasetPageTabMenuProp {
  dataset: IDataSet;
  isMinimized?: boolean;
}

export class DatasetPageTabMenu extends React.Component<IDatasetPageTabMenuProp> {
  render() {
    const { dataset, isMinimized } = this.props;
    return (
      <div
        className={`dataset-page-tab-menu` + (isMinimized ? ' minimized' : '')}
        style={{ backgroundImage: `url(/content/images/Assets/${dataset.id}.jpg` }}
      >
        <div className={`dataset-page-tab-menu-top` + (isMinimized ? ' minimized' : '')}>
          <div className={`dataset-page-title` + (isMinimized ? ' minimized' : '')}>
            <h1>{translateEntityField(dataset.name)}</h1>
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

export default DatasetPageTabMenu;
