import React from 'react';
import { Tooltip as AntdTooltip, TooltipProps } from 'antd';

const ToolTip = ({ children, ...props }: TooltipProps & { children?: React.ReactNode }) => {
  return (
    <AntdTooltip {...props}>{children}</AntdTooltip>
  );
};

export default ToolTip;