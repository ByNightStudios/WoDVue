import React from 'react';

import { Switch } from 'antd';

// Handler for Exapanded Record Functions - Use API Reference https://ant.design/components/table/

export const columns = [
  {
    title: 'S.No.',
    key: 'indexCount',
    dataIndex: 'index',
    width: 75,
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'providerName',
    width: 150,
  },
  {
    title: 'Contact Number',
    key: 'providerContactNumber',
    width: 150,
    render: (text, row) => {
      return (
        <div>{row.mobile_number ? '+91-' + row.mobile_number : 'N/A'}</div>
      );
    },
  },
  {
    title: 'Type',
    key: 'providerStatus',
    width: 150,
    render: (text, row) => {
      return <div className='provider-options'>{row.type.toString()}</div>;
    },
  },
];
