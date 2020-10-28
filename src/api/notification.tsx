import React from 'react';
import { notification } from 'antd';
import dayjs from 'dayjs';
import styled from 'styled-components';

type NotificationType = 'success' | 'error' | 'info' | 'warning';

const DivDate = styled.div`
  text-align: right;
  font-size: 13px;
  color: gray;
`;

export const openNotification = (
  type: NotificationType,
  message: string,
  description: string | React.ReactNode,
): void => {
  const now = new Date(Date.now());
  console.log('now', now);
  console.log(typeof now.getFullYear());
  notification[type]({
    message: message,
    description: (
      <>
        <div>{description}</div>
        <p />
        <DivDate>{dayjs().add(1, 'day').format('YYYY-MM-DD HH:mm:ss')}</DivDate>
      </>
    ),
    duration: 0,
  });
};
