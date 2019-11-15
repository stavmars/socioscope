import './about.scss';

import React, { createRef } from 'react';

import { connect } from 'react-redux';
import { getSession } from 'app/shared/reducers/authentication';
import { showHeader } from 'app/shared/reducers/header';
import { Grid, Header, Ref, Sticky } from 'semantic-ui-react';
import { NavHashLink } from 'react-router-hash-link';
import { translate } from 'react-jhipster';

export class About extends React.Component<DispatchProps> {
  contextRef = createRef();

  componentDidMount() {
    this.props.showHeader();
  }

  // only consider an event active if its event id is an odd number
  isActive = hash => (match, location) => {
    if (location.hash === hash) {
      return true;
    }
  };

  render() {
    return (
      <div className="about-page-view">
        <Header id="project" as="h1" className="about-page-title" content={translate('about.title')} textAlign="center" />
        <Ref innerRef={this.contextRef}>
          <Grid>
            <Grid.Row>
              <Grid.Column width={4} only="tablet computer">
                <Sticky context={this.contextRef} offset={110}>
                  <div className="about-page-menu">
                    <ul>
                      <li>
                        <NavHashLink isActive={this.isActive('#project')} smooth to="#project" replace={false}>
                          {translate('about.project')}
                        </NavHashLink>
                      </li>
                      <li>
                        <NavHashLink isActive={this.isActive('#team')} smooth to="#team" replace={false}>
                          {translate('about.team.title')}
                        </NavHashLink>
                      </li>
                      <li>
                        <NavHashLink isActive={this.isActive('#techTeam')} smooth to="#techTeam" replace={false}>
                          {translate('about.techTeam.title')}
                        </NavHashLink>
                      </li>
                    </ul>
                  </div>
                </Sticky>
              </Grid.Column>
              <Grid.Column computer={8} mobile={14}>
                <div className="about-page-content">
                  {translate('about.content')}
                  <br />
                  <br />
                  <br />
                  <br />
                  <h2 id="team">{translate('about.team.title')}</h2>
                  <span style={{ fontFamily: 'ProximaNovaBold' }}>{translate('about.team.iliou.name')}</span> /{' '}
                  {translate('about.team.iliou.role')}
                  <br />
                  <span style={{ fontFamily: 'ProximaNovaBold' }}>{translate('about.team.manina.name')}</span> /{' '}
                  {translate('about.team.manina.role')}
                  <br />
                  <span style={{ fontFamily: 'ProximaNovaBold' }}>{translate('about.team.kand.name')}</span> /{' '}
                  {translate('about.team.kand.role')}
                  <br />
                  <span style={{ fontFamily: 'ProximaNovaBold' }}>{translate('about.team.theoni.name')}</span> /{' '}
                  {translate('about.team.theoni.role')}
                  <br />
                  <span style={{ fontFamily: 'ProximaNovaBold' }}>{translate('about.team.tsig.name')}</span> /{' '}
                  {translate('about.team.tsig.role')}
                  <br />
                  <br />
                  <br />
                  <h2 id="techTeam">{translate('about.techTeam.title')}</h2>
                  <h3>{translate('about.techTeam.analysis')}</h3>
                  <span style={{ fontFamily: 'ProximaNovaBold' }}>{translate('about.techTeam.gpapas.name')}</span> /{' '}
                  {translate('about.techTeam.gpapas.role')}
                  <br />
                  <br />
                  <h3>{translate('about.techTeam.develop')}</h3>
                  <span style={{ fontFamily: 'ProximaNovaBold' }}>{translate('about.techTeam.stav.name')}</span> /{' '}
                  {translate('about.techTeam.stav.role')}
                  <br />
                  <span style={{ fontFamily: 'ProximaNovaBold' }}>{translate('about.techTeam.astgian.name')}</span> /{' '}
                  {translate('about.techTeam.astgian.role')}
                </div>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Ref>
      </div>
    );
  }
}

const mapDispatchToProps = { getSession, showHeader };

type DispatchProps = typeof mapDispatchToProps;

export default connect(
  null,
  mapDispatchToProps
)(About);
