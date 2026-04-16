"use client";
import React from 'react';
import { Drawer as AntdDrawer, DrawerProps } from 'antd';

const Drawer = ({ children, ...props }: DrawerProps & { children?: React.ReactNode }) => {
  return (
    <AntdDrawer {...props}>{children}</AntdDrawer>
  );
};

export default Drawer;
