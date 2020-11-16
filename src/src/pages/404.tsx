import React from 'react';
import { Result, Button } from 'antd';
import { useHistory } from 'react-router-dom';
import * as DEFINE from '../define';

function NotFound(): JSX.Element {
  const history = useHistory();

  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      extra={
        <Button
          type="primary"
          onClick={() => history.push(DEFINE.URL_PAGE_ROOT)}
        >
          Back Home
        </Button>
      }
    />
  );
}

export default NotFound;
