import React, { useEffect } from 'react';
import './App.css';
import { Redirect, Route, Switch, useHistory } from 'react-router-dom';
import { compose } from 'redux';
import { DashBoardContextProvider } from './contexts/DashboardContext';
import Login from './components/Login/Login';
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
          <Route path={DEFINE.URL_PAGE_ROOT} exact component={RootPage} />
          <Route path={DEFINE.URL_PAGE_LOGIN} component={Login} />
          <Route path={DEFINE.URL_PAGE_DASHBOARD} component={Dashboard} />
          <Route path={DEFINE.URL_PAGE_NOT_FOUND} component={NotFound} />
          <Redirect path="*" to={DEFINE.URL_PAGE_NOT_FOUND} />
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
        history.push(DEFINE.URL_PAGE_DASHBOARD_SYSTEM);
      } catch (e) {
        history.push(DEFINE.URL_PAGE_LOGIN);
      }
    }
    isValidLogin().then(res => res);
  });
  return <></>;
}
