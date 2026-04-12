"use client";
import React from 'react';
import { Empty as AntdEmpty, EmptyProps } from 'antd';

const Empty = ({ emptyProps }: { emptyProps?: EmptyProps }) => {
  return (
    <AntdEmpty {...emptyProps} />
  );
};

export default Empty;
