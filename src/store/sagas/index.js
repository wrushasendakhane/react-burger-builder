import { all, takeEvery } from "redux-saga/effects"
import * as actionTypes from "../actions/actionTypes"
import { purchaseBurgerSaga, fetchOrdersSaga } from "./order"
import { initIngredientsSaga } from "./burgerBuilder";
import { checkAuthStateSaga, authSaga, logoutSaga, checkAuthTimeoutSaga } from "./auth";


export function* watchAuth() {
  yield all([
    takeEvery(actionTypes.AUTH_CHECK_STATE_SAGA, checkAuthStateSaga),
    takeEvery(actionTypes.AUTH_SAGA, authSaga),
    takeEvery(actionTypes.AUTH_LOGOUT_SAGA, logoutSaga),
    takeEvery(actionTypes.AUTH_CHECK_TIMEOUT_SAGA, checkAuthTimeoutSaga)
  ])
}
export function* watchBurgerBuilder() {
  yield takeEvery(actionTypes.SET_INGREDIENTS_SAGA, initIngredientsSaga)

}

export function* watchOrder() {
  yield takeEvery(actionTypes.PURCHASE_BURGER_SAGA, purchaseBurgerSaga);
  yield takeEvery(actionTypes.FETCH_ORDER_SAGA, fetchOrdersSaga);
}





