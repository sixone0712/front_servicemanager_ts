import React, { useEffect } from 'react';
import { Form, Input, Button, Checkbox, Row, Col, Layout, Divider } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import axios from 'axios';
import * as DEFINE from '../../define';
import { useHistory } from 'react-router-dom';
import { openNotification } from '../../api/notification';

function Login() {
  const history = useHistory();
  const [form] = Form.useForm();

  useEffect(() => {
    const unauthorizedError = sessionStorage.getItem('unauthorizedError');
    console.log('unauthorizedError', unauthorizedError);
    if (unauthorizedError) {
      sessionStorage.clear();
      openNotification(
        'info',
        'Logged Out',
        `Your login has expired and has been redirected to the login page. Please log in again.`,
      );
    }
  }, []);

  const onFinish = async ({ password }: { password: string }) => {
    console.log('password', password);
    form.resetFields();
    try {
      const response: any = await axios.get(
        `${DEFINE.URL_LOGIN}?password=${password}`,
      );
      console.log('response', response);
      if (response.status === 200) {
        history.replace('/dashboard/system');
      }
    } catch (e) {
      console.log(e);
      console.log('e.response', e.response);
      if (e?.response?.status === 400)
        openNotification(
          'error',
          'Error',
          'Login failed for a invalid password.',
        );
      else openNotification('error', 'Error', 'A network error has occurred.');
    }
  };

  return (
    <Layout
      style={{
        height: '100vh',
        backgroundColor: '#485461',
        backgroundImage: 'linear-gradient(315deg, #485461 0%, #28313b 74%)',
      }}
    >
      <Row justify="center" align="middle" style={{ height: '100vh' }}>
        <Col>
          <Form
            form={form}
            name="normal_login"
            className="login-form"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            style={{
              width: '400px',
              maxWidth: '400px',
              height: '300px',
              minHeight: '300px',
              paddingTop: '50px',
              paddingLeft: '20px',
              paddingRight: '20px',
              backgroundColor: '#DFE5ED',
              // backgroundColor: 'white',
              borderRadius: '0.25rem',
              boxShadow: '0 0.5rem 1rem rgba(0,0,0,0.15)',
            }}
          >
            <Form.Item>
              <div
                style={{
                  fontSize: '1.4rem',
                  fontWeight: 600,
                  textAlign: 'center',
                }}
              >
                Log-in to administrator account
              </div>
            </Form.Item>
            <Divider />
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: 'Please input Administrator Password!',
                },
              ]}
            >
              <Input
                size="large"
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Password"
                autoComplete="off"
                style={{
                  borderRadius: '0.25rem',
                  boxShadow: '0 0.5rem 1rem rgba(0,0,0,0.15)',
                }}
              />
            </Form.Item>
            <Form.Item>
              <Button
                size="large"
                type="primary"
                htmlType="submit"
                className="login-form-button"
                style={{
                  marginTop: '10px',
                  width: '100%',
                  borderRadius: '0.25rem',
                  // backgroundColor: 'black',
                  boxShadow: '0 0.5rem 1rem rgba(0,0,0,0.15)',
                }}
              >
                Sign in
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </Layout>
  );
}

export default Login;
