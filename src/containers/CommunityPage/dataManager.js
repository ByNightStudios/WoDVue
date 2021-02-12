import React from 'react';
import {
  getCommunityPostListService,
  deleteCommunityPostService,
} from '../../service/CommunityServices';

export const columns = [
  {
    title: 'S.No.',
    key: 'indexCount',
    dataIndex: 'index',
  },
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: 'Type',
    key: 'type',
    render: (text, row) => {
      let type = null;
      if (row.category_type === 2) {
        type = 'Event';
      } else if (row.category_type === 3) {
        type = 'Offer';
      } else if (row.category_type === 1) {
        type = 'Blog';
      }

      return (
        <div className='status-details'>
          <div
            className={`status-details-param d-flex align-items-center justify-content-start`}
          >
            <span className='status-details-description'>{type}</span>
          </div>
        </div>
      );
    },
  },
  {
    title: 'Theme',
    dataIndex: 'theme',
    key: 'theme',
  },
  {
    title: 'Timeline',
    dataIndex: 'updated_at_formatted',
    key: 'timeline',
  },
  {
    title: 'Status',
    key: 'status',
    render: (text, row) => {
      let status = null;
      let classToggle = '';
      if (row.status === 1) {
        status = 'Draft';
        classToggle = '-param--orange';
      } else if (row.status === 2) {
        status = 'Published';
        classToggle = '-param--green';
      } else if (row.status === 3) {
        status = 'Unpublished';
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
    title: 'Actions',
    key: 'actions',
    render: (text, row) => {
      return (
        <div className='record-actions d-flex align-items-center justify-content-start'>
          <a
            className='btn btn-link'
            style={{ padding: 5 }}
            href={`community/${row.category.toLowerCase()}/view/${row.id}`}
            target='_blank'
            rel='noopener noreferrer'
          >
            View
          </a>{' '}
          |{' '}
          <button
            type='button'
            className='btn btn-link'
            style={{ padding: 5 }}
            onClick={() => row.onEdit()}
          >
            Edit
          </button>{' '}
          |{' '}
          <button
            type='button'
            style={{ padding: 5 }}
            className='btn btn-link'
            onClick={() => row.onDelete()}
          >
            Delete
          </button>
        </div>
      );
    },
  },
];

export const getCommunityPostList = (page, query, status) => {
  return getCommunityPostListService(page, query, status)
    .then((data) => {
      return data;
    })
    .catch((error) => {
      throw error;
    });
};

export const deleteCommunityPostList = (id) => {
  return deleteCommunityPostService(id)
    .then((data) => {
      return data;
    })
    .catch((error) => {
      throw error;
    });
};
