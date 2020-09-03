import { put, all, call, delay } from 'redux-saga/effects';
import * as actions from "../actions";
import axios from "axios";


export function* logoutSaga(action) {
  yield all([
    call([localStorage, "removeItem"], "token"),
    call([localStorage, "removeItem"], "userId"),
    call([localStorage, "removeItem"], "expirationDate")
  ])
  yield put(actions.logoutSucceed());
}

export function* checkAuthTimeoutSaga(action) {
  yield delay(action.expirationTime * 1000);
  yield put(actions.logout());
}

export function* checkAuthStateSaga(action) {
  const token = yield localStorage.getItem("token");
  if (!token) {
    yield put(actions.logout());
  } else {
    const expirationDate = yield new Date(localStorage.getItem("expirationDate"))
    if (expirationDate < new Date()) {
      yield put(actions.logout());
    } else {
      const userId = yield localStorage.getItem("userId");
      yield put(actions.authSuccess(token, userId));
      yield put(actions.checkAuthTimeout((expirationDate - new Date()) / 1000))
    }
  }
}

export function* authSaga(action) {
  const apiKey = process.env.REACT_APP_GOOGLE_API_KEY
  let authUrl = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key="
  if (action.isSignup) {
    authUrl = "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key="
  }
  yield put(actions.authStart());
  try {
    const response = yield axios.post(authUrl + apiKey, action.payload);
    const { idToken, localId, expiresIn } = response.data
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    localStorage.setItem("token", idToken);
    localStorage.setItem("userId", localId);
    localStorage.setItem("expirationDate", expirationDate);
    yield put(actions.authSuccess(idToken, localId))
    yield put(actions.checkAuthTimeout(expiresIn));
  } catch (err) {
    const { error } = err.response.data;
    yield put(actions.authFail(error.message))
  }
}