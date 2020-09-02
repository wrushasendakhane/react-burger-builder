import React, { Component, Suspense } from 'react';
import { Switch, Route, withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder';
import Layout from './hoc/Layout/Layout';
import Logout from './containers/Auth/Logout';
import * as actions from "./store/actions";
import Spinner from './components/UI/Spinner/Spinner';

const Checkout = React.lazy(() => import('./containers/Checkout/Checkout'));
const Orders = React.lazy(() => import('./containers/Orders/Orders'));
const Auth = React.lazy(() => import('./containers/Auth/Auth'));

class App extends Component {

  componentDidMount() {
    this.props.onTryAutoSignup();
  }

  render() {
    let routes =
      <Switch>
        <Route path="/auth" render={(props) => <Suspense fallback={<Suspense />}><Auth {...props} /></Suspense>} />
        <Route path="/" exact component={BurgerBuilder} />
        <Redirect to="/" />
      </Switch>

    if (this.props.isAuthenticated) {
      routes = <Switch>
        <Route path="/checkout" render={(props) => <Suspense fallback={<Spinner />}><Checkout {...props} /></Suspense>} />
        <Route path="/orders" render={(props) => <Suspense fallback={<Spinner />}><Orders {...props} /></Suspense>} />
        <Route path="/auth" render={(props) => <Suspense fallback={<Spinner />}><Auth {...props} /></Suspense>} />
        <Route path="/logout" component={Logout} />
        <Route path="/" exact component={BurgerBuilder} />
        <Redirect to="/" />
      </Switch>
    }
    return (
      <div >
        <Layout>
          {routes}
        </Layout>
      </div >
    );
  }

}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onTryAutoSignup: () => dispatch(actions.checkAuthState())
  }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
