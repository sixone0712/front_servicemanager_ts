import React, { useEffect } from 'react';
import './App.css';
import { Switch, Route, Redirect, useHistory } from 'react-router-dom';
import { compose } from 'redux';
import { DashBoardContextProvider } from './contexts/DashboardContext';
import Login from './components/Login/Login';
import Login2 from './components/Login/Login2';
import Dashboard from './components/Dashboard';
import NotFound from './pages/404';
import axios from 'axios';
import * as DEFINE from './define';
import axiosConfig from './api/axiosConfig';

axiosConfig();
const Provider = compose(DashBoardContextProvider);

function App(): JSX.Element {
  return (
    <Provider>
      <div className="App">
        <Switch>
          <Route path="/" exact component={RootPage} />
          <Route path="/login" component={Login} />
          <Route path="/login2" component={Login2} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/notfound" component={NotFound} />
          <Redirect path="*" to="/notfound" />
        </Switch>
      </div>
    </Provider>
  );
}

export default App;

function RootPage() {
  const history = useHistory();
  useEffect(() => {
    async function isValidLogin() {
      try {
        await axios.get(DEFINE.URL_ME);
        history.push('/dashboard/system');
      } catch (e) {
        history.push('/login2');
      }
    }
    isValidLogin().then(res => res);
  });
  return <></>;
}
