import React, { Component } from "react";
import Burger from "../../components/Burger/Burger";
import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import Modal from "../../components/UI/Modal/Modal";
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary";
import Aux from "../../hoc/Aux/Aux";
import axios from "../../axios-orders";
import Spinner from "../../components/UI/Spinner/Spinner";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
import { connect } from "react-redux";
import {
  addIngredient,
  removeIngredient,
  initIngredients,
  purchaseInit,
  setAuthRedirectPath,
} from "../../store/actions/index";

class BurgerBuilder extends Component {
  state = {
    purchasing: false,
    loading: false,
  };

  componentDidMount() {
    this.props.onInitIngredients();
  }
  purchaseHandler = () => {
    if (this.props.isAuthenticated) {
      this.setState({ purchasing: true });
    } else {
      this.props.onSetAuthRedirectPath("/checkout");
      this.props.history.push("/auth");
    }
  };

  purchaseCancelHandler = () => {
    this.setState({ purchasing: false });
  };

  purchaseContinueHandler = () => {
    this.props.onInitPurchased();
    this.props.history.push("/checkout");
  };

  updatePurchasable = () => {
    const totalIngredients = Object.values(this.props.ingrs).reduce(
      (sum, el) => {
        return sum + el;
      },
      0
    );
    return totalIngredients > 0;
  };

  render() {
    let disabledInfo = {
      ...this.props.ingrs,
    };

    for (const key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0;
    }
    let orderSummary = null;

    let burger = this.props.error ? (
      <p>Ingredients can't be loaded!</p>
    ) : (
      <Spinner />
    );

    if (this.props.ingrs) {
      burger = (
        <Aux>
          <Burger ingredients={this.props.ingrs} />
          <BuildControls
            ingredientAdded={this.props.onIngredientAdded}
            ingredientRemoved={this.props.onIngredientRemoved}
            disabled={disabledInfo}
            price={this.props.price}
            purchasable={!this.updatePurchasable()}
            ordered={this.purchaseHandler}
            isAuthenticated={this.props.isAuthenticated}
          />
        </Aux>
      );
      orderSummary = (
        <OrderSummary
          ingredients={this.props.ingrs}
          purchaseCancelled={this.purchaseCancelHandler}
          purchaseContinued={this.purchaseContinueHandler}
          price={this.props.price}
        />
      );
    }

    if (this.state.loading) {
      orderSummary = <Spinner />;
    }

    return (
      <Aux>
        <Modal
          show={this.state.purchasing}
          modalClosed={this.purchaseCancelHandler}
        >
          {orderSummary}
        </Modal>
        {burger}
      </Aux>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ingrs: state.burgerBuilder.ingredients,
    price: state.burgerBuilder.totalPrice,
    error: state.burgerBuilder.error,
    isAuthenticated: state.auth.token !== null,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onIngredientAdded: (ingredientName) =>
      dispatch(addIngredient(ingredientName)),
    onIngredientRemoved: (ingredientName) =>
      dispatch(removeIngredient(ingredientName)),
    onInitIngredients: () => dispatch(initIngredients()),
    onInitPurchased: () => dispatch(purchaseInit()),
    onSetAuthRedirectPath: (path) => dispatch(setAuthRedirectPath(path)),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandler(BurgerBuilder, axios));
