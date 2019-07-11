import React from 'react';
import { translate } from 'react-jhipster';
import { Grid, Image, Container } from 'semantic-ui-react';
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
          <Image className="dataset-card-header-image" centered src={headerImg} />
          <h3>{title}</h3>
        </div>
        <div className="dataset-card-content">
          <Grid centered doubling verticalAlign="middle" columns="2">
            <Grid.Row>
              <Grid.Column>
                <Image className="dataset-card-content-image" centered src="/content/images/Assets/placeholder.png" />
              </Grid.Column>
              <Grid.Column>
                <p className={`dataset-card-desc ${colorScheme}`}>{this.props.children}</p>
                <Container textAlign="center">
                  <Link className={`dataset-card-link ${colorScheme}`} to="/dataset/greek-election-results">
                    {translate('home.dataset.explore')}
                  </Link>
                </Container>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
      </div>
    );
  }
}

export default DatasetCard;
