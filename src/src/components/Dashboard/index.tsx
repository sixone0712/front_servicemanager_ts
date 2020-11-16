import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import DashboardHeader from './Header/DashboardHeader';
import SystemInfo from './System';
import { Col, Layout, Row } from 'antd';
import * as DEFINE from '../../define';

const { Footer } = Layout;

const DashboardFooter = (): JSX.Element => (
  <Footer
    style={{
      minWidth: '1050px',
      height: '50px',
      paddingTop: 0,
      paddingBottom: 0,
      backgroundColor: 'white',
    }}
  >
    <Row justify={'end'} align={'middle'} style={{ height: '50px' }}>
      <Col>Copyright CANON INC. 2020</Col>
    </Row>
  </Footer>
);

function Dashboard(): JSX.Element {
  return (
    <>
      <Layout>
        <DashboardHeader />
        <Switch>
          <Route
            path={DEFINE.URL_PAGE_DASHBOARD_SYSTEM}
            component={SystemInfo}
          />
          <Redirect path="*" to={DEFINE.URL_PAGE_NOT_FOUND} />
        </Switch>
        <DashboardFooter />
      </Layout>
    </>
  );
}

export default Dashboard;
