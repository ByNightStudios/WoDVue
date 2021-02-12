import React from 'react';

import { Link } from 'react-router-dom';

export const columns = [
  {
    title: 'S.No.',
    key: 'indexCount',
    dataIndex: 'index',
  },
  {
    title: 'Name',
    dataIndex: 'full_name',
    key: 'responderName',
  },
  {
    title: 'Contact Number',
    key: 'responderContactNumber',
    render: (text, row) => {
      return <div>{`+${row.country_code}-${row.mobile_number}`}</div>;
    },
  },
  {
    title: 'Address',
    key: 'responderAreaZone',
    render: (text, row) => {
      return (row.owner && row.owner.location) || 'N/A';
    },
  },
  {
    title: 'Zone',
    key: 'responderAreaZone',
    render: (text, row) => {
      return (row.owner && row.owner.location_code) || 'N/A';
    },
  },

  {
    title: 'Type',
    key: 'responderAvailibilityStatus',
    render: (text, row) => {
      return (
        <div className='responder-options'>
          {(row.owner && row.owner.service_type) || 'N/A'}
        </div>
      );
    },
  },
  {
    title: 'Source',
    key: 'responderSource',
    render: (text, row) => {
      return (row.owner && row.owner.source) || 'N/A';
    },
  },
  {
    title: 'Status',
    key: 'responderStatus',
    render: (text, row) => {
      let status;
      if (row.is_active) {
        if (row.on_duty) {
          status = 'Serving Request';
        } else if (row.is_available) {
          status = 'Available';
        } else status = 'Off Duty';
      } else {
        status = 'Account Inactive';
      }
      return <div className='responder-options'>{status}</div>;
    },
  },
  {
    title: 'Actions',
    key: 'responderDetails',
    render: (text, row) => {
      return (
        <div className='record-actions d-flex align-items-center justify-content-start'>
          <Link to={`responder/view/${row.id}`}>Details</Link>
        </div>
      );
    },
  },
];
