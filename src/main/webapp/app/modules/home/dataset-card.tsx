import React from 'react';
import { translate } from 'react-jhipster';
import { Grid, Image } from 'semantic-ui-react';
import { NavLink as Link } from 'react-router-dom';

export interface IDatasetCardProps {
  title: string;
  colorScheme: string;
  headerImg: string;
}

export class DatasetCard extends React.Component<IDatasetCardProps> {
  render() {
    const { title, colorScheme, headerImg } = this.props;

    return (
      <div className={`dataset-card ${colorScheme}`}>
        <div className="dataset-card-header">
          <Image centered src={headerImg} />
          <h3>{title}</h3>
        </div>
        <div className="dataset-card-content">
          <Grid centered doubling verticalAlign="middle" columns="2">
            <Grid.Row>
              <Grid.Column>
                <Image centered src="/content/images/Assets/placeholder.png" style={{ width: 480, height: 250 }} />
              </Grid.Column>
              <Grid.Column>
                <p className={`dataset-card-desc ${colorScheme}`}>{this.props.children}</p>
                <Link className={`dataset-card-link ${colorScheme}`} to="/dataset/greek-election-results">
                  {translate('home.dataset.explore')}
                </Link>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
      </div>
    );
  }
}

export default DatasetCard;
