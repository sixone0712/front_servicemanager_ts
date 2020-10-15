import React from 'react';
import './App.css';
import { Switch, Route } from 'react-router-dom';

import Login from './components/Login/Login';
import Dashboard from './components/Dashboard';

import { compose } from 'redux';
import { DashBoardContextProvider } from './contexts/DashboardContext';

const Provider = compose(DashBoardContextProvider);

function App(): JSX.Element {
  return (
    <Provider>
      <div className="App">
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/dashboard" component={Dashboard} />
        </Switch>
      </div>
    </Provider>
  );
}

export default App;
