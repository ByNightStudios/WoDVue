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
    title: 'Name',
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
    width: 200,
    render: (text, row) => {
      if (row.status) {
        return (
          <div className='record-actions d-flex align-items-center justify-content-start'>
            <button
              style={{ marginBottom: '0px', padding: 5 }}
              type='button'
              className='btn-link'
              onClick={row.edit}
            >
              EDIT
            </button>
            |
            <button
              style={{ marginBottom: '0px', padding: 5 }}
              type='button'
              className='btn-link'
              onClick={row.delete}
            >
              DELETE
            </button>
          </div>
        );
      }
    },
  },
];

class PlanCategoriesManager {
  getPlanCategories(inputs) {
    let payload = {
      page: inputs.page,
      search: inputs.search,
    };
    return PlanService.getPlanCategoriesService(payload);
  }

  addPlanCategories(inputs) {
    let payload = {
      categories: inputs.categories,
    };

    return PlanService.addPlanCategories(payload);
  }

  deletePlanCategory(inputs) {
    let payload = {
      plan_category_id: inputs.selectedCategoryID,
    };

    return PlanService.deletePlanCategory(payload);
  }

  editPlanCategory(inputs) {
    let payload = {
      plan_category_id: inputs.selectedCategoryID,
      category: inputs.selectedCategoryName,
    };

    return PlanService.editPlanCategory(payload);
  }
}

export default PlanCategoriesManager;
