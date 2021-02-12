/* eslint-disable react/prop-types */
import React, { useState, useRef } from 'react';
import { get, toString } from 'lodash';
import { EyeOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space } from 'antd';

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
            Reset
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
        toString(text);
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

export const columnsData = () => [
  {
    title: 'Customer Id',
    dataIndex: 'customer_id',
    key: 'customer_id',
    sorter: (a, b) =>
      get(a, 'customer_id.length', []) - get(b, 'customer_id.length', []),
    sortDirections: ['descend', 'ascend'],
    ...getColumnSearchProps('customer_id'),
    render: text => text || 'N/A',
  },
  {
    title: 'Name',
    dataIndex: 'full_name',
    key: 'full_name',
    sorter: (a, b) =>
      get(a, 'full_name.length', []) - get(b, 'full_name.length', []),
    sortDirections: ['descend', 'ascend'],
    ...getColumnSearchProps('full_name'),
  },
  {
    title: 'Mobile Number',
    dataIndex: 'mobile_number',
    key: 'mobile_number',
    sorter: (a, b) =>
      get(a, 'mobile_number.length', []) - get(b, 'mobile_number.length', []),
    sortDirections: ['descend', 'ascend'],
    ...getColumnSearchProps('mobile_number'),
  },
  {
    title: 'Operations',
    render: row => (
      <Button
        type="secondary"
        shape="square"
        href={`/elder-profile/${row.uuid}`}
        onClick={null}
        icon={<EyeOutlined />}
      />
    ),
  },
];
