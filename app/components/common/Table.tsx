import React from 'react';
import { Table as AntdTable, TableProps } from 'antd';

const Table = <T extends object>(props: TableProps<T>) => (
  <AntdTable className="w-full" {...props} />
);

export default Table;