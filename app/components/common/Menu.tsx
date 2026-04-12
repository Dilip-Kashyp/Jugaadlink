"use client";
import React from 'react';
import { Menu as AntdMenu, MenuProps } from 'antd';

const Menu = ({ menuProps }: { menuProps: MenuProps }) => {
  return (
    <AntdMenu {...menuProps} />
  );
};

export default Menu;
