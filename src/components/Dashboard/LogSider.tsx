import React from 'react';
import { Layout, Menu } from 'antd';
import {
  useDashBoardState,
  useDashBoardDispatch,
} from '../../contexts/DashboardContext';

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

function LogSider(): JSX.Element {
  const dispatch = useDashBoardDispatch();
  const {
    deviceInfo: { list, success, error, failure, pending, selected },
  } = useDashBoardState();

  const onClick = ({
    item,
    key,
    keyPath,
    domEvent,
  }: {
    key: React.Key;
    keyPath: React.Key[];
    item: React.ReactInstance;
    domEvent: React.MouseEvent<HTMLElement>;
  }) => {
    // console.log('item', item);
    // console.log('key', key);
    // console.log('key', typeof key);
    // console.log('keyPath', keyPath);
    // console.log('domEvent', domEvent);
    dispatch({
      type: 'SELECT_DEVICE',
      selected: typeof key === 'number' ? JSON.stringify(key) : key,
    });
  };
  return (
    <Sider
      theme="light"
      width={250}
      style={{
        overflow: 'auto',
        height: '453px',
        // position: 'fixed',
      }}
    >
      <Menu
        theme="light"
        mode="inline"
        // defaultSelectedKeys={['1']}
        // style={{ height: '100%', borderRight: 0 }}
        style={{ height: '100%' }}
        onClick={onClick}
      >
        {/* <Menu.Item key={'ESP_01'}>ESP_01</Menu.Item>
        <Menu.Item key={'OTS_02'}>OTS_01</Menu.Item>
        <Menu.Item key={'OTS_03'}>OTS_02</Menu.Item>
        <Menu.Item key={'OTS_04'}>
          OTS_04_OTS_04_OTS_04_OTS_04_OTS_04_OTS_04_OTS_04_OTS_04
        </Menu.Item>
        <Menu.Item key="5">option5</Menu.Item>
        <Menu.Item key="6">option6</Menu.Item>
        <Menu.Item key="7">option7</Menu.Item>
        <Menu.Item key="8">option8</Menu.Item>
        <Menu.Item key="9">option9</Menu.Item>
        <Menu.Item key="10">option10</Menu.Item>
        <Menu.Item key="11">option11</Menu.Item>
        <Menu.Item key="12">option12</Menu.Item> */}
        {list?.map(device => (
          <Menu.Item key={device.key}>{device.name}</Menu.Item>
        ))}
      </Menu>
    </Sider>
  );
}

export default LogSider;
