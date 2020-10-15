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
import { getDeviceList } from '../../api/dashboard';
import { useLDashBoardDispatch } from '../../contexts/DashboardContext';
// import './Dashboard.css';

const { SubMenu } = Menu;
const { Header, Content, Footer, Sider } = Layout;

const HeaderTitle = styled.div`
  /* width: 120px;
  height: 31px;
  margin: 16px 28px 16px 0;
  float: left;
  line-height: 31px; */
  color: white;
  font-size: 20px;
`;

const menu: JSX.Element = (
  <Menu>
    <Menu.Item
      key="0"
      onClick={() => {
        alert('로그아웃');
      }}
    >
      LogOut
      {/* <a href="http://www.alipay.com/">1st menu item</a> */}
    </Menu.Item>
    <Menu.Divider />
    <Menu.Item key="1">2nd menu item</Menu.Item>
  </Menu>
);

function Dashboard(): JSX.Element {
  const dispatch = useLDashBoardDispatch();
  useEffect(() => {
    const fetchDeviceList = async () => {
      try {
        const resData = await getDeviceList();
        dispatch({ type: 'SET_DEVICE_LIST', deviceList: resData });
      } catch (e) {
        console.error(e);
      }
    };
    fetchDeviceList().then(r => r);
  }, []);

  return (
    <>
      <Layout>
        <Header>
          <Row justify="space-between" style={{ minWidth: '1050px' }}>
            <Col>
              <HeaderTitle>Service Manager</HeaderTitle>
            </Col>
            {/*
            <Menu theme="dark" mode="horizontal">
              <Menu.Item key="1">nav 1</Menu.Item>
            </Menu> 
            */}
            <Col>
              <Dropdown overlay={menu} trigger={['click']}>
                <a onClick={e => e.preventDefault()}>
                  <Avatar
                    icon={<UserOutlined style={{ verticalAlign: 0 }} />}
                  />
                </a>
              </Dropdown>
            </Col>
          </Row>
        </Header>
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
        <Footer />
      </Layout>
    </>
  );
}

export default Dashboard;
