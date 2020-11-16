import React from 'react';
import { Layout } from 'antd';
import LogSider from './LogSider';
import LogTable from './LogTable';

function LogDownload(): JSX.Element {
  return (
    <Layout style={{ minWidth: '950px' }}>
      <LogSider />
      <LogTable />
    </Layout>
  );
}

export default LogDownload;
