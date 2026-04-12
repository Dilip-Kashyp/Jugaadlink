"use client";
import React from 'react';
import { Layout as AntdLayout, LayoutProps } from 'antd';

const Layout = ({ layoutProps, children }: { layoutProps?: LayoutProps, children?: React.ReactNode }) => {
  return (
    <AntdLayout {...layoutProps}>{children}</AntdLayout>
  );
};

Layout.Sider = AntdLayout.Sider;
Layout.Content = AntdLayout.Content;

export default Layout;
