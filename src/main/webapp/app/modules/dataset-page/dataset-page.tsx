import React from 'react';
import { NavLink, Redirect, Route, RouteComponentProps, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';
import { hideHeader, showHeader } from 'app/shared/reducers/header';
import { Grid } from 'semantic-ui-react';
import { translateEntityField } from 'app/shared/util/entity-utils';
import './dataset-page.scss';
import DatasetPageVis from 'app/modules/dataset-page/dataset-page-vis';
import DatasetPageHighlights from 'app/modules/dataset-page/dataset-page-highlights';
import DatasetPageAbout from 'app/modules/dataset-page/dataset-page-about';
import Header from 'app/shared/layout/header/header';

// tslint:disable:jsx-no-lambda
export interface IDatasetPageProp extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export class DatasetPage extends React.Component<IDatasetPageProp> {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.showHeader();
  }

  render() {
    const { match } = this.props;
    const dataset = this.props.datasetsById[this.props.match.params.id];
    if (!dataset) {
      return <Redirect to="/" />;
    }

    return (
      <div className={`dataset-page background ${dataset.colorScheme}`}>
        <Header isFixed className={dataset.colorScheme} />
        <div className="dataset-page-tab-menu" style={{ backgroundImage: `url(/content/images/Assets/${dataset.id}.jpg` }}>
          <Grid textAlign="center" style={{ margin: 0, padding: 0 }}>
            <Grid.Row style={{ margin: 0, padding: 0 }}>
              <Grid.Column>
                <div className="dataset-page-title">
                  <h1>{translateEntityField(dataset.name)}</h1>
                </div>
              </Grid.Column>
            </Grid.Row>
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

        <Switch>
          <Route path={`${match.url}/data`} render={() => <DatasetPageVis dataset={dataset} />} />
          <Route exact path={`${match.url}/`} render={() => <DatasetPageHighlights dataset={dataset} />} />
          <Route exact path={`${match.url}/about`} render={() => <DatasetPageAbout dataset={dataset} />} />
        </Switch>
      </div>
    );
  }
}

const mapStateToProps = (storeState: IRootState) => ({
  datasetsById: storeState.dataSet.entitiesById
});

const mapDispatchToProps = {
  showHeader,
  hideHeader
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DatasetPage);
