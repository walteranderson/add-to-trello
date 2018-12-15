import update from 'immutability-helper'

export const TRELLO_REQUEST_ORGS = 'REQUEST_ORGS'
export const requestOrgs = () => ({
  type: TRELLO_REQUEST_ORGS
})

export const TRELLO_RECEIVE_ORGS = 'RECEIVE_ORGS'
export const receiveOrgs = organizations => ({
  type: TRELLO_RECEIVE_ORGS,
  organizations,
  receivedAt: Date.now()
})

export const fetchAllOrgs = () => {
  return dispatch => {
    dispatch(requestOrgs())
  }
}

export default function trello (state = {}, action) {
  switch (action.type) {
    case TRELLO_RECEIVE_ORGS:
      return update(state, {
        organizations: { $set: action.organizations },
        receivedAt: { $set: action.receivedAt }
      })
    default:
      return state
  }
}
