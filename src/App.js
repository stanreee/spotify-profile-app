import Login from './components/Login'
import MainPage from './components/dashboard/MainPage'

import { BrowserRouter as Router, Route } from 'react-router-dom'
import { useEffect } from 'react';
import { Redirect } from 'react-router-dom';

function App() {

  // let token = localStorage.getItem("access-token");
  // let refresh_token = localStorage.getItem("refresh-token");

  // // if local storage does not contain access token, retrieve it from query
  // if(token === null) {
  //   let search = window.location.search;
  //   let params = new URLSearchParams(search);

  //   token = params.get('access_token');
  //   refresh_token = params.get('refresh_token');

  //   localStorage.setItem("access-token", token);
  //   localStorage.setItem("refresh-token", refresh_token);
  //   localStorage.setItem("timestamp", Date.now);
  // }else{
  //   if(Date.now() - localStorage.getItem("timestamp") > 3600000) {
  //     token = null;
  //     refresh_token = null;
  //     localStorage.removeItem("access-token");
  //     localStorage.removeItem("refresh-token");
  //     localStorage.removeItem("timestamp");
  //     console.log("access token expired.");
  //   }else{
  //     console.log("Hello " + (Date.now() - localStorage.getItem("timestamp")));
  //   }
  // }

  // console.log(`token:${token}`);
  // console.log(`refresh-token:${refresh_token}`);

  let search = window.location.search;
  let params = new URLSearchParams(search);

  var token = params.get('access_token');
  var refresh_token = params.get('refresh_token');

  if(token && !localStorage.getItem("access-token")) {
    localStorage.setItem("access-token", token);
    localStorage.setItem("refresh-token", refresh_token);
    localStorage.setItem("timestamp", Date.now());
    
    console.log("token: " + token);
  }else{
    token = localStorage.getItem("access-token");
    refresh_token = localStorage.getItem("refresh-token");
  }
  
  
  return (
    // if token is null, show login page
    // problem here is that anybody could just manually enter queries and be taken to the main page
    token !== null ? <MainPage /> : <Login />
  );
}

export default App;
