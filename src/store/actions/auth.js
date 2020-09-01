import * as actionTypes from "./actionTypes"
import axios from "axios"

const authStart = () => {
  return {
    type: actionTypes.AUTH_START
  }
}

const authSuccess = (token, userId) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    token: token,
    userId: userId,
  }
}

const authFail = (error) => {
  return {
    type: actionTypes.AUTH_FAIL,
    error: error
  }
}

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  localStorage.removeItem("expirationDate");
  return {
    type: actionTypes.AUTH_LOGOUT,
  }
}

const checkAuthTimeout = (expirationTime) => {
  return dispatch => {
    setTimeout(() => dispatch(logout()), expirationTime * 1000);
  }
}

//https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]
//https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[API_KEY]
// AIzaSyBLE4PRRmL8sfQbhGy2cVBlZ5UElBwK1ZY
export const auth = (payload, isSignup) => {
  return dispatch => {
    const apiKey = "AIzaSyBLE4PRRmL8sfQbhGy2cVBlZ5UElBwK1ZY"
    let authUrl = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key="
    if (isSignup) {
      authUrl = "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key="
    }
    console.log(payload);
    dispatch(authStart());
    axios.post(authUrl + apiKey, payload)
      .then(response => {
        const { idToken, localId, expiresIn } = response.data
        const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
        localStorage.setItem("token", idToken);
        localStorage.setItem("userId", localId);
        localStorage.setItem("expirationDate", expirationDate);
        dispatch(authSuccess(idToken, localId))
        dispatch(checkAuthTimeout(expiresIn));
      })
      .catch(err => {
        const { error } = err.response.data;
        dispatch(authFail(error.message))
      });
  }
}

export const checkAuthState = () => {
  return dispatch => {
    const token = localStorage.getItem("token");
    if (!token) {
      dispatch(logout());
    } else {
      const expirationDate = new Date(localStorage.getItem("expirationDate"))
      if (expirationDate < new Date()) {
        dispatch(logout());
      } else {
        const userId = localStorage.getItem("userId");
        dispatch(authSuccess(token, userId));
        dispatch(checkAuthTimeout((expirationDate - new Date()) / 1000))
      }
    }
  }
}

export const setAuthRedirectPath = (path) => {
  return {
    type: actionTypes.SET_AUTH_REDIRECT_PATH,
    path: path
  }
}