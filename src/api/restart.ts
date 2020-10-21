import React from 'react';
import { Modal } from 'antd';
import axios from 'axios';

export const execDockerRestart = (device: string) => {
  const modal = Modal.confirm({
    centered: true,
  });

  modal.update({
    title: 'Docker Restart',
    // icon: <ExclamationCircleOutlined />,
    content: `Do you want to restart ${device}'s Docker?`,
    onOk: async () => {
      modal.update({
        cancelButtonProps: { disabled: true },
      });

      try {
        const { data } = await axios.get(
          'http://localhost:3100/service/api/restart/docker?device=ESP_01',
        );
      } catch (e) {}
    },
  });
};
