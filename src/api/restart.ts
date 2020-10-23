import React from 'react';
import { Modal } from 'antd';
import axios from 'axios';
import { openNotification } from './notification';
import * as DEFINE from '../define';

export const execDockerRestart = (device: string, onRefresh: () => void) => {
  const modal = Modal.confirm({
    centered: true,
  });

  modal.update({
    title: 'Docker Restart',
    // icon: <ExclamationCircleOutlined />,
    content: `Do you want to restart the docker of ${device}?`,
    onOk: async () => {
      modal.update({
        cancelButtonProps: { disabled: true },
      });

      try {
        const { data } = await axios.post(
          `${DEFINE.URL_DOCKER_RESTART}?device=${device}`,
        );
        openNotification(
          'success',
          'Success',
          `the docker of ${device} restart was successful.`,
        );
        onRefresh();
      } catch (e) {
        openNotification(
          'error',
          'Error',
          `the docker of ${device} restart was failed.`,
        );
      }
    },
  });
};
