import React from 'react';
import { Avatar, Col, Dropdown, Layout, Menu, Row, Space } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { RowProps } from 'antd/lib/row';

import { FaUserCircle } from 'react-icons/fa';

const { Header } = Layout;

const BoardHeader = styled(Header)`
  height: 56px;
  box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.2), 0 4px 5px 0 rgba(0, 0, 0, 0.14),
    0 1px 10px 0 rgba(0, 0, 0, 0.12);
  z-index: 500;
`;

const HeaderRow = styled(Row)`
  min-width: 1050px;
  height: 56px;
`;

const Title = styled(Col)`
  color: white;
  line-height: 56px;
  font-size: 1.25rem;
  height: 56px;
  font-weight: bold;
`;

const User = styled(Col)`
  color: white;
  height: 35px;
`;
const UserName = styled(Col)`
  line-height: 35px;
  font-size: 1rem;
  height: 35px;
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

function DashboardHeader(): JSX.Element {
  return (
    <BoardHeader>
      <HeaderRow justify="space-between" align="middle">
        <Title>Service Manager</Title>
        <User>
          <Dropdown overlay={menu} trigger={['click']}>
            <a onClick={e => e.preventDefault()}>
              <Row align={'middle'}>
                <Space>
                  <FaUserCircle size={22} />
                  <UserName>Administrator</UserName>
                </Space>
              </Row>
            </a>
          </Dropdown>
        </User>
      </HeaderRow>
    </BoardHeader>
  );
}

export default DashboardHeader;
