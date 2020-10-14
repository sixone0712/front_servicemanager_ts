import React from 'react';
import { Layout } from 'antd';
import LogSider from './LogSider';
import LogTable from './LogTable';

function LogDownload(): JSX.Element {
  return (
    // <Layout style={{ paddingLeft: '24px', height: '450px' }}>
    <Layout style={{ minWidth: '950px' }}>
      <LogSider />
      <LogTable />
    </Layout>
    // </Layout>
  );
}

export default LogDownload;
