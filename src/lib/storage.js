const localStorage = window.localStorage

export const REDUX_KEY = 'redux'
export const TRELLO_KEY = 'trello_token'

/**
 * get a value from localStorage.
 *
 * @param  {String} key - localStorage key to search for.
 * @return {mixed}      - result of JSON parsing contents
 */
export const get = (key, toJson = true) => {
  const raw = localStorage.getItem(key)

  if (toJson) {
    return JSON.parse(raw)
  }

  return raw
}

/**
 * set a value in localStorage.
 *
 * @param  {String} key - localStorage key to use
 * @param  {mixed}  val - what you want to save
 * @return {void}
 */
export const set = (key, val) => {
  const json = JSON.stringify(val)
  localStorage.setItem(key, json)
}

/**
 * clear a value from localstorage. If no key given,
 * clear everything.
 *
 * @param  {String} key - localStorage key to use
 * @return {void}
 */
export const clear = (key = null) => {
  if (key) {
    localStorage.removeItem(key)
    return
  }

  localStorage.removeItem(REDUX_KEY)
  localStorage.removeItem(TRELLO_KEY)
}
