import React from "react";
import classes from "./NavigationItems.module.css";
import Navigationitem from "./NavigationItem/NavigationItem";
const navigationItems = (props) => {
  return (
    <ul className={classes.NavigationItems}>
      <Navigationitem link="/" active>
        Burger Builder
      </Navigationitem>
      <Navigationitem link="/">Checkout</Navigationitem>
    </ul>
  );
};

export default navigationItems;
