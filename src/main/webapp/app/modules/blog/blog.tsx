import './blog.scss';
import React from 'react';
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { showHeader } from 'app/shared/reducers/header';
import BlogFeed from 'app/modules/blog/blog-feed';
import Header from 'app/shared/layout/header/header';
import PrivateRoute from 'app/shared/auth/private-route';
import NewsEditor from 'app/modules/blog/news-editor';
import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';
import NewsDisplay from 'app/modules/blog/news-display';

// tslint:disable:jsx-no-lambda
export interface IBlogProp extends DispatchProps, RouteComponentProps<{ id: string }> {}

export class Blog extends React.Component<IBlogProp> {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.showHeader();
  }

  render() {
    const { match } = this.props;

    return (
      <div>
        <Route path={`${match.url}`} render={() => <Header isFixed />} />
        <div>
          <Switch>
            <PrivateRoute exact path={`${match.url}/editor/new`} component={NewsEditor} />
            <PrivateRoute path={`${match.url}/editor/:id/edit`} component={NewsEditor} />
            <ErrorBoundaryRoute path={`${match.url}/display/:id`} component={NewsDisplay} />
            <Route path={`${match.url}`} render={() => <BlogFeed />} />
          </Switch>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = { showHeader };

type DispatchProps = typeof mapDispatchToProps;

export default connect(
  null,
  mapDispatchToProps
)(Blog);
