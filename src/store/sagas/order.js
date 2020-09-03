import { put } from "redux-saga/effects";
import axios from "../../axios-orders"
import * as actions from "../actions"

export function* fetchOrdersSaga(action) {
  yield put(actions.fetchOrdersStart())
  const queryParams = '?auth=' + action.token + '&orderBy="userId"&equalTo="' + action.userId + '"';
  try {
    const response = yield axios.get("/orders.json" + queryParams);
    const fetchedOrders = [];
    for (const key in response.data) {
      fetchedOrders.push({ ...response.data[key], id: key });
    }
    yield put(actions.fetchOrdersSuccess(fetchedOrders));
  } catch (error) {
    yield put(actions.fetchOrdersFail(error));
  }
}

export function* purchaseBurgerSaga(action) {
  yield put(actions.purchaseBurgerStart());
  try {
    const response = yield axios.post("/orders.json?auth=" + action.token, action.payload.order);
    yield put(actions.purchaseBurgerSuccess(response.data.name, action.payload.order));

  } catch (error) {
    yield put(actions.purchaseBurgerFail());
  }
} 