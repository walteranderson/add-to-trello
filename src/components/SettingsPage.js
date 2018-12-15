import React, { Component, Fragment } from 'react'
import { Container, Grid, Image, Segment } from 'semantic-ui-react'
import Jumbotron from './Jumbotron'
import EditableForm from './EditableForm'

export default class SettingsPage extends Component {
  render () {
    return (
      <Fragment>
        <Jumbotron />

        <Container>
          <Grid columns={2}>
            <Grid.Column>
              <EditableForm />
            </Grid.Column>

            <Grid.Column>
              preview
            </Grid.Column>
          </Grid>
        </Container>

      </Fragment>
    )
  }
}
