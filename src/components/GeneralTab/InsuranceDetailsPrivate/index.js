import React, { useContext, useState, useEffect, useRef } from 'react';
import { Table, Input, Button, Popconfirm, Form, Modal, Space } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import moment from 'moment';
import InsuranceForm from './insuranceForm';

import { checkIsErmOrErmSuperVisor } from '../../../utils/checkElderEditPermission';
import ElderDetailsDataManager from "../../ElderDetails/dataManager";
import './style.scss';

const elderManager = new ElderDetailsDataManager();
const EditableContext = React.createContext(null);

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};
export default class InsuranceDetailsPrivate extends React.Component {

  constructor(props) {
    super(props);
    this.columns = [
      {
        title: 'Health Insurance Company Name',
        dataIndex: 'insurance_company_name',
        width: '200',
        fixed: 'left',
        sorter: (a, b) => a.insurance_company_name.length - b.insurance_company_name.length,
        sortDirections: ['descend','ascend'],
        ...this.getColumnSearchProps('insurance_company_name'),
      },
      {
        title: 'Health Insurance Number',
        dataIndex: 'insurance_number',
        sorter: (a, b) => a.insurance_number.length - b.insurance_number.length,
        sortDirections: ['descend','ascend'],
        ...this.getColumnSearchProps('insurance_number'),
      },
      {
        title: 'Validity from date',
        dataIndex: 'from_date',
        sorter: (a, b) => a.from_date.length - b.from_date.length,
        sortDirections: ['descend','ascend'],
        ...this.getColumnSearchProps('from_date'),
        render:(text) => moment(text).format('DD-MM-YYYY')
      },
      {
        title: 'Expiry On date',
        dataIndex: 'expiry_date',
        sorter: (a, b) => a.expiry_date.length - b.expiry_date.length,
        sortDirections: ['descend','ascend'],
        ...this.getColumnSearchProps('expiry_date'),
        render:(text) => moment(text).format('DD-MM-YYYY')
      },
      {
        title: 'Contact Details Of Insurance Agent',
        dataIndex: 'insurance_agent',
        sorter: (a, b) => a.insurance_agent.length - b.insurance_agent.length,
          sortDirections: ['descend','ascend'],
        ...this.getColumnSearchProps('insurance_agent'),
      }
    ];

    this.state = {
      dataSource: [],
      count: 2,
      openModal: false,
      searchText: '',
    searchedColumn: '',
    };
  }

  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        : '',
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select(), 100);
      }
    },
    render: text =>
      this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: '' });
  };

  componentDidMount(){
    const payload = {
      id: this.props.currentElderIdentifier,
    }

    elderManager.elderService.getInsuranceDetails(payload).then(res => {
     if(res){
       this.setState({
         dataSource: res.data
       })
     }
    })
  }

  handleDelete = (key) => {
    const dataSource = [...this.state.dataSource];
    this.setState({
      dataSource: dataSource.filter((item) => item.key !== key),
    });
  };

  handleAdd = () => {
    this.setState({ openModal: true });
  };

  handleSave = (row) => {
    const newData = [...this.state.dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    this.setState({
      dataSource: newData,
    });
  };

  handleOk = () => {
    this.setState({ openModal: false });
  }

  handleCancel = () => {
    this.setState({ openModal: false });
    const payload = {
      id: this.props.currentElderIdentifier,
    }
    elderManager.elderService.getInsuranceDetails(payload).then(res => {
      if(res){
        this.setState({
          dataSource: res.data
        })
      }
     })
  }

  render() {
    const { dataSource } = this.state;

    const components = {
      body: {
        row: EditableRow,
        cell: EditableCell,
      },
    };

    const columns = this.columns.map((col) => {
      if (!col.editable) {
        return col;
      }

      return {
        ...col,
        onCell: (record) => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
        }),
      };
    });

    return (
      <div className="w-100" style={{ marginBottom: 50 }}>
        <Button
          onClick={this.handleAdd}
          type="primary"
          style={{
            marginBottom: 16,
          }}
          disabled={checkIsErmOrErmSuperVisor(
            this.props.user,
            this.props.elderData,
          )}
        >
          Add insurance details
        </Button>
        <Table
          components={components}
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          scroll={{ y: 300, x: 1000 }}
        />
        <Modal title="Insurance Detail" visible={this.state.openModal} onOk={this.handleOk} onCancel={this.handleCancel} footer={false}>
          <InsuranceForm {...this.props} handleCancel={this.handleCancel} />
      </Modal>
      </div>
    );
  }
}