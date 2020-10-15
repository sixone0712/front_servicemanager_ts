import React, { useEffect, useState } from 'react';
import { Layout, Menu, Table, Breadcrumb, Button, Space, Row } from 'antd';
import { DownloadOutlined, SyncOutlined } from '@ant-design/icons';
import { TableRowSelection } from 'antd/es/table/interface';
import { useDashBoardState } from '../../contexts/DashboardContext';
import axios from 'axios';
import { DeferFn, PromiseFn, useAsync } from 'react-async';
import { getLogFileList } from '../../api/dashboard';

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;
const { Column, ColumnGroup } = Table;

export type LogFile = {
  key: number;
  fileType: string;
  fileName: string;
  fileSize: string;
};

export type LogFileList = LogFile[];

const dataList: LogFileList = [];
for (let i = 0; i < 49; i++) {
  dataList.push({
    key: i,
    fileType: `tomcat`,
    fileName: 'tomcat.log',
    fileSize: `24 KB`,
  });
}

export enum LogType {
  LOGIN_OUT = 'login',
  USER_JOB = 'job',
  DOWNLOADED_FILE = 'downloadFile',
  ESP_OTS_PROCESS = 'process',
  DOWNLOAD_FILE_STATUS = 'fileStatus',
  ERROR = 'error',
  TOMCAT = 'tomcat',
}

const logFilter = [
  {
    text: 'User Login/Logout',
    value: LogType.LOGIN_OUT,
  },
  {
    text: 'User Job',
    value: LogType.USER_JOB,
  },
  {
    text: 'Downloaded File',
    value: LogType.DOWNLOADED_FILE,
  },
  {
    text: 'ESP/OTS Process',
    value: LogType.ESP_OTS_PROCESS,
  },
  {
    text: 'File Download Status',
    value: LogType.DOWNLOAD_FILE_STATUS,
  },
  {
    text: 'Error Exception',
    value: LogType.ERROR,
  },
  {
    text: 'Tomcat',
    value: LogType.TOMCAT,
  },
];

// const loadFirstName: PromiseFn<any> = ({ userId }) =>
//   fetch(`https://reqres.in/api/users/${userId}`)
//     .then(res => (res.ok ? Promise.resolve(res) : Promise.reject(res)))
//     .then(res => res.json())
//     .then(({ data }) => data.first_name);

const loadFirstName: DeferFn<any> = async (args: string[]) => {
  // const { data } = await axios.get(`https://1reqres.in/api/users/${args[0]}`);
  // console.log('axios_data', data);
  // return data.data.first_name;

  const { data } = await getLogFileList(args[0]);
  return data;
};

function LogTable(): JSX.Element {
  const { selectedDevice } = useDashBoardState();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [changeId, setChangeId] = useState(false);

  const { data, error, isLoading, run } = useAsync({
    deferFn: loadFirstName,
    userId: 1,
  });

  console.log('isLoading', isLoading);
  console.log('error', error);
  console.log('data', data);

  const onSelectChange = (
    selectedRowKeys: React.Key[],
    selectedRows: LogFileList,
  ) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    setSelectedRowKeys(selectedRowKeys);
  };

  const rowSelection: TableRowSelection<LogFile> = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  return (
    // <Layout style={{ padding: '0 24px 24px' }}>
    <Layout>
      <Content
        style={{
          paddingLeft: '24px',
          margin: 0,
          minHeight: 280,
        }}
      >
        <Breadcrumb style={{ margin: '10px 0' }}>
          <Breadcrumb.Item>DashBoard</Breadcrumb.Item>
          <Breadcrumb.Item>Log Download</Breadcrumb.Item>
          {selectedDevice && (
            <Breadcrumb.Item>{selectedDevice}</Breadcrumb.Item>
          )}
        </Breadcrumb>
        {selectedDevice && (
          <>
            <Row justify="end" style={{ marginBottom: '10px' }}>
              <Space>
                <Button
                  type="primary"
                  icon={<SyncOutlined style={{ verticalAlign: 0 }} />}
                >
                  Reload
                </Button>
                <Button
                  icon={<DownloadOutlined style={{ verticalAlign: 0 }} />}
                  onClick={() => {
                    console.log('download');
                    run(['1']);
                  }}
                >
                  Download
                </Button>
              </Space>
            </Row>
            <Table
              rowSelection={rowSelection}
              // columns={columns}
              dataSource={dataList}
              size="small"
              bordered
              pagination={{ pageSize: 7, position: ['bottomCenter'] }}
              tableLayout="fixed"
              // style={{
              //   minWidth: '675px',
              // }}
            >
              <Column
                title="File Type"
                dataIndex="fileType"
                key="fileType"
                align="center"
                width="35%"
                filters={logFilter}
                onFilter={(value: string | number | boolean, record: LogFile) =>
                  typeof value === 'string' &&
                  record.fileType.indexOf(value) === 0
                }
              />
              <Column
                title="File Name"
                dataIndex="fileName"
                key="fileName"
                align="center"
                width="50%"
              />
              <Column
                title="File Size"
                dataIndex="fileSize"
                key="fileSize"
                align="center"
                width="15%"
              />
            </Table>
          </>
        )}
      </Content>
    </Layout>
  );
}

export default LogTable;
