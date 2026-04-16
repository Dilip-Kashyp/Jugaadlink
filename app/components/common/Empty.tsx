"use client";
import React from 'react';
import { Empty as AntdEmpty, EmptyProps } from 'antd';

const Empty = (props: EmptyProps) => {
  return (
    <AntdEmpty {...props} />
  );
};

export default Empty;
