import './home.scss';

import React from 'react';
import { HashLink } from 'react-router-hash-link';
import { connect } from 'react-redux';
import { translate } from 'react-jhipster';
import { getSession } from 'app/shared/reducers/authentication';
import { hideHeader, showHeader } from 'app/shared/reducers/header';

import { Container, Visibility } from 'semantic-ui-react';
import AppHeader from 'app/shared/layout/header/header';
import CardCarousel from 'app/modules/home/card-carousel';
import DatasetCard from 'app/modules/home/dataset-card';
import { translateEntityField } from 'app/shared/util/entity-utils';

export interface IHomeProp extends StateProps, DispatchProps {}

export class Home extends React.Component<IHomeProp> {
  componentDidMount() {
    this.props.getSession();
  }

  render() {
    const { datasetsById } = this.props;
    const elections = datasetsById['greek-election-results'];
    return (
      <div className="home-page-view">
        <div className="video">
          <video src="/content/images/Assets/kaleidoscopeanimation.mp4" loop muted autoPlay playsInline />
        </div>
        <Visibility once={false} onOffScreen={this.props.showHeader} onOnScreen={this.props.hideHeader}>
          <div style={{ marginBottom: 40 }}>
            <AppHeader className="home-page-header" isFixed={false} />
            <Container textAlign="center">
              <h1 className="home-page-view-title">{translate('home.title')}</h1>
              <h2 className="home-page-view-subtitle">{translate('home.subtitle')}</h2>
              <HashLink to="#discover" className="home-page-view-explore" replace={false}>
                {translate('home.explore')}
              </HashLink>
            </Container>
          </div>
        </Visibility>
        <div id="discover" style={{ height: 120 }} />
        <div className="dataset-cards">
          <CardCarousel>
            {elections.highlights
              ? elections.highlights.map(highlight => (
                  <DatasetCard
                    key={highlight.id}
                    title={translateEntityField(elections.name)}
                    dataset={elections}
                    headerImg="/content/images/Assets/Elections.svg"
                    highlight={highlight}
                  >
                    <div dangerouslySetInnerHTML={{ __html: translateEntityField(highlight.description) }} />
                  </DatasetCard>
                ))
              : null}
          </CardCarousel>
        </div>
      </div>
    );
  }
}

const mapStateToProps = storeState => ({
  account: storeState.authentication.account,
  isAuthenticated: storeState.authentication.isAuthenticated,
  datasetsById: storeState.dataSet.entitiesById
});

const mapDispatchToProps = { getSession, showHeader, hideHeader };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
