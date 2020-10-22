import React from 'react';
import { Modal } from 'antd';
import axios from 'axios';
import { openNotification } from './notification';

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
        const { data } = await axios.get(
          `http://localhost:3100/servicemanager/api/restart/docker?device=${device}`,
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
