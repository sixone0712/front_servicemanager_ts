import React from 'react';
import './App.css';
import { Switch, Route } from 'react-router-dom';

import Login from './components/Login/Login';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <div className="App">
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/dashboard" component={Dashboard} />
      </Switch>
    </div>
  );
}

export default App;
