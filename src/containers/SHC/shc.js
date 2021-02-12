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

import ShcSorting from './shcSorting';

const { Title } = Typography;

message.config({
  top: 80,
  maxCount: 1,
});

export function SHCList(props) {
  const dashboardService = new DashboardService();
  const [shcLoading, setSHCLoading] = useState(false);
  const [shcList, setShcList] = useState([]);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const searchInput = useRef(null);
  const [vt, set_components] = useVT(() => ({ scroll: { y: 600 } }), []);

  const {
    location: { pathname },
  } = window;

  useEffect(() => {
      setSHCLoading(true);
      setTimeout(
        () => fetchSHCActiveElderList(0),
        3000
      );
  }, []);

  function fetchSHCActiveElderList(queryData) {
    let payload = {};
    if (isInteger(queryData)) {
      payload["query"] = `?page=${queryData}`;
    } else {
      payload["query"] = `${queryData}`;
    }

    dashboardService
      .shcActiveEldersList(payload)
      .then((responseData) => {
        if (responseData) {
          setShcList(responseData.data);
          setSHCLoading(false);
        }
      })
      .catch((errorData) => {
        throw errorData;
      });
  }


  function getColumnSearchProps(dataIndex) {
    return {
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            ref={ searchInput }
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Search
            </Button>
            <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
              Reset
            </Button>
          </Space>
        </div>
      ),
      filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
  
      onFilter: (value, record) =>
        record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),

      onFilterDropdownVisibleChange: visible => {
        if (visible) {
          setTimeout(
            () => searchInput && searchInput.current && searchInput.current.select()
          )
        }
      },

      render: text =>
        searchedColumn === dataIndex ? (
          <Highlighter
            highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text.toString()}
          />
        ) : (
          text
        ),
    }
  };

  function handleSearch(selectedKeys, confirm, dataIndex) {
    console.log(selectedKeys, confirm, dataIndex);
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  function handleReset(clearFilters) {
    clearFilters();
    setSearchText('');
  };


  const tableChildrenColumns = [
    {
      title: "Service Id",
      dataIndex: "request_service_id",
      key: "request_service_id",
      width: 200,
      fixed: "left",
      render: (text) =>
        text || (
          <Tag
            color="red"
            style={{
              width: 120,
              whiteSpace: "pre-wrap",
              margin: 2,
            }}
          >
            "No Service Happens"
          </Tag>
        ),
    },
    {
      title: "Request Id",
      dataIndex: "service_request_id",
      key: "service_request_id",
      width: 200,
      render: (text) =>
        text || (
          <Tag
            color="red"
            style={{
              width: 120,
              whiteSpace: "pre-wrap",
              margin: 2,
            }}
          >
            "No Service Happens"
          </Tag>
        ),
    },
    {
      title: "Type Of Service",
      dataIndex: "type_of_service",
      key: "type_of_service",
      width: 200,
      render: (text) =>
        text || (
          <Tag
            color="red"
            style={{
              width: 120,
              whiteSpace: "pre-wrap",
              margin: 2,
            }}
          >
            "No Service Happens"
          </Tag>
        ),
    },
    {
      title: "Service Start Date",
      dataIndex: "service_start_date",
      key: "service_start_date",
      width: 200,
      render: (text) => {
        if (text) {
          return moment(text).format("DD/MM/YYYY");
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
            "No Service Happens"
          </Tag>
        );
      },
    },
    {
      title: "Documentation (Forms not filled)",
      width: 200,
      render: (record) => {
        if (record.check_in_data.length > 0) {
          return (
            <ServicePersonRow
              checkInData={record.check_in_data}
              itemKey="daily_doc"
              isCheckInShow={false}
              isShowText
              parentDate={false}
              showDailyDocs
              responderData={record.responde_data}
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
            No Responder Assigned
          </Tag>
        );
      },
    },
    {
      title: "Working hours",
      width: 200,
      render: (record) => {
        if (record.check_in_data.length > 0) {
          return (
            <ServicePersonRow
              checkInData={record.check_in_data}
              itemKey="working_hrs"
              isCheckInShow
              isShowText
              parentDate={false}
              showDailyDocs={false}
              responderData={record.responde_data}
            />
          );
        }
        return "No responder assigned";
      },
    },
    {
      title: "Check In",
      width: 200,
      render: (record) => {
        if (record.check_in_data.length > 0) {
          return (
            <ServicePersonRow
              checkInData={record.check_in_data}
              itemKey="checkin_time"
              isCheckInShow
              isShowText
              parentDate={false}
              showDailyDocs={false}
              responderData={record.responde_data}
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
            No Responder Assigned
          </Tag>
        );
      },
    },
    {
      title: "Check Out",
      width: 200,
      render: (record) => {
        if (record.check_in_data.length > 0) {
          return (
            <ServicePersonRow
              checkInData={record.check_in_data}
              itemKey="checkout_time"
              isCheckInShow
              isShowText
              parentDate={false}
              showDailyDocs={false}
              responderData={record.responde_data}
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
            No Responder Assigned
          </Tag>
        );
      },
    },
  ];
  const columnData = [
    {
      title: "Elder Name",
      dataIndex: "elder_name",
      key: "elder_name",
      width: 150,
      fixed: 'left',
      ...getColumnSearchProps("elder_name"),
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
      sorter: (a, b) => get(a,'el_id','').length - get(b,'el_id','').length,
      sortDirections: ['descend', 'ascend'],
      ...getColumnSearchProps("el_id"),
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
      sorter: (a, b) => get(a,'address','').length - get(b,'address','').length,
      sortDirections: ['descend', 'ascend'],
      ...getColumnSearchProps("address"),
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
      ...getColumnSearchProps("location"),
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

  const setTitle = () => (
    <div className="d-flex flex-row justify-content-between w-100">
      <Title level={4}>Smart Home Care – Active Elders</Title>
    </div>
  );

  function NestedTable() {
  
    const expandedRowRender = (record, index, intent, expanded) => {
      if (record.service_data.length > 0) {
        return (
          <div>
            <Table
              dataSource={record.service_data}
              columns={tableChildrenColumns}
              style={{ padding: 20 }}
              scroll={{ y: 600, x: '90vw' }}
              pagination={{
                pageSize: 5,
              }}
              bordered
            />
          </div>
        );
      }
      return false;
    };


    return (
      <ShcSorting
        dataSource={shcList || []}
        rowKey="elder_name"
        scroll={{ y: 600, x: '100vw' }}
        defaultExpandAllRows={false}
        expandable={{
          expandedRowRender: expandedRowRender,
          rowExpandable: record => !isEmpty(record.service_data),
          expandIcon: ({ expanded, onExpand, record }) => {
            if(!isEmpty(record.service_data)){
              if(expanded){
                return<MinusCircleTwoTone onClick={e => onExpand(record, e)} />
              } else  {
                return <PlusCircleTwoTone onClick={e => onExpand(record, e)} />
              }
            }
            return false;
          }
        }}
        loading={shcLoading}
        components={vt}
        pagination={false}
        title={setTitle}
      />
    );
  }

  return (
    <React.Fragment>
      <div className="shc_elder_list">
        <div className="shc_elder_title d-flex justify-content-end align-items-end">
          <div>
            {props.maximizeLink && (
              <Link to="/shc-elders-list" className="link-full-screen">
                <i class="pi pi-window-maximize"></i>
                Maximize SHC Active Elders
              </Link>
            )}
          </div>
        </div>
        <Card bordered hover>
          <Row justify="end" align="middle">
            Color Labels : <Tag color="geekblue">Care Angel (CA)</Tag>
            <Tag color="blue">Care Partner (CP)</Tag>
            <Tag color="cyan">Nursing Officer (NO)</Tag>
          </Row>
          <NestedTable />
        </Card>
      </div>
    </React.Fragment>
  );
}

export default React.memo(SHCList);
