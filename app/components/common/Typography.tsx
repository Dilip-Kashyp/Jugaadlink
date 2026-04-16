"use client";
import { Typography as AntTypography } from "antd";
import type { TitleProps } from "antd/es/typography/Title";
import type { TextProps } from "antd/es/typography/Text";
import React from "react";

interface TypographyComponent extends React.FC<TitleProps & { children: React.ReactNode }> {
  Title: typeof AntTypography.Title;
  Text: typeof AntTypography.Text;
  Paragraph: typeof AntTypography.Paragraph;
  Link: typeof AntTypography.Link;
}

const Typography: TypographyComponent = (({ children, ...props }: TitleProps & { children: React.ReactNode }) => {
  return (
    <AntTypography.Title {...props}>
      {children}
    </AntTypography.Title>
  );
}) as TypographyComponent;

Typography.Title = AntTypography.Title;
Typography.Text = AntTypography.Text;
Typography.Paragraph = AntTypography.Paragraph;
Typography.Link = AntTypography.Link;

export default Typography;