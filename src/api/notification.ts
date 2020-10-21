import { notification } from 'antd';

type NotificationType = 'success' | 'error' | 'info' | 'warning';

export const openNotification = (
  type: NotificationType,
  message: string,
  description: string,
): void => {
  notification[type]({
    message: message,
    description: description,
    duration: 0,
  });
};
