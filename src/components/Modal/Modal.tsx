import { Modal, Button } from 'antd';
import React, { useState } from 'react';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { ok } from 'assert';

// function ModalWindow(): JSX.Element {
//   const [visible, setVisible] = useState(false);

//   const showModal = () => {
//     setVisible(true);
//   };

//   const handleOk = e => {
//     console.log(e);
//     setVisible(false);
//   };

//   const handleCancel = e => {
//     console.log(e);
//     setVisible(false);
//   };

//   return (
//     <>
//       <Button type="primary" onClick={showModal}>
//         Open Modal
//       </Button>
//       <Modal
//         title="Basic Modal"
//         visible={visible}
//         onOk={handleOk}
//         onCancel={handleCancel}
//       >
//         <p>Some contents...</p>
//         <p>Some contents...</p>
//         <p>Some contents...</p>
//       </Modal>
//     </>
//   );
// }

// export default ModalWindow;

export function ModalConfirm({
  title,
  content,
  onOk,
  onCancel,
}: {
  title: string;
  content: string;
  onOk: () => void;
  onCancel: () => void;
}): void {
  Modal.confirm({
    title: title,
    // icon: <ExclamationCircleOutlined />,
    content: content,
    okText: 'Ok',
    cancelText: 'Cancel',
    onOk: onOk,
    onCancel: onCancel,
    centered: true,
  });
}

export function ModalCancel({
  title,
  content,
}: {
  title: string;
  content: string;
}): void {
  Modal.error({
    title: title,
    // icon: <ExclamationCircleOutlined />,
    content: content,
    okText: 'Ok',
    centered: true,
  });
}
