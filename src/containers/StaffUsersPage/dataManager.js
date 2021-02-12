import React from 'react';

import { Switch } from 'antd';
import { Link } from 'react-router-dom';

export const columns = [
  {
    title: 'S.No.',
    key: 'indexCount',
    dataIndex: 'index',
    width: 75,
  },
  {
    title: 'Name',
    dataIndex: 'full_name',
    key: 'staffName',
    width: 150,
  },
  {
    title: 'Contact Number',
    key: 'staffContactNumber',
    width: 150,
    dataIndex: 'mobile_number',
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'staffEmailAddress',
    width: 150,
  },
  {
    title: 'Role',
    // dataIndex: 'role',
    key: 'role',
    width: 150,
    render: (text, row) => {
      return row.role ? row.role : 'No Roles Assigned';
    },
  },
  {
    title: 'Status',
    key: 'elderActions',
    width: 100,
    render: (text, row) => {
      if (row.is_active) {
        return (
          <div className='responder-options'>
            <Switch
              checkedChildren='Active'
              unCheckedChildren='Inactive'
              checked={true}
              onChange={() => row.updateStatus()}
            />
          </div>
        );
      } else {
        return (
          <div className='responder-options'>
            <Switch
              checkedChildren='Active'
              unCheckedChildren='Inactive'
              checked={false}
              onChange={() => row.updateStatus()}
            />
          </div>
        );
      }
    },
  },
  {
    title: 'Actions',
    key: 'actions',
    width: 150,
    render: (text, row) => {
      return (
        <div className='record-actions d-flex align-items-center justify-content-start'>
          <Link to={`staff/view/${row.id}`}>Details</Link>
        </div>
      );
    },
  },
];
