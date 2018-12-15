import React from 'react'
import { Segment, Grid, Divider, Header, Icon } from 'semantic-ui-react'
import styled from 'styled-components'

const webstoreLink = 'https://chrome.google.com/webstore/detail/add-to-trello/engmocckoohpopiacajolojeobefbcec?hl=en'
const LeaveAReview = () => (
  <div>
    <Header icon>
      <Icon name='world' />
      <a href={webstoreLink}>Leave a Review</a>
    </Header>
  </div>
)

const FollowOnGithub = () => (
  <Header icon>
    <Icon name='github' />
    <a href='https://github.com/walteranderson/add-to-trello'>Follow on Github</a>
  </Header>
)

const Footer = () => (
  <div className='footer'>
    <Divider />
    <Segment padded='very' basic>
      <Grid columns={2} stackable textAlign='center'>

        <Grid.Row verticalAlign='middle'>
          <Grid.Column>
            <LeaveAReview />
          </Grid.Column>

          <Grid.Column>
            <FollowOnGithub />
          </Grid.Column>
        </Grid.Row>

      </Grid>
    </Segment>
  </div>
)

export default Footer
