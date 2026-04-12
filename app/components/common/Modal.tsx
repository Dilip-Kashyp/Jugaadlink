"use client";
import React from 'react';
import { Modal as AntdModal, ModalProps } from 'antd';

const Modal = ({ modalProps, children }: { modalProps: ModalProps, children: React.ReactNode }) => {
  return (
    <AntdModal {...modalProps}>{children}</AntdModal>
  );
};

export default Modal;
