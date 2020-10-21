import React, { useCallback, useState } from 'react';
import {
  Table,
  Tag,
  Space,
  Spin,
  Row,
  Col,
  Layout,
  Breadcrumb,
  Button,
  Modal,
} from 'antd';
import { RedoOutlined, SyncOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import {
  loadDeviceList,
  useDashBoardState,
  useLDashBoardDispatch,
} from '../../contexts/DashboardContext';
import { stringify } from 'querystring';
import { ModalConfirm } from '../Modal/Modal';
import OsRestartModal from './OsRestartModal';
import axios from 'axios';
import { execDockerRestart } from '../../api/restart';

const { Column, ColumnGroup } = Table;

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (text: string) => <div>{text}</div>,
  },
  {
    title: 'IP Address',
    dataIndex: 'ip',
    key: 'ip',
  },
  {
    title: 'Docker Status',
    dataIndex: 'status',
    key: 'status',
  },
  {
    title: 'Volume',
    dataIndex: 'volume',
    key: 'volume',
  },
  {
    title: 'Docker Restart',
    dataIndex: 'dockerRestart',
    key: 'dockerRestart',
  },
  {
    title: 'OS Restart',
    dataIndex: 'osRestart',
    key: 'osRestart',
  },
];

export type DockerStatus = {
  key: React.Key;
  type: string;
  name: string;
  ip: string;
  status: string[];
  volue: string;
};

export type DockerStatusList = DockerStatus[];

const data = [
  {
    key: '1',
    type: 'ESP',
    name: 'ESP_01',
    ip: '10.1.31.143',
    status: ['Rapid Collector (Up 12 seconds)', 'Postgres (Exited 12 seconds)'],
    volume: '100G / 500G',
  },
  {
    key: '2',
    type: 'OTS',
    name: 'OTS_01',
    ip: '10.1.31.144',
    status: ['File Service Collect (Up 12 seconds)'],
    volume: '100G / 500G',
  },
  {
    key: '3',
    type: 'OTS',
    name: 'OTS_02',
    ip: '10.1.31.144',
    status: ['File Service Collect (Up 12 seconds)'],
    volume: '100G / 500G',
  },
  {
    key: '4',
    type: 'OTS',
    name: 'OTS_03',
    ip: '10.1.31.144',
    status: ['File Service Collect (Up 12 seconds)'],
    volume: '100G / 500G',
  },
  {
    key: '4',
    type: 'OTS',
    name: 'OTS_05',
    ip: '10.1.31.144',
    status: ['Unknown'],
    volume: '100G / 500G',
  },
  {
    key: '5',
    type: 'OTS',
    name: 'OTS_06',
    ip: '10.1.31.144',
    status: ['File Service Collect (Up 12 seconds)'],
    volume: '100G / 500G',
  },
];

const StatusColor = styled(Col)`
  color: ${({ status }: { status: string }) => {
    if (status.includes('Up')) {
      return '#90EE90'; // LightGreen
    }
    if (status.includes('Exited')) {
      return '#FF4500'; // OragneRed
    }
    return '#778899'; // LightSlateGray
  }};
`;

const StatusText = styled(Col)`
  padding-left: 5px;
`;

function StatusTable(): JSX.Element {
  const {
    deviceInfo: { list, success, error, failure, pending, selected },
  } = useDashBoardState();
  const dispatch = useLDashBoardDispatch();
  const [osModalVisible, setOsModalVisible] = useState(false);
  const [targetDevice, setTargetDevice] = useState<string | null>(null);

  const onRefresh = () => {
    loadDeviceList(dispatch).then(r => r);
  };

  const renderStatus = (
    text: string[],
    record: DockerStatus,
    index: number,
  ) => {
    console.log('DockerRender');
    console.log('name', text);
    console.log('record', record);
    console.log('index', index);
    return (
      <>
        {text.map(item => (
          <Row justify="center">
            <StatusColor status={item}>●</StatusColor>
            <StatusText>{item}</StatusText>
          </Row>
        ))}
      </>
    );
  };

  const onDockerRestart = (text: string) => {
    execDockerRestart(text, onRefresh);
    // ModalConfirm({
    //   title: 'Docker Restart',
    //   content: 'Do you want to restart Docker?',
    //   onOk: () => {
    //     return new Promise((resolve, reject) => {
    //       setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
    //     }).catch(() => console.log('Oops errors!'));
    //   },
    //   onCancel: () => {},
    // });
  };

  const onOsRestart = (text: string) => {
    setOsModalVisible(true);
  };

  return (
    <Layout style={{ height: '360px', minWidth: '950px' }}>
      <Breadcrumb style={{ margin: '10px 0' }}>
        <Breadcrumb.Item>DashBoard</Breadcrumb.Item>
        <Breadcrumb.Item>Device Status</Breadcrumb.Item>
      </Breadcrumb>
      <Row justify="end" style={{ marginBottom: '10px' }}>
        <Button
          style={{ width: '100px' }}
          type="primary"
          icon={<SyncOutlined style={{ verticalAlign: 0 }} />}
          onClick={onRefresh}
        >
          Reload
        </Button>
      </Row>
      <Table
        tableLayout="fixed"
        size="small"
        bordered
        //dataSource={data}
        dataSource={pending ? [] : list}
        // scroll={{ y: 185 }}
        pagination={{ pageSize: 4, position: ['bottomCenter'] }}
        loading={pending}
      >
        <Column
          title="Name"
          dataIndex="name"
          key="name"
          align="center"
          width="15%"
        />
        <Column
          title="IP Address"
          dataIndex="ip"
          key="ip"
          align="center"
          width="15%"
        />
        <Column
          title="Docker Status"
          dataIndex="status"
          key="status"
          align="center"
          width="35%"
          render={renderStatus}
        />
        <Column
          title="Volume"
          dataIndex="volume"
          key="volume"
          align="center"
          width="15%"
        />
        <Column
          title="Docker Restart"
          dataIndex="name"
          key="name"
          align="center"
          width="15%"
          render={(text, record, index) => {
            return (
              <RedoOutlined
                onClick={() => {
                  setTargetDevice(text);
                  onDockerRestart(text);
                }}
              />
            );
          }}
        />
        <Column
          title="OS Restart"
          dataIndex="name"
          key="name"
          align="center"
          width="15%"
          render={(text, record, index) => {
            console.log('OSRender');
            console.log('text', text);
            console.log('record', record);
            console.log('index', index);
            return (
              <RedoOutlined
                onClick={() => {
                  setTargetDevice(text);
                  onOsRestart(text);
                }}
              />
            );
          }}
        />
      </Table>
      <OsRestartModal
        visible={osModalVisible}
        setVisible={setOsModalVisible}
        targetDevice={targetDevice}
      />
    </Layout>
  );
}

export default StatusTable;
