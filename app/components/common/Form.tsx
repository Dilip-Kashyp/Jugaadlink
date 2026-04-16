import { Form as AntdForm, FormProps } from 'antd';
import React from 'react';

export default function Form({ items, children, ...props }: FormProps & { items?: any[], children?: React.ReactNode }) {
    return (
        <AntdForm {...props}>
            {items?.map((item: any, index: number) => (
                <AntdForm.Item key={item.name || index} name={item.name} label={item.label} {...item.formItemProps}>
                    {item.children}
                </AntdForm.Item>
            ))}
            {children}
        </AntdForm>
    )
}