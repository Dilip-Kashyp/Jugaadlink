"use client";
import React from 'react';
import { Modal as AntdModal, ModalProps } from 'antd';

const Modal = ({ children, ...props }: ModalProps & { children: React.ReactNode }) => {
  return (
    <AntdModal {...props}>{children}</AntdModal>
  );
};

export default Modal;
