import { Flex as AntdFlex, FlexProps } from 'antd';
import React from 'react';

const Flex = ({ children, ...props }: FlexProps & { children: React.ReactNode }) => {
  return (
    <AntdFlex {...props}>{children}</AntdFlex>
  );
};

export default Flex;