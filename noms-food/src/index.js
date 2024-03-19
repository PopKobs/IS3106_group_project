import React from 'react';
import ReactDOM from 'react-dom';
import { 
  BrowserRouter as Router, 
  Route, 
  Switch, 
  Redirect 
} from 'react-router-dom';
import './index.css';
import Signup from './signup';
import reportWebVitals from './reportWebVitals';
import LandingPage from './landingpage'; // Import your components
import CreateListing from './vendor/CreateListing';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Switch>
        <Route component={LandingPage} exact path="/" />
        <Route component={Signup} exact path="/signup" />
        <Route component={CreateListing} exact path="/createlisting" />
        {/* Default Route */}
        <Route render={() => <Redirect to="/" />} />
      </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
