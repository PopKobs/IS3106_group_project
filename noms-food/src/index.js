import React from 'react';
<<<<<<< HEAD
import ReactDOM from 'react-dom/client';
import 'firebase/auth';
import 'firebase/firestore';
=======
import ReactDOM from 'react-dom';
<<<<<<< HEAD
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
>>>>>>> 607bd612e51a790852ff8317ad5b113e86e0454c
=======
import { 
  BrowserRouter as Router, 
  Route, 
  Switch, 
  Redirect 
} from 'react-router-dom';
>>>>>>> 3f6bc04e1b471796374f5024d222c36ae227f2cf
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
