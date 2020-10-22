import React, { useEffect } from 'react';
import {
  Layout,
  Menu,
  Breadcrumb,
  Divider,
  Avatar,
  Row,
  Col,
  Dropdown,
} from 'antd';
import {
  UserOutlined,
  LaptopOutlined,
  NotificationOutlined,
} from '@ant-design/icons';
import styled from 'styled-components';
import StatusTable from './StatusTable';
import LogDownload from './LogDownload';
import {
  loadDeviceList,
  useDashBoardDispatch,
} from '../../contexts/DashboardContext';
// import './Dashboard.css';
import axios from 'axios';
import DashboardHeader from './DashboardHeader';

const { SubMenu } = Menu;
const { Header, Content, Footer, Sider } = Layout;

function Dashboard(): JSX.Element {
  const dispatch = useDashBoardDispatch();

  useEffect(() => {
    loadDeviceList(dispatch).then(r => r);
  }, []);

  return (
    <>
      <Layout>
        <DashboardHeader />
        <Content>
          <Layout>
            <Content style={{ padding: '0 100px', minHeight: 280 }}>
              <StatusTable />
            </Content>
          </Layout>
        </Content>
        <Divider plain style={{ marginTop: 0 }} />
        <Content>
          <Layout>
            <Content style={{ padding: '0 100px', minHeight: 280 }}>
              <LogDownload />
            </Content>
          </Layout>
        </Content>
        <Divider plain style={{ marginBottom: 0 }} />
        {/*<Footer style={{ height: '40px', lineHeight: '40px' }}>*/}
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
      </Layout>
    </>
  );
}

export default Dashboard;
