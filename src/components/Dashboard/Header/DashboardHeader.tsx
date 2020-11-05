import React from 'react';
import { Col, Dropdown, Layout, Menu, Row, Space } from 'antd';
import styled from 'styled-components';

import { FaUserCircle } from 'react-icons/fa';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import * as DEFINE from '../../../define';

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
  line-height: 30px;
  font-size: 1.25rem;
  height: 30px;
  font-weight: bold;
`;

const User = styled(Col)`
  color: white;
  height: 30px;
`;
const UserName = styled(Col)`
  line-height: 30px;
  font-size: 1rem;
  height: 30px;
  margin-left: 10px;
`;

const menu = (history: any) => {
  return (
    <Menu>
      <Menu.Item
        key="0"
        onClick={async () => {
          try {
            await axios.get(DEFINE.URL_LOGOUT);
          } catch (e) {
            console.error(e);
          }

          history.push(DEFINE.URL_PAGE_LOGIN);
        }}
        style={{ width: '135px', textAlign: 'center' }}
      >
        LogOut
        {/* <a href="http://www.alipay.com/">1st menu item</a> */}
      </Menu.Item>
    </Menu>
  );
};

function DashboardHeader(): JSX.Element {
  const history = useHistory();
  return (
    <BoardHeader>
      <HeaderRow justify="space-between" align="middle">
        <Title>Service Manager</Title>
        <User>
          <Dropdown overlay={() => menu(history)} trigger={['click']}>
            <a onClick={e => e.preventDefault()}>
              <Row
                justify="center"
                align="middle"
                style={{ height: '30px', color: 'white' }}
              >
                <FaUserCircle size={22} />
                <UserName>Administrator</UserName>
              </Row>
            </a>
          </Dropdown>
        </User>
      </HeaderRow>
    </BoardHeader>
  );
}

export default DashboardHeader;
