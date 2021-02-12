import React, { useState, useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Table,
  Input,
  Card,
  Button,
  Icon,
  message,
  Typography,
  Badge,
  Tag,
  Row,
  Space
} from "antd";
import classNames from 'classnames';
import { Menu, Dropdown } from "antd";
import { PlusCircleTwoTone, MinusCircleTwoTone } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import DashboardService from "../../service/DashboardService";
import moment from "moment";
import { isEmpty, get, isInteger } from "lodash";

import ServicePersonRow from "./ServicePersonRow";
import ParentServicePersonRow from "./ParentServicePersonRow";
import ParentServicePersonRowService from "./ParentServicePersonRowService";
import { useVT } from 'virtualizedtableforantd4';
import 'antd/dist/antd.css';
import { SearchOutlined } from '@ant-design/icons';
import "./shc.scss";

const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
  },
  {
    key: '2',
    name: 'Joe Black',
    age: 42,
    address: 'London No. 1 Lake Park',
  },
  {
    key: '3',
    name: 'Jim Green',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
  },
  {
    key: '4',
    name: 'Jim Red',
    age: 32,
    address: 'London No. 2 Lake Park',
  },
];

export default class App extends React.Component {
  state = {
    searchText: '',
    searchedColumn: '',
  };

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

  render() {
    const columns = [
        {
          title: "Elder Name",
          dataIndex: "elder_name",
          key: "elder_name",
          width: 150,
          fixed: 'left',
          ...this.getColumnSearchProps("elder_name"),
          render: (record, row) => {
            return (
              <Link
                to={"/elder/details/" + row["user_uuid"]}
                title="Go to Elder Page"
                className="link_eldername"
              >
                <Badge.Ribbon text={get(row, 'service_data', []).length} color="#780001">
                  <Card>{row["elder_name"]}</Card>
                </Badge.Ribbon>
              </Link>
            );
          },
        },
        {
          title: "Type of Service",
          width: 200,
          render: (record) => {
            if (get(record, "service_data", []).length > 0) {
              return (
                <ParentServicePersonRowService
                  parentRow={get(record, "service_data", [])}
                  parentKey="type_of_service"
                  isCheckInShow={false}
                  isShowText
                />
              );
            }
            return (
              <Tag
                color="red"
                style={{
                  width: 120,
                  whiteSpace: "pre-wrap",
                  margin: 2,
                }}
              >
                "No ticket Created"
              </Tag>
            );
          },
        },
        {
          title: "Service Start Date",
          width: 250,
          render: (record) => {
            if (get(record, "service_data", []).length > 0) {
              return (
                <ParentServicePersonRowService
                  parentRow={get(record, "service_data", [])}
                  parentKey="service_start_date"
                  isCheckInShow={false}
                  isShowText
                  parentDate
                  showDailyDocs={false}
                />
              );
            }
            return (
              <Tag
                color="red"
                style={{
                  width: 120,
                  whiteSpace: "pre-wrap",
                  margin: 2,
                }}
              >
                "No ticket Created"
              </Tag>
            );
          },
        },
        {
          title: "Documentation (Forms not filled)",
          width: 200,
          render: (record) => {
            if (record.service_data.length > 0) {
              return (
                <ParentServicePersonRow
                  parentRow={get(record, "service_data", [])}
                  parentKey="daily_doc"
                  isCheckInShow={false}
                  isShowText
                  parentDate={false}
                  showDailyDocs
                />
              );
            }
            return (
              <Tag
                color="red"
                style={{
                  width: 120,
                  whiteSpace: "pre-wrap",
                  margin: 2,
                }}
              >
                " No Responder Assigned"
              </Tag>
            );
          },
        },
        {
          title: "Working Hrs",
          width: 200,
          render: (record) => {
            if (record.service_data.length > 0) {
              return (
                <ParentServicePersonRow
                  parentRow={get(record, "service_data", [])}
                  parentKey="working_hrs"
                  isCheckInShow
                  isShowText
                  parentDate={false}
                  showDailyDocs={false}
                />
              );
            }
            return (
              <Tag
                color="red"
                style={{
                  width: 120,
                  whiteSpace: "pre-wrap",
                  margin: 2,
                }}
              >
                " No Responder Assigned"
              </Tag>
            );
          },
        },
        {
          title: "Check In",
          width: 200,
          render: (record) => {
            if (record.service_data.length > 0) {
              return (
                <ParentServicePersonRow
                  parentRow={get(record, "service_data", [])}
                  parentKey="checkin_time"
                  isCheckInShow
                  isShowText
                  parentDate={false}
                  showDailyDocs={false}
                />
              );
            }
            return (
              <Tag
                color="red"
                style={{
                  width: 120,
                  whiteSpace: "pre-wrap",
                  margin: 2,
                }}
              >
                " No Responder Assigned"
              </Tag>
            );
          },
        },
        {
          title: "Check Out",
          width: 200,
          render: (record) => {
            if (record.service_data.length > 0) {
              return (
                <ParentServicePersonRow
                  parentRow={get(record, "service_data", [])}
                  parentKey="checkout_time"
                  isCheckInShow
                  isShowText
                  parentDate={false}
                  showDailyDocs={false}
                />
              );
            }
            return (
              <Tag
                color="red"
                style={{
                  width: 120,
                  whiteSpace: "pre-wrap",
                  margin: 2,
                }}
              >
                " No Responder Assigned"
              </Tag>
            );
          },
        },
        {
          title: "Elder Id",
          dataIndex: "elder_id",
          key: "el_id",
          width: 200,
          sorter: (a, b) => get(a,'el_id',[]).length - get(b,'el_id',[]).length,
          sortDirections: ['descend', 'ascend'],
          ...this.getColumnSearchProps("el_id"),
          render: (row) =>
            row || (
              <Tag
                color="red"
                style={{
                  width: 50,
                  whiteSpace: "pre-wrap",
                  margin: 2,
                }}
              >
                "N/A"
              </Tag>
            ),
        },
        {
          title: "Address",
          dataIndex: "address",
          key: "address",
          width: 220,
          sorter: (a, b) => get(a,'address',[]).length - get(b,'address',[]).length,
          sortDirections: ['descend', 'ascend'],
          ...this.getColumnSearchProps("address"),
          render: (row) =>
            row || (
              <Tag
                color="red"
                style={{
                  width: 120,
                  whiteSpace: "pre-wrap",
                  margin: 2,
                }}
              >
                "No Address found"
              </Tag>
            ),
        },
        {
          title: "Location",
          dataIndex: "location",
          key: "location",
          width: 200,
          ...this.getColumnSearchProps("location"),
          render: (row) =>
            row || (
              <Tag
                color="red"
                style={{
                  width: 120,
                  whiteSpace: "pre-wrap",
                  margin: 2,
                }}
              >
                "No Location found"
              </Tag>
            ),
        },
      ];
    return <Table columns={columns} dataSource={this.props.dataSource} {...this.props} />;
  }
}