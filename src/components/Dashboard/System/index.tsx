import React, { useEffect } from 'react';
import { Divider, Layout, Menu } from 'antd';
import StatusTable from './StatusTable';
import LogDownload from './LogDownload';
import {
  loadDeviceList,
  useDashBoardDispatch,
} from '../../../contexts/DashboardContext';

const { Content } = Layout;

function SystemInfo(): JSX.Element {
  const dispatch = useDashBoardDispatch();

  useEffect(() => {
    loadDeviceList(dispatch).then(r => r);
  }, []);

  return (
    <>
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
    </>
  );
}

export default SystemInfo;
