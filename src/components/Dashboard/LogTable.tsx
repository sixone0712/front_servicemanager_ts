import React, { useEffect, useRef, useState } from 'react';
import {
  Layout,
  Menu,
  Table,
  Breadcrumb,
  Button,
  Space,
  Row,
  Result,
  Modal,
} from 'antd';
import { DownloadOutlined, SyncOutlined } from '@ant-design/icons';
import { TableRowSelection } from 'antd/es/table/interface';
import { useDashBoardState } from '../../contexts/DashboardContext';
import axios, { AxiosResponse } from 'axios';
import { DeferFn, PromiseFn, useAsync } from 'react-async';
import useAsyncAxios from '../../hooks/useAsyncAxios';
import { join } from 'path';
import { ModalCancel, ModalConfirm } from '../Modal/Modal';
import { execFileDownload } from '../../api/download';

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;
const { Column, ColumnGroup } = Table;

export type LogFile = {
  key: string;
  fileType: string;
  fileName: string;
  fileSize: string;
};

export type LogFileList = LogFile[];

// const dataList: LogFileList = [];
// for (let i = 0; i < 49; i++) {
//   dataList.push({
//     key: `${i}`,
//     fileType: `tomcat`,
//     fileName: 'tomcat.log',
//     fileSize: `24 KB`,
//   });
// }

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

// const loadFirstName: DeferFn<any> = async (args: string[]) => {
//   const { data } = await axios.get(`https://1reqres.in/api/users/${args[0]}`);
//   console.log('axios_data', data);
//   return data.data.first_name;
// };

const loadFileList = (device: string | null): Promise<AxiosResponse<any>> => {
  return axios.get(`http://localhost:3100/service/api/files?device=${device}`);
};

const geneDownloadStatus = async function* (func: () => any) {
  while (true) {
    const response = yield await func();
    console.log('response', response);

    if (response.status === 200) {
      const { status } = response?.data;
      if (status === 'done' || status === 'error') return response;
    } else {
      return response;
    }

    yield new Promise(resolve => {
      setTimeout(resolve, 500);
    });
  }
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
  const cancel = useRef(false);

  useEffect(() => {
    const { lists } = listState?.data?.data || { lists: [] };

    console.log('[LogTable][useEffect_1]lists', lists);
    const addKeyList: LogFileList = lists.map(
      (list: { fileName: string; fileType: string; fileSize: string }) => {
        return {
          key: list.fileName,
          ...list,
        };
      },
    );
    setFileList(addKeyList);
  }, [listState.data]);

  console.log('[LogTable]fileList', fileList);

  useEffect(() => {
    console.log('[LogTable][useEffect_2]selected', selected);
    if (selected) {
      listRefetch().then(r => r);
    }
  }, [selected]);

  const onRefersh = () => {
    listRefetch().then(r => r);
  };

  console.log('listState', listState);

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

  const onDownloadFile2 = () => {
    const selectedFileList = selectedRowKeys.reduce(
      (previousValue: any, currentValue: any, currentIndex: any, array) => {
        console.log('previousValue', previousValue);
        console.log('currentValue', currentValue);
        console.log('currentIndex', currentIndex);
        console.log('array', array);
        const foundKey = fileList.find(list => list.key === currentValue);
        if (foundKey) return foundKey;
      },
      {},
    );

    execFileDownload(selectedFileList, cancel);
  };

  const onDownloadFile = () => {
    const selectedFileList = selectedRowKeys.reduce(
      (acc: any, cur: React.Key, i) => {
        console.log('acc', acc);
        console.log('cur', cur);
        const foundKey = fileList.find(list => list.key === cur);
        if (foundKey) return foundKey;
      },
      [],
    );

    console.log('selectedfileList', selectedFileList);

    const modal = Modal.confirm({
      centered: true,
    });
    //ModalConfirm({
    modal.update({
      title: 'File Download',
      content: 'Do you want to download files?',
      onOk: async () => {
        // Request Download => get download id
        const {
          data: { downloadId },
        } = await axios.post(
          'http://localhost:3100/service/api/files',
          selectedFileList,
        );

        if (!downloadId) {
          return;
        }
        console.log('downloadId', downloadId);
        // Request Status
        const statusFunc = () => {
          return axios(
            'http:/localhost:3100/service/api/files/download/dl20201019',
          );
        };

        const generator = async function* () {
          while (true) {
            const response = await axios(
              'http://localhost:3100/service/api/files/download/dl20201019',
            );

            console.log('response', response);
            if (response.status === 200) {
              const { status } = response?.data;
              console.log('status', status);
              if (status === 'done' || status === 'error') yield response;
              else yield response;
            } else {
              yield response;
            }

            yield new Promise(resolve => {
              setTimeout(resolve, 500);
            });
          }
        };

        let i = 0;
        await (async () => {
          for await (const val of generator()) {
            i++;
            modal.update({
              content: i,
            });
            if (cancel.current) break;
            console.log('val', val);
          }
        })();

        /*
        const iterator: any = geneDownloadStatus(statusFunc);
        const next = ({ value, done }: { value: any; done: any }) => {
          console.log('[geneDownloadStatus]done', done);
          // console.log(
          //   '[geneDownloadStatus]cancelRef.current',
          //   cancelRef.current,
          // );

          // if (cancelRef.current) {
          //   return;
          // }

          if (done) {
            console.log('[geneDownloadStatus]value', value);
            if (value.status === 200) {
              if (value.data.status === 'error') {
                // openDownloadStatusError();
                return;
              }
              // openDownloadComplete();
            } else {
              // openDownloadStatusError();
              return;
            }
          } else {
            console.log('[geneDownloadStatus]success');
            value
              .then((res: any) => {
                console.log('[geneDownloadStatus]then.value', res);
                // setDownStatus(res.data);
                next(iterator.next(res));
              })
              .catch((err: any) => {
                console.log('[geneDownloadStatus]error.value', err);
                // next(iterator.next(err.response));
              });
          }
        };

        return next(iterator.next());

        // Download Files

        // return new Promise((resolve, reject) => {
        //   setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
        // }).catch(() => console.log('Oops errors!'));
         */
      },
      onCancel: () => {
        cancel.current = true;
      },
    });
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
          {selected && <Breadcrumb.Item>{selected}</Breadcrumb.Item>}
        </Breadcrumb>
        {!selected && <Result title="Please select a device." />}
        {selected && (
          <>
            <Row justify="end" style={{ marginBottom: '10px' }}>
              <Space>
                <Button
                  type="primary"
                  icon={<SyncOutlined style={{ verticalAlign: 0 }} />}
                  onClick={onRefersh}
                >
                  Reload
                </Button>
                <Button
                  icon={<DownloadOutlined style={{ verticalAlign: 0 }} />}
                  onClick={onDownloadFile2}
                  disabled={selectedRowKeys.length <= 0}
                >
                  Download
                </Button>
              </Space>
            </Row>
            <Table
              rowSelection={rowSelection}
              // columns={columns}
              //dataSource={dataList}
              // dataSource={
              //   listState.data?.data?.lists ? listState.data.data.lists : []
              // }
              dataSource={fileList}
              size="small"
              bordered
              pagination={{ pageSize: 7, position: ['bottomCenter'] }}
              tableLayout="fixed"
              loading={listState.loading}
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
