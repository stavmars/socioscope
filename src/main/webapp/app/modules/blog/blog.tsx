import './blog.scss';
import React from 'react';
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { showHeader } from 'app/shared/reducers/header';
import BlogFeed from 'app/modules/blog/blog-feed';
import BlogPage from 'app/modules/blog/blog-page';
import Header from 'app/shared/layout/header/header';

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
            <Route exact path={`${match.url}/six-dogs-event`} render={() => <BlogPage page="six-dogs-event" />} />
            <Route exact path={`${match.url}/press-release`} render={() => <BlogPage page="press-release" />} />
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
