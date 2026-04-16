import { Card as AntdCard, CardProps } from 'antd';
import React from 'react';

const Card = ({ children, ...props }: CardProps & { children?: React.ReactNode }) => {
    return (
        <AntdCard {...props}>
            {children}
        </AntdCard>
    )
}

export default Card;