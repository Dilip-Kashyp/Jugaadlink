"use client";
import React from 'react';
import { Drawer as AntdDrawer, DrawerProps } from 'antd';

const Drawer = ({ drawerProps, children }: { drawerProps: DrawerProps, children?: React.ReactNode }) => {
  return (
    <AntdDrawer {...drawerProps}>{children}</AntdDrawer>
  );
};

export default Drawer;
