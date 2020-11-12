import React, { useEffect, useRef, useState } from 'react';
import {
  Breadcrumb,
  Button,
  Col,
  Layout,
  Menu,
  Result,
  Row,
  Space,
  Table,
} from 'antd';
import { DownloadOutlined, SyncOutlined } from '@ant-design/icons';
import { TableRowSelection } from 'antd/es/table/interface';
import { useDashBoardState } from '../../../contexts/DashboardContext';
import axios, { AxiosResponse } from 'axios';
import useAsyncAxios from '../../../hooks/useAsyncAxios';
import { execFileDownload } from '../../../api/download';
import * as DEFINE from '../../../define';
import { openNotification } from '../../../api/notification';
import { ColumnsType } from 'antd/es/table';

const { Content } = Layout;

// Type
export type LogFile = {
  key: React.Key;
  fileType: string;
  fileName: string;
  fileSize: string;
};

export type LogFileList = LogFile[];

export enum LogType {
  LOGIN_OUT = 'login',
  USER_JOB = 'job',
  DOWNLOADED_FILE = 'downloadFile',
  ESP_OTS_PROCESS = 'process',
  DOWNLOAD_FILE_STATUS = 'fileStatus',
  ERROR = 'error',
  TOMCAT = 'tomcat',
}

export type CancelInfo = {
  downloadId: string | null;
  cancel: boolean;
  isDownloading: boolean;
};

const logFilter = [
  {
    text: 'User Login_old/Logout',
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

const columData: ColumnsType<LogFile> = [
  {
    title: 'File Type',
    dataIndex: 'fileType',
    key: 'fileType',
    width: '35%',
    filters: logFilter,
    onFilter: (value: string | number | boolean, record: LogFile) =>
      typeof value === 'string' && record.fileType.indexOf(value) === 0,
    align: 'center',
  },
  {
    title: 'File Name',
    dataIndex: 'fileName',
    key: 'fileName',
    width: '50%',
    align: 'center',
  },
  {
    title: 'File Size',
    dataIndex: 'fileSize',
    key: 'fileSize',
    width: '15%',
    align: 'center',
  },
];

// const loadFirstName: PromiseFn<any> = ({ userId }) =>
//   fetch(`https://reqres.in/api/users/${userId}`)
//     .then(res => (res.ok ? Promise.resolve(res) : Promise.reject(res)))
//     .then(res => res.json())
//     .then(({ data }) => data.first_name);

// const loadFirstName: DeferFn<any> = async (args: string[]) => {
//   const { data } = await axios.get(`https://1reqres.in/api/users/${args[0]}`);
//   console.log('axios_data', data);
//   return data.data.first_name;
// };

const loadFileList = (device: string | null): Promise<AxiosResponse<any>> => {
  return axios.get(`${DEFINE.URL_DEBUG_LOG_FILES}?device=${device}`);
};

function LogTable(): JSX.Element {
  const {
    deviceInfo: { list, success, error, failure, pending, selected },
  } = useDashBoardState();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [listState, listRefetch] = useAsyncAxios(
    () => loadFileList(selected),
    [selected],
    true,
  );
  const [fileList, setFileList] = useState<LogFileList>([]);
  const cancelInfo = useRef<CancelInfo>({
    downloadId: null,
    cancel: false,
    isDownloading: false,
  });
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    if (listState.error) {
      openNotification(
        'error',
        'Error',
        `Failed to get file list of ${selected} due to server problem.`,
      );
    }
  }, [listState.error]);

  useEffect(() => {
    const { list } = listState?.data?.data || { list: [] };

    console.log('[LogTable][useEffect_1]list', list);
    const addKeyList: LogFileList = list.map(
      (
        list: { fileName: string; fileType: string; fileSize: string },
        index: number,
      ) => {
        return {
          //key: list.fileName,
          key: index,
          ...list,
        };
      },
    );
    setFileList(addKeyList);
  }, [listState.data]);

  console.log('[LogTable]fileList', fileList);

  useEffect(() => {
    if (selected) {
      setCurrentPage(1);
      setSelectedRowKeys([]);
      listRefetch().then(r => r);
    }
  }, [selected]);

  const onRefersh = () => {
    setCurrentPage(1);
    setSelectedRowKeys([]);
    listRefetch().then(r => r);
  };

  console.log('listState', listState);
  console.log('selectedRowKeys', selectedRowKeys);

  /*
  const { data, error, isLoading, run } = useAsync({
    deferFn: loadFirstName,
    userId: 1,
  });

  console.log('isLoading', isLoading);
  console.log('error', error);
  console.log('data', data);

  const getFileList() => {
    console.log('download');
    run(['1']);
  }
  */

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
    onSelectAll: (selected, selectedRows, changeRows) => {
      console.log('onSelectAll', selected, selectedRows, changeRows);
      if (selected) {
        setSelectedRowKeys(fileList.map(item => item.key));
      } else {
        setSelectedRowKeys([]);
      }
    },
  };

  const onDownloadFile = () => {
    const selectedFileList: LogFileList = fileList.filter(list => {
      return selectedRowKeys.find(key => key === list.key) !== undefined;
    });
    console.log('selectedFileList', selectedFileList);
    execFileDownload(selectedFileList, cancelInfo);
  };

  const onRow = (record: LogFile, rowIndex: number | undefined) => {
    return {
      onClick: (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
        if (rowIndex !== undefined) {
          let newselectedRowKeys;
          if (selectedRowKeys.find(item => item === rowIndex) !== undefined) {
            newselectedRowKeys = selectedRowKeys.filter(
              item => item !== rowIndex,
            );
          } else {
            newselectedRowKeys = selectedRowKeys.concat(rowIndex);
          }
          setSelectedRowKeys(newselectedRowKeys);
        }
      },
    };
  };

  return (
    <Layout>
      <Content
        style={{
          paddingLeft: '24px',
          margin: 0,
          minHeight: 280,
        }}
      >
        <Breadcrumb style={{ margin: '10px 0' }}>
          <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
          <Breadcrumb.Item>System</Breadcrumb.Item>
          <Breadcrumb.Item>Log Download</Breadcrumb.Item>
          {selected && <Breadcrumb.Item>{selected}</Breadcrumb.Item>}
        </Breadcrumb>
        {!selected && <Result title="Please select a device." />}
        {selected && (
          <>
            <Row
              justify="space-between"
              align="middle"
              style={{ marginBottom: '10px' }}
            >
              <Col
                style={{ marginLeft: '10px' }}
              >{`${selectedRowKeys.length} Files Selected`}</Col>
              <Space>
                <Button
                  type="primary"
                  icon={<SyncOutlined />}
                  onClick={onRefersh}
                >
                  Reload
                </Button>
                <Button
                  icon={<DownloadOutlined />}
                  onClick={onDownloadFile}
                  disabled={selectedRowKeys.length <= 0}
                  type="primary"
                  danger
                >
                  Download
                </Button>
              </Space>
            </Row>
            <Table
              rowKey={(record: LogFile) => record.key}
              tableLayout="fixed"
              size="small"
              bordered
              columns={columData}
              rowSelection={rowSelection}
              dataSource={fileList}
              pagination={{
                pageSize: 7,
                position: ['bottomCenter'],
                current: currentPage,
                defaultCurrent: 1,
                onChange: (page, pageSize) => {
                  setCurrentPage(page);
                },
              }}
              loading={listState.loading}
              onRow={onRow}
            />
          </>
        )}
      </Content>
    </Layout>
  );
}

export default LogTable;
