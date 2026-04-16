"use client";
import { Button as AntButton, ButtonProps } from "antd";
import React from "react";

const Button = ({ children, ...props }: ButtonProps & { children?: React.ReactNode }) => {
  return (
    <AntButton {...props}>
      {children}
    </AntButton>
  );
}

export default Button;