import React from 'react';
import { get } from 'lodash';

export const columns = [
  {
    title: 'S.No.',
    key: 'indexCount',
    dataIndex: 'index',
  },
  {
    title: 'Request No.',
    key: 'requestIdentifier',
    dataIndex: 'request_id',
  },
  {
    title: 'User',
    dataIndex: 'request_consumer',
    key: 'userDetails',
    render: (text, row) => {
      return (
        <div className='user-details'>
          <div className='user-details-value'>
            Name: {row.request_consumer.full_name}
          </div>
          <div className='user-details-value'>
            Phone: +
            {row.request_consumer.country_code +
              row.request_consumer.mobile_number}
          </div>
          {row.request_consumer.owner.location_code &&
            row.request_consumer.owner.location_code !== '' && (
              <div className='user-details-value'>
                Location Code: {row.request_consumer.owner.location_code}
              </div>
            )}
        </div>
      );
    },
  },
  {
    title: 'Plan Details',
    key: 'elderPlanDetails',
    render: (text, row) => {
      return (
        <div className='user-details'>
          <div className='user-details-value'>
            Status: {get(row, 'request_consumer.plan.status', 'N/A')}
          </div>
          <div className='user-details-value'>
            Name: {get(row, 'request_consumer.plan.name', 'N/A')}
          </div>
        </div>
      );
    },
  },
  {
    title: 'Service',
    dataIndex: 'service',
    key: 'serviceType',
  },
  {
    title: 'Address',
    dataIndex: 'request_address',
    key: 'address',
    render: (text, row) => {
      return row.request_address.full_address;
    },
  },
  {
    title: 'Timeline',
    key: 'timeline',
    render: (text, row) => {
      let date = row.created_at_formatted;
      return [
        row.is_back_dated ? (
          <div key={row.id}>
            <div>{date}</div>
            <div>
              <b>(Back Dated)</b>
            </div>
          </div>
        ) : (
          <div key={row.id}>{date}</div>
        ),
      ];
    },
  },
  {
    title: 'Status',
    key: 'status',
    render: (text, row) => {
      let status = null;
      let classToggle = '';
      if (row.status === 0) {
        status = 'New';
        classToggle = '-param--red';
      } else if (row.status === 1) {
        status = 'Ongoing';
        classToggle = '-param--orange';
      } else if (row.status === 2) {
        status = 'Completed';
        classToggle = '-param--green';
      } else if (row.status === 3) {
        status = 'Cancelled';
      } else if (row.status === 4) {
        status = 'Feedback Required';
        classToggle = '-param--black';
      }

      return (
        <div className='status-details'>
          <div
            className={`status-details-param status-details${classToggle} d-flex align-items-center justify-content-start`}
          >
            <span className='status-details-light'></span>
            <span className='status-details-description'>{status}</span>
          </div>
        </div>
      );
    },
  },
  {
    title: 'Req. Source',
    key: 'req_source',
    render: (text, row) => {
      let source = '';
      row.source === null ? (source = 'N/A') : (source = row.source);
      return source;
    },
  },
  {
    title: 'Adm. Name',
    key: 'adm_name',
    render: (text, row) => {
      return row.admin_name || 'N/A';
    },
  },
  {
    title: 'Actions',
    key: 'actions',
    render: (text, row) => {
      return (
        <a
          href={`concierge/view/${row.id}`}
          target='_blank'
          rel='noopener noreferrer'
        >
          Details
        </a>
      );
    },
  },
];
