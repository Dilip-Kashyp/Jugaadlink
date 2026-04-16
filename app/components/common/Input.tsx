import React from 'react';
import { Input as AntdInput, InputProps as AntdInputProps } from 'antd';
import { SearchProps, PasswordProps } from 'antd/es/input';

type InputProps = AntdInputProps & {
    type?: string;
}

const { Search, Password } = AntdInput;

const Input: React.FC<InputProps & any> = ({ type, ...props }) => {
    switch (type) {
        case "search":
            return <Search {...(props as SearchProps)} />;
        case "password":
            return <Password {...(props as PasswordProps)} />;
        default:
            return <AntdInput {...props} />;
    }
};

export default Input;