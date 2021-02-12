import React from 'react';

export const tableColumns = [
  {
    title: 'S.No.',
    key: 'indexCount',
    dataIndex: 'index',
    width: 75,
  },
  {
    title: 'Order ID',
    key: 'requestIdentifier',
    dataIndex: 'reference_id',
    width: 125,
  },
  {
    title: 'Plan Name',
    key: 'planName',
    width: 250,
    render: (text, row) => {
      return (
        <div>
          <p>
            <b>Plan Name: </b>
            {row.name ? row.name : 'N/A'}
          </p>
          <p>
            <b>Plan Category: </b>
            {row.category ? row.category : 'N/A'}
          </p>
        </div>
      );
    },
  },
  {
    title: 'Amount',
    key: 'amount',
    width: 100,
    render: (text, row) => {
      let amount = '';
      if (row.currency) {
        amount = `${row.currency} `;
      }
      if (row.amount) {
        amount = `${amount}${row.amount}`;
      }
      return <p>{amount}</p>;
    },
  },
  {
    title: 'Duration (Days)',
    key: 'duration',
    width: 100,
    render: (text, row) => {
      return row.duration || 'N/A';
    },
  },
  {
    title: 'Start Date',
    key: 'timeline',
    dataIndex: 'created_at',
    width: 125,
  },
  {
    title: 'Service Initiation Date',
    key: 'service',
    width: 125,
    render: (text, row) => {
      return row.service_initiation_date || 'N/A';
    },
  },
  {
    title: 'Expiry Date',
    key: 'expiry',
    width: 125,
    render: (text, row) => {
      return row.expiry_date || 'N/A';
    },
  },
  {
    title: 'Status',
    key: 'status',
    width: 125,
    render: (text, row) => {
      let status = null;
      let classToggle = '';
      if (row.status === '0') {
        status = 'Created';
        classToggle = '-param--orange';
      } else if (row.status === '1') {
        status = 'Confirmed';
        classToggle = '-param--green';
      } else if (row.status === '2') {
        status = 'Expired';
        classToggle = '-param--red';
      } else if (row.status === '3') {
        status = 'Failed';
        classToggle = '-param--black';
      } else if (row.status === null) {
        status = 'Error';
        classToggle = '-param--red';
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
];
