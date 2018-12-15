import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'

import PopupPage from '../components/PopupPage'
import configureStore from '../redux/store'
import { openSettings } from '../lib/browser'
import { isAuthorized } from '../lib/trello'

if (!isAuthorized()) {
  openSettings();
}

const store = configureStore()

render(
  <Provider store={store}>
    <PopupPage />
  </Provider>,
  document.getElementById('root')
)
