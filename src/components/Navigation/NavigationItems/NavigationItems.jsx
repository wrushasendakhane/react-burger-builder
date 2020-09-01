import React from "react";
import classes from "./NavigationItems.module.css";
import Navigationitem from "./NavigationItem/NavigationItem";
const navigationItems = (props) => {
  return (
    <ul className={classes.NavigationItems}>
      <Navigationitem link="/" exact>
        Burger Builder
      </Navigationitem>
      {props.isAuthenticated ? (
        <>
          <Navigationitem link="/orders">Orders</Navigationitem>
          <Navigationitem link="/logout">Logout</Navigationitem>
        </>
      ) : (
        <Navigationitem link="/auth">Authenticate</Navigationitem>
      )}
    </ul>
  );
};

export default navigationItems;
