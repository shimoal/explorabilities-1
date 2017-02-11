import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, browserHistory, IndexRedirect} from 'react-router';
import App from './app.jsx';
import Auth from './auth/auth.jsx';
import authHelpers from './auth/auth-helpers.js';
import Signin from './auth/signin.jsx';
import Signup from './auth/signup.jsx';
import Explore from './components/Explore.jsx';
import MyPlaces from './components/MyPlaces.jsx';
import axios from 'axios';

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path="/auth" component={Auth}>
      <Route path="/auth/signin" component={Signin}/>
      <Route path="/auth/signup" component={Signup}/>
    </Route>
    <Route path="/" component={App}>
      <IndexRedirect to="/explore" />
      <Route path="/explore" component={Explore} onEnter={requireAuth}/>
      <Route path="/myplaces" component={MyPlaces} onEnter={requireAuth}/>
    </Route>
  </Router>, document.getElementById('app'));

const blah = () => { console.log("I'm here to make requireAuth asynchronous!"); };

//verifies the user's token serverside.
//check out line 60 in server/db/users/usersController.js
function requireAuth(nextState, replace, blah) {
  function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) === ' ') { c = c.substring(1); }
      if (c.indexOf(name) !== -1) { return c.substring(name.length, c.length); }
    }
    return "";
  }  
  var tokenFromCookie = getCookie('token');
  if (tokenFromCookie) {
    localStorage.token = tokenFromCookie; 
  }
  // console.log(document.cookie);
  // if (document.cookie) {
  //   var token = document.cookie.slice(6);
  //   axios.get('/users/auth', {
  //     headers: { token: token || null }
  //   })
  //   .then((res) => {
  //     console.log(res);
  //     //res.data.user = user email
  //     //res.data.id = user id
  //     blah(); //requireauth doesn't exit until I'm called! I do nothing!
  //   })
  //   .catch((err) => {
  //     replace({
  //       pathname: '/auth/signin',
  //       state: {
  //         nextPathName: nextState.location.pathname
  //       }
  //     });
  //     blah(); //I also do nothing!
  //   });    
  // } else {
  axios.get('/users/auth', {
    headers: { token: localStorage.token || null }
  })
  .then((res) => {
    console.log(res);
    //res.data.user = user email
    //res.data.id = user id
    blah(); //requireauth doesn't exit until I'm called! I do nothing!
  })
  .catch((err) => {
    replace({
      pathname: '/auth/signin',
      state: {
        nextPathName: nextState.location.pathname
      }
    });
    blah(); //I also do nothing!
  });  
  // }
}
