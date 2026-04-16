"use client";
import React from 'react';
import { Layout as AntdLayout, LayoutProps } from 'antd';

const Layout = ({ children, ...props }: LayoutProps & { children: React.ReactNode }) => {
  return (
    <AntdLayout {...props}>{children}</AntdLayout>
  );
};

Layout.Sider = AntdLayout.Sider;
Layout.Content = AntdLayout.Content;

export default Layout;
