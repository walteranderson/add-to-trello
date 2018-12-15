import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'

import SettingsPage from '../components/SettingsPage'
import configureStore from '../redux/store'
import * as Trello from '../lib/trello'

if (!Trello.isAuthorized()) {
  Trello.authorize()
    .catch(err => console.error(err))
}

const store = configureStore()

render(
  <Provider store={store}>
    <SettingsPage />
  </Provider>,
  document.getElementById('root')
)
