import React from 'react';
import { Tooltip as AntdTooltip, TooltipProps } from 'antd';

const ToolTip = ({ tooltipProps, children }: { tooltipProps: TooltipProps, children?: React.ReactNode }) => {
  return (
    <AntdTooltip {...tooltipProps}>{children}</AntdTooltip>
  );
};

export default ToolTip;