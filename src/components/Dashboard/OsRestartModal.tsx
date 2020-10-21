import React, { useState } from 'react';
import { Col, Form, Input, Modal, Row } from 'antd';
import {
  ExclamationCircleOutlined,
  LockOutlined,
  UserOutlined,
} from '@ant-design/icons';
import axios from 'axios';

const title = (
  <Row>
    <Col>
      <ExclamationCircleOutlined
        style={{ color: '#faad14', fontSize: 22, paddingRight: 16 }}
      />
    </Col>
    <Col style={{ fontSize: 16 }}>OS Restart</Col>
  </Row>
);

const OsRestartModal = ({
  visible,
  setVisible,
  targetDevice,
}: {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  targetDevice: string | null;
}): JSX.Element => {
  const [form] = Form.useForm();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmLoading, setConfirmLoading] = useState(false);

  console.log('id', id);
  console.log('password', password);

  return (
    <Modal
      visible={visible}
      title={title}
      closable={false}
      maskClosable={false}
      centered={true}
      width={416}
      okType={'primary'}
      confirmLoading={confirmLoading}
      onOk={async () => {
        try {
          setConfirmLoading(true);
          const { data } = await axios.get(
            'http://localhost:3100/service/api/restart/os?device=ESP_01',
          );

          if (data.result === 'success') {
            // success
          } else {
            // error
          }
        } catch (e) {
          console.error(e);
          // network error
        } finally {
          form.resetFields();
          setId('');
          setPassword('');
          setConfirmLoading(false);
          setVisible(false);
        }
      }}
      okButtonProps={{ disabled: id === '' || password === '' }}
      cancelButtonProps={{ disabled: confirmLoading }}
      onCancel={() => setVisible(false)}
    >
      <>
        <div>{`To restart the ${targetDevice}'s OS,`}</div>
        <div>{`Please enter the ${targetDevice}'s root account ID and Password.`}</div>
        <br />
        <Form
          form={form}
          name="normal_login"
          className="login-form"
          initialValues={{ remember: true }}
        >
          <Form.Item
            name="id"
            rules={[{ required: true, message: 'Please input root ID!' }]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="ID"
              value={id}
              onChange={e => setId(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input root Password!' }]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </Form.Item>
        </Form>
      </>
    </Modal>
  );
};

export default OsRestartModal;
