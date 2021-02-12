import React, { useState, useRef } from 'react';
import { Input, Space, Tag } from 'antd';
import { Button } from 'react-bootstrap';
import { SearchOutlined } from '@ant-design/icons';
import { get } from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

import ElderService from '../../service/ElderService';

const elderService = new ElderService();

export const getConsumerData = (
  id,
  tableOptions,
  setTableData,
  setTableOptions,
  setLoading,
) => {
  setLoading(true);

  elderService
    .getEldersListOnDashboard(id)
    .then(result => {
      const tableDataRes = get(result, 'data');

      tableOptions.loading = false;

      delete tableOptions.expandedRowKeys;

      tableDataRes.forEach(data => {
        const firstName = get(data, 'user_assignments.first_name', 'N/A');
        const lastName = get(data, 'user_assignments.last_name', 'N/A');

        const ermFirstName = get(data, 'manager_assignments.first_name', 'N/A');
        const ermLastName = get(data, 'manager_assignments.last_name', 'N/A');

        data.ermName = `${firstName} ${lastName}`;
        data.role = get(data, 'user_role', 'N/A').toUpperCase();
        data.ermSupervisorName = `${ermFirstName} ${ermLastName}`;
        data.isActive = get(data, 'user_assignments.is_active', false);
        data.isAvailable = get(data, 'user_assignments.is_available', false);
      });

      setTableData(tableDataRes);
      setTableOptions(tableOptions);
      setLoading(false);
    })
    .catch(error => {
      setLoading(false);
    });
};

const deleteERMManager = (id, setLoading, setTableData) => {
  setLoading(true);

  elderService
    .deleteERMManager(id)
    .then(() => {
      setLoading(false);
      setTableData(prevState => prevState.filter(item => item.uuid !== id));
    })
    .catch(() => {
      setLoading(false);
    });
};

const getColumnSearchProps = dataIndex => {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const textInputRef = useRef(null);

  return {
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={textInputRef}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(
              selectedKeys,
              confirm,
              dataIndex,
              setSearchText,
              setSearchedColumn,
            )
          }
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(
                selectedKeys,
                confirm,
                dataIndex,
                setSearchText,
                setSearchedColumn,
              )
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => handleReset(clearFilters, setSearchText)}
            size="small"
            style={{ width: 90 }}
          >
            > Reset
          </Button>
        </Space>
      </div>
    ),

    filterIcon: filtered => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),

    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase())
        : '',

    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(
          () => textInputRef.current && textInputRef.current.select(),
          100,
        );
      }
    },

    render: text => {
      if (searchedColumn === dataIndex) {
        if (text) return text;
        text.toString();
      } else return text;
    },
  };
};

const handleSearch = (
  selectedKeys,
  confirm,
  dataIndex,
  setSearchText,
  setSearchedColumn,
) => {
  confirm();
  setSearchText(selectedKeys[0]);
  setSearchedColumn(dataIndex);
};

const handleReset = (clearFilters, setSearchText) => {
  clearFilters();
  setSearchText('');
};

const columnsArray = (setLoading, setTableData) => [
  {
    title: 'ERM Name',
    dataIndex: 'ermName',
    defaultSortOrder: 'ascend',
    sortDirections: ['descend', 'ascend'],
    sorter: (a, b) => a.ermName.localeCompare(b.ermName),
    fixed: 'left',
    width: 250,
    ...getColumnSearchProps('ermName'),
  },
  {
    title: 'Role',
    dataIndex: 'role',
    defaultSortOrder: 'ascend',
    sortDirections: ['descend', 'ascend'],
    sorter: (a, b) => a.role.localeCompare(b.role),
    ...getColumnSearchProps('role'),
    width: 150,
  },
  {
    title: 'ERM Supervisor',
    dataIndex: 'ermSupervisorName',
    defaultSortOrder: 'ascend',
    sortDirections: ['descend', 'ascend'],
    sorter: (a, b) => a.ermSupervisorName.localeCompare(b.ermSupervisorName),
    ...getColumnSearchProps('ermSupervisorName'),
  },
  {
    title: 'Active Status',
    dataIndex: 'isActive',
    defaultSortOrder: 'ascend',
    sortDirections: ['descend', 'ascend'],
    sorter: (a, b) => a.isActive - b.isActive,
    width: 150,
    render: text => (
      <Tag color={text ? 'green' : 'volcano'} key={text}>
        {text ? 'ACTIVE' : 'INACTIVE'}
      </Tag>
    ),
  },
  {
    title: 'Available Status',
    dataIndex: 'isAvailable',
    defaultSortOrder: 'ascend',
    sortDirections: ['descend', 'ascend'],
    sorter: (a, b) => a.isAvailable - b.isAvailable,
    width: 170,
    render: text => (
      <Tag color={text ? 'green' : 'volcano'} key={text}>
        {text ? 'ACTIVE' : 'INACTIVE'}
      </Tag>
    ),
  },
  {
    title: 'Actions',
    key: 'actions',
    width: 100,
    render: row => (
      <div className="record-actions d-flex align-items-center justify-content-start">
        <Button
          variant="light"
          onClick={() => deleteERMManager(row.uuid, setLoading, setTableData)}
          icon={<SearchOutlined />}
          size="small"
          style={{
            paddingTop: 8,
            paddingRight: 10,
            paddingBottom: 8,
            paddingLeft: 10,
          }}
        >
          <FontAwesomeIcon icon={faTrash} />
        </Button>
      </div>
    ),
  },
];

export const columns = (setLoading, setTableData, isEditable = false) => {
  const array = columnsArray(setLoading, setTableData);
  if (!isEditable) array.pop();
  return array;
};
