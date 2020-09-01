import * as actionTypes from "./actionTypes";
import axios from "../../axios-orders";

const purchaseBurgerSuccess = (id, order) => {
  return {
    type: actionTypes.PURCHASE_BURGER_SUCCESS,
    id,
    order
  }
}

const purchaseBurgerFail = (error) => {
  return {
    type: actionTypes.PURCHASE_BURGER_FAIL,
    error: error
  }
}


const purchaseBurgerStart = () => {
  return {
    type: actionTypes.PURCHASE_BURGER_START
  }
}

export const purchaseBurger = (payload, token) => {
  return dispatch => {
    dispatch(purchaseBurgerStart());
    axios
      .post("/orders.json?auth=" + token, payload.order)
      .then((response) => {
        console.log(response.data)
        dispatch(purchaseBurgerSuccess(response.data.name, payload.order))
      })
      .catch((error) => {
        dispatch(purchaseBurgerFail())
      });
  }
}

export const purchaseInit = () => {
  return {
    type: actionTypes.PURCHASE_INIT
  }
}

const fetchOrdersSuccess = (orders) => {
  return {
    type: actionTypes.FETCH_ORDERS_SUCCESS,
    orders
  }
}

const fetchOrdersFail = (error) => {
  return {
    type: actionTypes.FETCH_ORDERS_FAIL,
    error: error
  }
}

const fetchOrdersStart = () => {
  return {
    type: actionTypes.FETCH_ORDERS_START
  }
}

export const fetchOrders = (token, userId) => {
  return dispatch => {
    dispatch(fetchOrdersStart())
    const queryParams = '?auth=' + token + '&orderBy="userId"&equalTo="' + userId + '"';
    axios
      .get("/orders.json" + queryParams)
      .then((response) => {
        const fetchedOrders = [];
        for (const key in response.data) {
          fetchedOrders.push({ ...response.data[key], id: key });
        }
        dispatch(fetchOrdersSuccess(fetchedOrders))
      })
      .catch((error) => dispatch(fetchOrdersFail(error)));
  }
}

