import React, { Component } from 'react';
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder';
import Layout from './hoc/Layout/Layout';
import Checkout from './containers/Checkout/Checkout';
import { Switch, Route } from 'react-router-dom';
import Orders from './containers/Orders/Orders';

class App extends Component {
  //Below code to demonstrate old interceptors getting removed
  state = { show: true }

  // componentDidMount() {
  //   setTimeout(() => {
  //     this.setState({ show: false })
  //   }, 5000)
  // }

  render() {
    return (
      <div >
        <Layout>
          {/* {this.state.show ? <BurgerBuilder /> : null}
          {this.state.show ? <Checkout /> : null} */}
          <Switch>
            <Route path="/checkout" component={Checkout} />
            <Route path="/orders" component={Orders} />
            <Route path="/" component={BurgerBuilder} />
          </Switch>
        </Layout>
      </div >
    );
  }

}

export default App;
