import React from 'react'
import { Image } from 'semantic-ui-react'
import styled from 'styled-components'

const Container = styled.div`
  background-color: #f5f6f7;
  height: 190px;
  border-bottom: 1px solid #dfe3e6;
  padding: 20px;
  margin-bottom: 20px;
`

const Center = styled.div`
  margin: 15px auto;
  width: 50%;
  text-align: center;
  img {
    display: inline !important;
  }
`

const Text = styled.span`
  font-size: 2em;
  font-weight: lighter;
  font-family: sans-serif;
`

const Jumbotron = () => (
  <Container className='jumbotron'>
    <Center>
      <Text>Add to</Text>
      <Image src='images/trello-logo-large.png' size='medium' centered />
    </Center>
  </Container>
)

export default Jumbotron
