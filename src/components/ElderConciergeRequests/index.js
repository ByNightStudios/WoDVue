import React from "react";

import { Table } from "antd";
import { connect } from "react-redux";
import { Select, Switch } from "antd";
import { Form, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSyncAlt, faArrowRight } from "@fortawesome/free-solid-svg-icons";

import get from "lodash/get";
import ElderConciergeRequestsDataManager, { tableColumns } from "./dataManager";

import styles from "./elder-concierge-requests.scss";

const { Option } = Select;

class ElderConciergeRequests extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      page: 0,
      tableData: [],
      tableOptions: {
        hasData: true,
        bordered: true,
        loading: false,
        size: "default",
        scroll: {
          x: true,
        },
        showHeader: true,
        pagination: { position: "bottom", pageSize: 0, total: 0, current: 1 },
      },
      searchText: "",
      sortStatus: "",
      backDatedRequest: 1,
    };

    this.elderConciergeRequestsDataManager = new ElderConciergeRequestsDataManager();
  }

  componentDidMount() {
    if (this.state.tableData.length === 0) {
      this.getElderConciergeRequestsTimeOut();
    }
    this.getElderConciergeRequests();
  }

  getElderConciergeRequests = () => {
    setInterval(() => this.getElderConciergeRequestsTimeOut(), 120000);
  };

  getElderConciergeRequestsTimeOut = () => {
    const { searchText, sortStatus, backDatedRequest, page } = this.state;

    this.props.startLoader();

    const payload = {
      page,
      status: sortStatus,
      search: searchText,
      back_dated: backDatedRequest ? 0 : 1,
      currentElderIdentifier: this.props.currentElderIdentifier,
    };

    this.elderConciergeRequestsDataManager
      .getElderConciergeRequests(payload)
      .then((responsedata) => {
        this.props.stopLoader();
        if (responsedata.data) {
          let index = 1;
          let fetchedTableData = get(responsedata, "data");

          this.updateTablePaginationOptions(
            "total",
            get(responsedata, "meta.pagination.total")
          );
          this.updateTablePaginationOptions(
            "pageSize",
            get(responsedata, "meta.pagination.per_page")
          );

          fetchedTableData.forEach((record) => {
            record["index"] = this.state.page * 20 + index++;
          });

          this.setState({
            tableData: fetchedTableData,
          });
        }
      })
      .catch((errorData) => {
        const error = get(
          errorData,
          "response.data.message",
          "Something went wrong. Please try again later"
        );
        this.props.openNotification("Error", error, 0);
        this.props.stopLoader();
      });
  };
  updateTablePaginationOptions = (optionKey, optionValue) => {
    this.setState((state) => ({
      ...state,
      tableOptions: {
        ...state.tableOptions,
        pagination: {
          ...state.tableOptions.pagination,
          [`${optionKey}`]: optionValue,
        },
      },
    }));
  };

  onClickPagination = (page) => {
    this.setState(
      (state) => ({
        ...state,
        page: page - 1,
        tableOptions: {
          ...state.tableOptions,
          pagination: {
            ...state.tableOptions.pagination,
            current: page,
          },
        },
      }),
      () => {
        this.getElderConciergeRequests();
      }
    );
  };

  resetTableData = () => {
    this.setState(
      (state) => ({
        ...state,
        page: 0,
        searchText: "",
        sortStatus: "",
        backDatedRequest: 1,
        tableOptions: {
          ...state.tableOptions,
          pagination: {
            ...state.tableOptions.pagination,
            current: 1,
          },
        },
      }),
      () => {
        this.getElderConciergeRequests();
      }
    );
  };

  handleFieldUpdate = (fieldName, fieldValue) => {
    this.setState(
      (state) => ({
        ...state,
        [`${fieldName}`]: fieldValue,
      }),
      () => this.getElderConciergeRequests()
    );
  };

  onKeyFormSubmission = (evt) => {
    if (evt.key === "Enter" && this.state.searchText) {
      evt.preventDefault();
      evt.stopPropagation();
      this.getElderConciergeRequests();
    }
  };

  render() {
    const { tableOptions, tableData } = this.state;

    return (
      <div className="elder-requests" style={styles}>
        <div className="elder-requests-header d-flex justify-content-between align-items-center">
          <div className="flex-wrapper d-flex align-items-center justify-content-start">
            <h4>Concierge Requests</h4>

            <div className="global-search">
              <Form.Group
                className="position-relative"
                controlId="searchConciergeRequests"
              >
                <Form.Control
                  id="searchConciergeRequests"
                  name="searchConciergeRequests"
                  placeholder="Search Concierge Requests"
                  value={this.state.searchText}
                  onKeyDown={(e) => this.onKeyFormSubmission(e)}
                  onChange={(e) =>
                    this.setState({ searchText: e.currentTarget.value })
                  }
                />
                <Button
                  type="button"
                  className="btn btn-secondary btn-search d-flex align-items-center justify-content-center"
                  disabled={!this.state.searchText}
                  onClick={() => this.getElderConciergeRequests()}
                >
                  <FontAwesomeIcon icon={faArrowRight} />
                </Button>
              </Form.Group>
            </div>
          </div>

          <div className="flex-wrapper d-flex align-item-centern justify-content-end">
            <div className="select-service-type">
              <Select
                value={this.state.sortStatus}
                placeholder="Filter by Status"
                style={{ width: 200 }}
                onChange={(value) => {
                  this.handleFieldUpdate("sortStatus", value);
                }}
              >
                <Option value="">Show All</Option>
                <Option value="0">New</Option>
                <Option value="1">Ongoing</Option>
                <Option value="2">Completed</Option>
                <Option value="3">Cancelled</Option>
                <Option value="4">Feedback Required</Option>
              </Select>
            </div>

            <div className="switch-backdated-list">
              <Switch
                checkedChildren="Current"
                unCheckedChildren="Back Dated"
                defaultChecked
                checked={this.state.backDatedRequest ? true : false}
                onChange={(checkedStatus) =>
                  this.handleFieldUpdate("backDatedRequest", checkedStatus)
                }
              />
            </div>

            <button
              type="button"
              className="btn btn-primary"
              onClick={() => this.resetTableData()}
            >
              <FontAwesomeIcon icon={faSyncAlt} />
            </button>
          </div>
        </div>

        <Table
          rowKey={(record) => record.index}
          {...tableOptions}
          columns={tableColumns}
          dataSource={tableOptions.hasData ? tableData : null}
          pagination={{
            onChange: this.onClickPagination,
            total: tableOptions.pagination.total,
            pageSize: tableOptions.pagination.pageSize,
            current: tableOptions.pagination.current,
          }}
          rowClassName={(record, index) => {
            switch (record.status) {
              case 0:
                return "urgent-priority";
              case 1:
                return "important-priority";
              default:
                return "non-priority";
            }
          }}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  elderdata: state.elder.elderData,
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ElderConciergeRequests);
