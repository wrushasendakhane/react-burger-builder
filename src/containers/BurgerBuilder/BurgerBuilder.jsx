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
import * as actionTypes from "../../store/actions";

class BurgerBuilder extends Component {
  state = {
    purchasing: false,
    loading: false,
    error: false,
  };

  componentDidMount() {
    // axios
    //   .get("https://react-burger-builder-54831.firebaseio.com/ingredients.json")
    //   .then((response) => {
    //     this.setState({ ingredients: response.data });
    //   })
    //   .catch((error) => {
    //     this.setState({ error: true });
    //   });
  }
  purchaseHandler = () => {
    this.setState({ purchasing: true });
  };

  purchaseCancelHandler = () => {
    this.setState({ purchasing: false });
  };

  purchaseContinueHandler = () => {
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

    let burger = this.state.error ? (
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
    ingrs: state.ingredients,
    price: state.totalPrice,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onIngredientAdded: (ingredientName) =>
      dispatch({
        type: actionTypes.ADD_INGREDIENT,
        ingredientName: ingredientName,
      }),
    onIngredientRemoved: (ingredientName) =>
      dispatch({
        type: actionTypes.REMOVE_INGREDIENT,
        ingredientName: ingredientName,
      }),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandler(BurgerBuilder, axios));
