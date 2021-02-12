import React, { useState, useRef } from 'react';
import { Input, Space, Button, Popconfirm, Card, Badge } from 'antd';
import { isNull, get } from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEye,
  faHands,
  faComments,
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import {
  EyeFilled,
  SearchOutlined,
  AlertFilled,
  BellFilled,
  CustomerServiceFilled,
  WechatFilled,
} from '@ant-design/icons';

const action = (emergencyAlertAction, setVisible, isSimulated_Alarm) => {
  setVisible(false);
  emergencyAlertAction(isSimulated_Alarm);
};

const CustomPopOver = props => {
  const { title, icon, emergencyAlertAction } = props;

  const [visible, setVisible] = useState(false);

  return (
    <>
      <Popconfirm
        title={title}
        visible={visible}
        onConfirm={() => action(emergencyAlertAction, setVisible, true)}
        onCancel={() => action(emergencyAlertAction, setVisible, false)}
      >
        <Button
          type="link"
          href={null}
          shape="circle"
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onClick={() => setVisible(true)}
          icon={icon}
        />
      </Popconfirm>
    </>
  );
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

export const columns = (emergencyAction, alertAction) => [
  {
    title: 'Cust. ID',
    dataIndex: 'customer_id',
    defaultSortOrder: 'ascend',
    sortDirections: ['descend', 'ascend'],
    sorter: (a, b) => a.customer_id.localeCompare(b.customer_id),
    fixed: 'left',
    width: 180,
    ...getColumnSearchProps('customer_id'),
  },
  {
    title: "Elder's Name",
    dataIndex: 'full_name',
    sortDirections: ['descend', 'ascend'],
    sorter: (a, b) => a.full_name.localeCompare(b.full_name),
    width: 300,
    ...getColumnSearchProps('full_name'),
    render: (text, record) => {
      if (isNull(record.service_initiation_date)) {
        return (
          <Badge.Ribbon text="Service Initialization is Pending">
            <Card style={{ paddingTop: 20 }}>
              <Card.Meta description={record.full_name} />
            </Card>
          </Badge.Ribbon>
        );
      }
      return record.full_name;
    },
  },
  {
    title: "Elder's Contact",
    dataIndex: 'contact_number',
    sortDirections: ['descend', 'ascend'],
    sorter: (a, b) => a.contact_number.localeCompare(b.contact_number),
    width: 200,
    ...getColumnSearchProps('contact_number'),
  },
  {
    title: "Erm name",
    width: 200,
    render: (text, record) =>   `${get(record, 'adminData.admin_user.first_name', 'no erm assigned')} ${get(record, 'adminData.admin_user.last_name', 'no erm assigned')}`,
  },
  {
    title: "Elder's Address",
    dataIndex: 'full_address',
    sortDirections: ['descend', 'ascend'],
    sorter: (a, b) => a.full_address.localeCompare(b.full_address),
    width: 200,
    ...getColumnSearchProps('full_address'),
  },
  {
    title: 'Plan Name',
    dataIndex: 'plan_name',
    sortDirections: ['descend', 'ascend'],
    sorter: (a, b) => a.plan_name.localeCompare(b.plan_name),
    width: 170,
    ...getColumnSearchProps('plan_name'),
  },
  {
    title: 'Plan Status',
    dataIndex: 'plan_status',
    sortDirections: ['descend', 'ascend'],
    sorter: (a, b) => a.plan_status.localeCompare(b.plan_status),
    width: 170,
    ...getColumnSearchProps('plan_status'),
  },
  {
    title: 'Actions',
    key: 'actions',
    fixed: 'right',
    width: 210,
    render: row => (
      <div className="record-actions d-flex align-items-center justify-content-start">
        <Button
          type="link"
          shape="circle"
          href={`/elder/details/${row.id}`}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onClick={null}
          icon={<FontAwesomeIcon icon={faEye} />}
        />

        <CustomPopOver
          title="Is Simulation?"
          icon={<AlertFilled />}
          emergencyAlertAction={isSimulated =>
            emergencyAction(row.id, isSimulated)
          }
        />

        <CustomPopOver
          title="Is False Alarm?"
          icon={<BellFilled />}
          emergencyAlertAction={isFalseAlarm =>
            alertAction(row.id, isFalseAlarm)
          }
        />

        <Button
          type="link"
          shape="circle"
          href={`/concierge/create/${row.id}`}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onClick={null}
          icon={<FontAwesomeIcon icon={faHands} />}
        />

        <Button
          type="link"
          shape="circle"
          href={`/support?id=${row.id}&name=${_.get(
            row,
            'full_name',
            'Unnamed',
          )}&mobile=${_.get(row, 'mobile_number', '')}`}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onClick={null}
          icon={<FontAwesomeIcon icon={faComments} />}
        />
      </div>
    ),
  },
];
