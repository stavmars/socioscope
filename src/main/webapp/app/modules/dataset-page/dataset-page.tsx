import React from 'react';
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';
import { hideHeader, showHeader } from 'app/shared/reducers/header';
import './dataset-page.scss';
import DatasetPageVis from 'app/modules/dataset-page/dataset-page-vis';
import DatasetPageHighlights from 'app/modules/dataset-page/dataset-page-highlights';
import DatasetPageAbout from 'app/modules/dataset-page/dataset-page-about';
import Header from 'app/shared/layout/header/header';
import DatasetPageTabMenu from 'app/modules/dataset-page/dataset-page-tab-menu';

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
      <div className={`background ${dataset.colorScheme}`}>
        <Switch>
          <Route path={`${match.url}/data`} render={() => <Header isFixed={false} className={dataset.colorScheme} />} />
          <Route path={`${match.url}`} render={() => <Header isFixed className={dataset.colorScheme} />} />
        </Switch>
        <div className="dataset-page">
          <Switch>
            <Route path={`${match.url}/data`} render={() => <DatasetPageTabMenu dataset={dataset} {...this.props} isMinimized />} />
            <Route path={`${match.url}/`} render={() => <DatasetPageTabMenu dataset={dataset} {...this.props} />} />
          </Switch>

          <Switch>
            <Route path={`${match.url}/data`} render={() => <DatasetPageVis dataset={dataset} {...this.props} />} />
            <Route exact path={`${match.url}/`} render={() => <DatasetPageHighlights dataset={dataset} {...this.props} />} />
            <Route exact path={`${match.url}/about`} render={() => <DatasetPageAbout dataset={dataset} {...this.props} />} />
          </Switch>
        </div>
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
