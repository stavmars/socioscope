import React from 'react';
import { translate, Translate } from 'react-jhipster';
import { Image, List, Icon, Header, Menu, Segment, Container, Button } from 'semantic-ui-react';
import { NavLink as Link, NavLink } from 'react-router-dom';
import { toggleMobileVisMenu } from 'app/shared/reducers/header';
import { connect } from 'react-redux';

export class MobileVisMenu extends React.Component<DispatchProps> {
  render() {
    return (
      <div className="mobile-vis-menu">
        <List relaxed="very">
          <List.Item>
            <List.Header>Διαμορφώστε το γράφημα</List.Header>
            <List.Icon onClick={this.props.toggleMobileVisMenu} name="cancel" size="big" style={{ marginTop: '-8%' }} />
          </List.Item>
        </List>
      </div>
    );
  }
}

const mapDispatchToProps = { toggleMobileVisMenu };

type DispatchProps = typeof mapDispatchToProps;

export default connect(
  null,
  mapDispatchToProps
)(MobileVisMenu);
