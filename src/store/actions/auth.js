import * as actionTypes from "./actionTypes"

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START
  }
}

export const authSuccess = (token, userId) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    token: token,
    userId: userId,
  }
}

export const authFail = (error) => {
  return {
    type: actionTypes.AUTH_FAIL,
    error: error
  }
}

export const logout = () => {
  return {
    type: actionTypes.AUTH_LOGOUT_SAGA,
  }
}

export const logoutSucceed = () => {
  return {
    type: actionTypes.AUTH_LOGOUT
  }
}

export const checkAuthTimeout = (expirationTime) => {
  return {
    type: actionTypes.AUTH_CHECK_TIMEOUT_SAGA,
    expirationTime: expirationTime
  }
}

export const auth = (payload, isSignup) => {
  return {
    type: actionTypes.AUTH_SAGA,
    payload: payload,
    isSignup: isSignup
  }
}

export const checkAuthState = () => {
  return {
    type: actionTypes.AUTH_CHECK_STATE_SAGA
  }
}

export const setAuthRedirectPath = (path) => {
  return {
    type: actionTypes.SET_AUTH_REDIRECT_PATH,
    path: path
  }
}