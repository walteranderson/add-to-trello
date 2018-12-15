import { compose, createStore, applyMiddleware, combineReducers } from 'redux'
import logger from 'redux-logger'
import thunk from 'redux-thunk'
import persistState from 'redux-localstorage'

import trello from './modules/trello'
import fields from './modules/fields'

export default function configureStore () {
  const reducers = combineReducers({
    trello,
    fields
  })

  const enhancer = compose(
    applyMiddleware(logger, thunk),
    persistState()
  )

  return createStore(reducers, enhancer)
}
