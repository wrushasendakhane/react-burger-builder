import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import classes from "./Auth.module.css";
import Button from "../../components/UI/Button/Button";
import * as actions from "../../store/actions";
import Spinner from "../../components/UI/Spinner/Spinner";
class Auth extends Component {
  state = {
    email: "",
    password: "",
    isSignup: true,
  };

  componentDidMount() {
    if (!this.props.buildingBurger && this.props.authRedirectPath !== "/") {
      this.props.setAuthRedirectPath();
    }
  }

  changeHandler = (e) => {
    const changeField = { [e.target.name]: e.target.value };
    this.setState((prevState) => {
      return {
        ...prevState,
        ...changeField,
      };
    });
  };

  toggleAuthModeHandler = () => {
    this.setState((prevState) => {
      return {
        ...prevState,
        isSignup: !prevState.isSignup,
      };
    });
  };

  submitHandler = (e) => {
    e.preventDefault();
    const payload = {
      email: this.state.email,
      password: this.state.password,
      returnSecureToken: true,
    };
    this.props.onAuth(payload, this.state.isSignup);
  };
  render() {
    let form = (
      <div>
        {this.props.error ? (
          <div className="alert alert-danger">{this.props.error}</div>
        ) : null}
        <div className="form-group">
          <input
            type="email"
            className="form-control"
            name="email"
            placeholder="Email Address"
            onChange={this.changeHandler}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            className="form-control"
            name="password"
            placeholder="Password"
            onChange={this.changeHandler}
          />
        </div>
      </div>
    );

    if (this.props.loading) {
      form = <Spinner />;
    }

    let authRedirect = null;
    if (this.props.isAuthenticated) {
      authRedirect = <Redirect to={this.props.authRedirectPath} />;
    }
    return (
      <div className={classes.Auth}>
        {authRedirect}
        <form onSubmit={this.submitHandler}>
          {form}
          <Button btnType="Success">SUBMIT</Button>
        </form>
        <Button btnType="Danger" clicked={this.toggleAuthModeHandler}>
          SWITCH TO {this.state.isSignup ? "SIGNIN" : "SIGNUP"}
        </Button>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    error: state.auth.error,
    loading: state.auth.loading,
    isAuthenticated: state.auth.token !== null,
    buildingBurger: state.burgerBuilder.totalPrice > 4,
    authRedirectPath: state.auth.authRedirectPath,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onAuth: (payload, isSignup) => dispatch(actions.auth(payload, isSignup)),
    onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath("/")),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Auth);
