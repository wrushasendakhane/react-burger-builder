import React, { Component } from "react";
import Button from "../../../components/UI/Button/Button";
import classes from "./ContactData.module.css";
import axios from "../../../axios-orders";
import Spinner from "../../../components/UI/Spinner/Spinner";
import unitedStates from "united-states";
import Joi from "joi-browser";
import _ from "lodash";
import classnames from "classnames";
import "bootstrap/dist/css/bootstrap.css";
class ContactData extends Component {
  state = {
    customer: {
      name: "",
      email: "",
      address1: "",
      address2: "",
      city: "",
      state: "CA",
      zip: "",
      deliveryMethod: "fastest",
    },
    errors: {},
    loading: false,
  };

  schema = {
    name: Joi.string().required().label("Name"),
    email: Joi.string().email().required().label("Email"),
    address1: Joi.string().required().label("Address Line 1"),
    address2: Joi.string().allow(null, "").label("Address Line 2"),
    city: Joi.string().required().label("City"),
    state: Joi.string().required().label("State"),
    zip: Joi.number().required().label("Zip"),
    deliveryMethod: Joi.string().required().label("Delivery Method"),
  };

  validate = () => {
    const options = { abortEarly: false };
    const { error } = Joi.validate(this.state.customer, this.schema, options);
    const errors = {};
    if (error && error.details) {
      error.details.map((error) => (errors[error.path[0]] = error.message));
    }
    this.setState({ errors });
  };

  validateProperty = (name, value) => {
    const obj = { [name]: value };
    const schema = { [name]: this.schema[name] };
    const { error } = Joi.validate(obj, schema);
    const errors = { ...this.state.errors };
    if (error && error.details) {
      errors[name] = error.details[0].message;
    } else {
      delete errors[name];
    }
    this.setState({ errors });
  };
  changeHandler = (e) => {
    e.preventDefault();
    this.validateProperty(e.target.name, e.target.value);
    const { customer } = this.state;
    customer[e.target.name] = e.target.value;
    this.setState(customer);
  };
  orderHandler = async (e) => {
    e.preventDefault();
    await this.validate();
    if (_.isEmpty(this.state.errors)) {
      console.log(this.props.ingredients);
      this.setState({ loading: true });
      const order = {
        ingredients: this.props.ingredients,
        price: this.props.totalPrice,
        customer: this.state.customer,
      };

      axios
        .post("/orders.json", order)
        .then((response) => {
          this.setState({ loading: false });
          this.props.history.push("/");
        })
        .catch((error) => {
          this.setState({ loading: false });
        });
    }
  };

  render() {
    const { customer, errors } = this.state;

    let form = (
      <form>
        <input
          className={classes.Input}
          type="text"
          name="name"
          placeholder="Your name"
        />
        <input
          className={classes.Input}
          type="email"
          name="email"
          placeholder="Your email"
        />
        <input
          className={classes.Input}
          type="text"
          name="street"
          placeholder="Your street"
        />
        <input
          className={classes.Input}
          type="text"
          name="postalCode"
          placeholder="Your postal code"
        />
        <Button btnType="Success" clicked={this.orderHandler}>
          ORDER
        </Button>
      </form>
    );

    let bootstrapForm = (
      <form onSubmit={this.orderHandler}>
        <div className="form-row">
          <div className="form-group col-md-6">
            <input
              type="text"
              className={classnames("form-control", {
                "is-invalid": errors.name,
                "is-valid": !_.isEmpty(errors) && !errors.name,
              })}
              name="name"
              placeholder="Name"
              value={customer.name}
              onChange={this.changeHandler}
            />
            {errors.name && (
              <div className="invalid-feedback">{errors.name}</div>
            )}
          </div>
          <div className="form-group col-md-6">
            <input
              type="email"
              className={classnames("form-control", {
                "is-invalid": errors.email,
                "is-valid": !_.isEmpty(errors) && !errors.email,
              })}
              name="email"
              placeholder="Email"
              value={customer.email}
              onChange={this.changeHandler}
            />
            {errors.email && (
              <div className="invalid-feedback">{errors.email}</div>
            )}
          </div>
        </div>
        <div className="form-group">
          <input
            type="text"
            className={classnames("form-control", {
              "is-invalid": errors.address1,
              "is-valid": !_.isEmpty(errors) && !errors.address1,
            })}
            name="address1"
            placeholder="1234 Main St"
            value={customer.address1}
            onChange={this.changeHandler}
          />
          {errors.address1 && (
            <div className="invalid-feedback">{errors.address1}</div>
          )}
        </div>
        <div className="form-group">
          <input
            type="text"
            className={classnames("form-control", {
              "is-invalid": errors.address2,
              "is-valid": !_.isEmpty(errors) && !errors.address2,
            })}
            name="address2"
            placeholder="Apartment, studio, or floor"
            value={customer.address2}
            onChange={this.changeHandler}
          />
          {errors.address2 && (
            <div className="invalid-feedback">{errors.address2}</div>
          )}
        </div>
        <div className="form-row">
          <div className="form-group col-md-4">
            <input
              type="text"
              className={classnames("form-control", {
                "is-invalid": errors.city,
                "is-valid": !_.isEmpty(errors) && !errors.city,
              })}
              name="city"
              placeholder="City"
              value={customer.city}
              onChange={this.changeHandler}
            />
            {errors.city && (
              <div className="invalid-feedback">{errors.city}</div>
            )}
          </div>
          <div className="form-group col-md-4">
            <select
              name="state"
              className={classnames("form-control", {
                "is-invalid": errors.state,
                "is-valid": !_.isEmpty(errors) && !errors.state,
              })}
              value={customer.state}
              onChange={this.changeHandler}
            >
              {unitedStates.map((state) => {
                return (
                  !state.isTerritory && (
                    <option key={state.abbr} value={state.abbr}>
                      {state.name}
                    </option>
                  )
                );
              })}
            </select>
            {errors.state && (
              <div className="invalid-feedback">{errors.state}</div>
            )}
          </div>
          <div className="form-group col-md-4">
            <input
              type="text"
              className={classnames("form-control", {
                "is-invalid": errors.zip,
                "is-valid": !_.isEmpty(errors) && !errors.zip,
              })}
              name="zip"
              placeholder="Zip"
              value={customer.zip}
              onChange={this.changeHandler}
            />
            {errors.zip && <div className="invalid-feedback">{errors.zip}</div>}
          </div>
        </div>
        <div className="form-group">
          <select
            name="deliveryMethod"
            className={classnames("form-control", {
              "is-invalid": errors.deliveryMethod,
              "is-valid": !_.isEmpty(errors) && !errors.deliveryMethod,
            })}
            value={customer.deliveryMethod}
            onChange={this.changeHandler}
          >
            <option value="fastest">Fastest</option>
            <option value="cheapest">Cheapest</option>
          </select>
          {errors.state && (
            <div className="invalid-feedback">{errors.state}</div>
          )}
        </div>
        <Button btnType="Success" disabled={!_.isEmpty(errors)}>
          ORDER
        </Button>
      </form>
    );

    if (this.state.loading) {
      form = <Spinner />;
      bootstrapForm = <Spinner />;
    }
    return (
      <div className={classes.ContactData}>
        <h4>Enter you Contact Data</h4>
        {/* {form} */}
        {bootstrapForm}
      </div>
    );
  }
}
export default ContactData;
