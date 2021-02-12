import React from 'react';
import CommunityThemeServiceFile from '../../service/CommunityThemeService';
const CommunityThemeService = new CommunityThemeServiceFile();

class CommunityThemeManager {
  getCommunityTheme(inputs) {
    return CommunityThemeService.getCommunityTheme(inputs);
  }
}

export default CommunityThemeManager;

export const columns = [
  {
    title: 'S.No.',
    key: 'indexCount',
    dataIndex: 'index',
    width: 75,
  },
  {
    title: 'Name',
    key: 'theme',
    // width: 200,
    dataIndex: 'theme',
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
          </div>
        );
      }
    },
  },
];
