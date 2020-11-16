import React, { useEffect } from 'react';
import { Layout, Menu } from 'antd';
import {
  useDashBoardDispatch,
  useDashBoardState,
} from '../../../contexts/DashboardContext';
import { DatabaseOutlined } from '@ant-design/icons';

const { Sider } = Layout;

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
    console.log('item', item);
    console.log('key', key);
    console.log('key', typeof key);
    console.log('keyPath', keyPath);
    console.log('domEvent', domEvent);
    dispatch({
      type: 'SELECT_DEVICE',
      selected: typeof key === 'number' ? JSON.stringify(key) : key,
    });
  };

  useEffect(() => {
    // When the device list is updated, check if selected device is in the device list
    // If the selected device is not in the device list, it is changed to null.
    if (!list.find(item => item.name === selected)) {
      dispatch({
        type: 'SELECT_DEVICE',
        selected: null,
      });
    }
  }, [list]);

  return (
    <Sider
      theme="light"
      width={250}
      style={{
        overflow: 'auto',
        height: '453px',
      }}
    >
      <Menu
        theme="light"
        mode="inline"
        style={{ height: '100%' }}
        onClick={onClick}
      >
        {list?.map(device => (
          <Menu.Item icon={<DatabaseOutlined />} key={device.name}>
            {device.name}
          </Menu.Item>
        ))}
      </Menu>
    </Sider>
  );
}

export default LogSider;
