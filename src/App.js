import React, { Component } from 'react';
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder';
import Layout from './hoc/Layout/Layout';

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
          {this.state.show ? <BurgerBuilder /> : null}
        </Layout>
      </div >
    );
  }

}

export default App;
