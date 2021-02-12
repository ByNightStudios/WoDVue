import React from 'react';
import { Link } from 'react-router-dom';
// Handler for Exapanded Record Functions - Use API Reference https://ant.design/components/table/

export const columns = [
  {
    title: 'S.No.',
    key: 'indexCount',
    dataIndex: 'index',
    width: 75,
  },
  {
    title: 'Role',
    dataIndex: 'role',
    key: 'role',
  },
  {
    title: 'Actions',
    key: 'actions',
    width: 200,
    render: (text, row) => {
      return (
        <div className='record-actions d-flex align-items-center justify-content-start'>
          <Link to={`roles/view/${row.id}`}>Details</Link>
        </div>
      );
    },
  },
];
