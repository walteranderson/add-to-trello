import * as storage from './storage'

window.Trello.setKey(process.env.TRELLO_APP_KEY)
window.Trello.setToken(storage.get(storage.TRELLO_KEY, false))

export const isAuthorized = () => {
  return !!storage.get(storage.TRELLO_KEY, false)
}

export const authorize = () => {
  return new Promise((resolve, reject) => {
    const name = 'Add to Trello'
    const expiration = 'never'
    const scope = {
      read: true,
      write: true,
      account: false
    }

    window.Trello.authorize({
      name,
      expiration,
      scope,
      success: resolve,
      error: reject
    })
  })
}

export const deauthorize = () => {
  window.Trello.deauthorize()
  storage.clear()
}

export const fetchAll = () => {
  return new Promise((resolve, reject) => {
    const options = {
      boards: 'open',
      board_lists: 'open',
      organizations: 'all'
    }

    Trello.rest('GET', 'members/me', options, resolve, reject)
  })
}
