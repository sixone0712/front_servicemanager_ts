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
  useDashBoardDispatch,
} from '../../contexts/DashboardContext';
import { stringify } from 'querystring';
import { ModalConfirm } from '../Modal/Modal';
import OsRestartModal from './OsRestartModal';
import axios from 'axios';
import { execDockerRestart } from '../../api/restart';
import { BsFillCircleFill } from 'react-icons/bs';

const { Column, ColumnGroup } = Table;

export type DockerStatus = {
  key: React.Key;
  type: string;
  name: string;
  ip: string;
  status: string[];
  volume: string;
};

export type DockerStatusList = DockerStatus[];

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
  const dispatch = useDashBoardDispatch();
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
    // console.log('name', text);
    // console.log('record', record);
    // console.log('index', index);
    return (
      <>
        {text.map(item => (
          <Row justify="center" align="middle">
            <StatusColor status={item}>
              <BsFillCircleFill />
            </StatusColor>
            <StatusText>{item}</StatusText>
          </Row>
        ))}
      </>
    );
  };

  const onDockerRestart = (text: string) => {
    execDockerRestart(text, onRefresh);
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
