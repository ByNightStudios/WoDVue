import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Input, Space, Tooltip, Button, Row, Card, Badge, Popconfirm } from 'antd';
import moment from 'moment';
import { isEmpty, toNumber, isNull } from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEye,
  faHands,
  faComments,
} from '@fortawesome/free-solid-svg-icons';
import {
  SearchOutlined,
  HighlightOutlined,
  DeleteOutlined,
  LinkOutlined,
  EyeFilled,
  AlertFilled,
  BellFilled,
  CustomerServiceFilled,
  WechatFilled,
} from '@ant-design/icons';

function renderStatus(data) {
  // Inactive, Scheduled for Initiation, Active, Paused, Expired, Cancelled)
  switch (toNumber(data)) {
    case 0 || '0':
      return 'Scheduled for Initiation';
    case 1 || '1':
      return 'Active';
    case 2 || '2':
      return 'Expired';
    case 3 || '3':
      return 'Cancelled';
    case 4 || '4':
      return 'On Hold';
    default:
      return 'N/A';
  }
}

const action = (emergencyAlertAction, setVisible, isSimulated_Alarm) => {
  setVisible(false);
  emergencyAlertAction(isSimulated_Alarm);
};


const CustomPopOver = props => {
  const { title, icon, emergencyAlertAction, disabled } = props;

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
          type="secondary"
          href={null}
          shape="circle"
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onClick={() => setVisible(true)}
          icon={icon}
          disabled={disabled}
        />
      </Popconfirm>
    </>
  );
};

const getColumnSearchProps = dataIndex => {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const textInputRef = useRef(null);
  const [record, setRecord] = useState('');

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

export const columns = (filteredInfo, isEdit, handleOpenModal, handleDeleteModal, emergencyAction, alertAction) => [
  {
    title: 'Customer Id',
    dataIndex: 'customer_id',
    sortDirections: ['descend', 'ascend'],
    sorter: (a, b) => a.customer_id.localeCompare(b.customer_id),
    width: 200,
    ...getColumnSearchProps('customer_id'),
    fixed: 'left',
    render: (text, record) => <Link to={`elder/details/${record.uuid}`}>{text}</Link>
  },
  {
    title: "Elder's Name",
    dataIndex: 'full_name',
    sortDirections: ['descend', 'ascend'],
    sorter: (a, b) => a.full_name.localeCompare(b.full_name),
    width: 300,
    ...getColumnSearchProps('full_name'),
    render: (text, record) => {
      if (isNull(record.adminData)) {
        return (
          <Badge.Ribbon text="Erm Initialization is Pending">
            <Card style={{ paddingTop: 20 }}>
              <Link to={`elder/details/${record.uuid}`}><Card.Meta description={record.full_name} /></Link>
            </Card>
          </Badge.Ribbon>
        );
      }
      return <Link to={`elder/details/${record.uuid}`}><Card.Meta description={record.full_name} /></Link>
    },
  },
  {
    title: 'Age of Record',
    dataIndex: 'how_old_user',
    width: 200,
    render: (text) => `${text} days`
  },
  {
    title: "Elder's Contact",
    dataIndex: 'mobile_number',
    sortDirections: ['descend', 'ascend'],
    sorter: (a, b) => a.mobile_number.localeCompare(b.mobile_number),
    width: 200,
    ...getColumnSearchProps('mobile_number'),
  },
  {
    title: "Elder's Address",
    dataIndex: 'full_address',
    sortDirections: ['descend', 'ascend'],
    width: 200,
  },
  {
    title: 'Plan Name',
    dataIndex: 'name',
    sortDirections: ['descend', 'ascend'],
    sorter: (a, b) => a.name.localeCompare(b.name),
    width: 170,
    ...getColumnSearchProps('name'),
  },
  {
    title: 'ERM Name',
    dataIndex: 'erm_name',
    sortDirections: ['descend', 'ascend'],
    sorter: (a, b) => a.erm_name.localeCompare(b.erm_name),
    width: 170,
  },
  {
    title: 'Plan Status',
    dataIndex: 'plan_status',
    sortDirections: ['descend', 'ascend'],
    sorter: (a, b) => a.plan_status.localeCompare(b.plan_status),
    width: 170,
    render: text => renderStatus(text),
  },
  {
    title: 'Created At',
    dataIndex: 'created_at',
    width: 170,
    render: text => moment(text).format('DD/MM/YYYY hh:mm:ss a'),
  },
  {
    title: 'Operations',
    width: 200,
    fixed: 'right',
    render: (text, record) => (
      <Row type="flex" justify="center" align="middle" >
        <Tooltip title="Assign ERM">
          <Button
            type="primary"
            shape="circle"
            icon={<HighlightOutlined />}
            onClick={() => handleOpenModal(record)}
            disabled={!isEdit || !isEmpty(record.adminData)}
          />
        </Tooltip>
        <Tooltip title="Un Assign ERM">
          <Button
            type="primary"
            shape="circle"
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteModal(record)}
            disabled={!isEdit || isEmpty(record.adminData)}
            style={{ margin: 5 }}
          />
        </Tooltip>
        <Button
          type="secondary"
          shape="circle"
          href={`/elder/details/${record.uuid}`}
          onClick={null}
          icon={<FontAwesomeIcon icon={faEye} />}
          disabled={isEdit}
          style={{ margin: 5 }}
        />

        <CustomPopOver
          title="Is Simulation?"
          icon={<AlertFilled />}
          emergencyAlertAction={isSimulated =>
            emergencyAction(record.uuid, isSimulated)
          }
          disabled={isEdit}
          style={{ margin: 5 }}
        />

        <CustomPopOver
          title="Is False Alarm?"
          icon={<BellFilled />}
          emergencyAlertAction={isFalseAlarm =>
            alertAction(record.uuid, isFalseAlarm)
          }
          disabled={isEdit}
          style={{ margin: 5 }}
        />

        <Button
          type="secondary"
          shape="circle"
          href={`/concierge/create/${record.uuid}`}
          onClick={null}
          icon={<FontAwesomeIcon icon={faHands} />}
          disabled={isEdit}
          style={{ margin: 5 }}
        />
        <Button
          type="secondary"
          shape="circle"
          href={`/support?id=${record.uuid}&name=${_.get(
            record,
            'full_name',
            'Unnamed',
          )}&mobile=${_.get(record, 'mobile_number', '')}`}
          onClick={null}
          icon={<FontAwesomeIcon icon={faComments} />}
          disabled={isEdit}
          style={{ margin: 5 }}
        />
      </Row>
    ),
  },
];
