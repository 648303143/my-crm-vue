import cookies from 'vue-cookies'

const TokenKey = 'Authorization'

export function getToken() {
  return cookies.get(TokenKey)
}

export function setToken(token) {
  return cookies.set(TokenKey, token, 60 * 60 * 9)
}

export function removeToken() {
  return cookies.remove(TokenKey)
}
