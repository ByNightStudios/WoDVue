import React from 'react';
import OrderServiceFile from '../../service/OrderService';
const OrderService = new OrderServiceFile();
// Handler for Exapanded Record Functions - Use API Reference https://ant.design/components/table/

export const columns = [
  {
    title: 'S.No.',
    key: 'indexCount',
    dataIndex: 'index',
  },
  {
    title: 'User Details',
    key: 'userDetails',
    render: (text, row) => {
      return (
        row.user && (
          <React.Fragment>
            <div style={{ display: 'block' }}>Name : {row.user.full_name}</div>
            <div style={{ display: 'block' }}>
              Contact :{row.user.formatted_mobile_number}
            </div>
          </React.Fragment>
        )
      );
    },
  },
  {
    title: 'Order ID',
    dataIndex: 'reference_id',
    key: 'orderID',
  },
  {
    title: 'Amount',
    key: 'amount',
    render: (text, row) => {
      return <div>{row.amount ? `${row.currency} ${row.amount}` : ''}</div>;
    },
  },
  {
    title: 'Plan Name',
    dataIndex: 'plan.name',
    key: 'planName',
  },
  {
    title: 'Status',
    key: 'status',
    render: (text, row) => {
      let status = null;
      let classToggle = '';
      if (row.status === 0) {
        status = 'Created';
        classToggle = '-param--orange';
      } else if (row.status === 1) {
        status = 'Confirmed';
        classToggle = '-param--green';
      } else if (row.status === 2) {
        status = 'Expired';
        classToggle = '-param--red';
      } else if (row.status === 3) {
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
  {
    title: 'Actions',
    key: 'actions',
    render: (text, row) => {
      return (
        <div className='record-actions d-flex align-items-center justify-content-start'>
          <a
            href={`orders/view/${row.id}`}
            target='_blank'
            rel='noopener noreferrer'
          >
            Details
          </a>
        </div>
      );
    },
  },
];

class OrdersManager {
  getOrdersData(inputs) {
    let payload = {
      page: inputs.page,
      search: inputs.search,
      status: inputs.status,
    };
    return OrderService.getOrdersService(payload);
  }
}

export default OrdersManager;
