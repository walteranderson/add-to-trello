import React, { Component } from 'react'
import { Container } from 'semantic-ui-react'
import { openSettings } from '../lib/browser'
import { deauthorize } from '../lib/trello'
import LiveForm from './LiveForm'

export default class PopupPage extends Component {

  logout () {
    deauthorize();
    openSettings();
  }

  render () {
    const styles = { minWidth: '300px' }

    return (
      <Container style={styles}>
        <LiveForm />
        <div>
          <a href="#" onClick={openSettings}>Settings</a>
          <a href="#" style={{float: 'right' }} onClick={this.logout}>Logout</a>
        </div>
      </Container>
    )
  }
}
