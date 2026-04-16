"use client";
import React from 'react';
import { Menu as AntdMenu, MenuProps } from 'antd';

const Menu = (props: MenuProps) => {
  return (
    <AntdMenu {...props} />
  );
};

export default Menu;
