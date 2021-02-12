import React from 'react';
import PlanServiceFile from '../../service/PlanService';
const PlanService = new PlanServiceFile();
// Handler for Exapanded Record Functions - Use API Reference https://ant.design/components/table/

export const columns = [
  {
    title: 'S.No.',
    key: 'indexCount',
    dataIndex: 'index',
    width: 75,
  },
  {
    title: 'Plan Name',
    key: 'name',
    width: 200,
    dataIndex: 'name',
  },
  {
    title: 'Plan Description',
    key: 'description',
    width: 400,
    dataIndex: 'description',
  },
  {
    title: 'Plan Category',
    key: 'category',
    // width: 200,
    dataIndex: 'category',
  },
  {
    title: 'Status',
    key: 'status',
    width: 200,
    render: (text, row) => {
      let status = null;
      let classToggle = '';
      if (row.status === 0) {
        status = 'Inactive';
        classToggle = '-param--red';
      } else if (row.status === 1) {
        status = 'Active';
        classToggle = '-param--green';
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
    width: 150,
    render: (text, row) => {
      return (
        <div className='record-actions d-flex align-items-center justify-content-start'>
          {row.status ? (
            <a
              href={`plans/view/${row.id}`}
              target='_blank'
              rel='noopener noreferrer'
            >
              Details
            </a>
          ) : null}
        </div>
      );
    },
  },
];

class PlansListingManager {
  getPlans(inputs) {
    let payload = {
      page: inputs.page,
      search: inputs.search,
    };
    return PlanService.getPlansService(payload);
  }
}

export default PlansListingManager;
