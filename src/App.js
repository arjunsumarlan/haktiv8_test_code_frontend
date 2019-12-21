import React, { Component } from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
// import { renderRoutes } from 'react-router-config';
import './App.scss';

const loading = () => <div className="animated fadeIn pt-3 text-center">Loading...</div>;

// Containers
const DefaultLayout = React.lazy(() => import('./containers/DefaultLayout'));

class App extends Component {

  render() {
    return (
      <Router>
          <React.Suspense fallback={loading()}>
            <Switch>
              <Route path="/" name="Movies" render={props => <DefaultLayout {...props}/>} />
            </Switch>
          </React.Suspense>
      </Router>
    );
  }
}

export default App;
