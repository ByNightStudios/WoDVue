import React from "react";

import { Table, Select } from "antd";
import { Button, Form } from "react-bootstrap";

import SubHeader from "../../components/SubHeader";
import PageLoader from "../../components/PageLoader";
import SideNavigation from "../../components/SideNavigation";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretRight, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import OrdersManagerFile, { columns } from "./dataManager";
import { getRenderingHeader } from "../../common/helpers";
import requireAuth from "../../hoc/requireAuth";
import { connect } from "react-redux";
import { get, isEmpty } from "lodash";
import queryString from "query-string";

import hasPermission from "../../hoc/hasPermission";

import styles from "./orders-page.scss";

const { Option } = Select;

const OrdersManager = new OrdersManagerFile();

class OrdersPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tableData: [],
      tableOptions: {
        showHeader: true,
        hasData: true,
        bordered: true,
        loading: false,
        pagination: { position: "bottom", total: 0, pageSize: 20 },
      },
      navigationDeployed: true,
      page: 1,
      loader: false,
      search: "",
      status: null,
    };
  }

  componentDidMount() {
    document.title = "Emoha Admin | Orders";

    let queryObject = queryString.parse(window.location.search);

    if (this.state.tableData.length === 0 && isEmpty(queryObject)) {
      this.getOrdersDataTimeOut();
    }

    if ("search" in queryObject) {
      this.setState({ search: queryObject.search }, () => {
        this.getOrdersDataTimeOut();
      });
    } else this.getOrdersData();
  }

  setStatus = (status) => {
    this.setState(
      {
        status,
      },
      () => {
        this.getOrdersDataTimeOut();
      }
    );
  };

  getOrdersDataTimeOut = () => {
    let { tableData, tableOptions } = this.state;

    this.setState({ loader: true });

    const { page, search, status } = this.state;

    const payload = {
      page,
      search,
      status,
    };

    OrdersManager.getOrdersData(payload)
      .then((result) => {
        tableOptions["pagination"]["total"] = get(
          result,
          "meta.pagination.total"
        );
        tableOptions["pagination"]["pageSize"] = get(
          result,
          "meta.pagination.perPage"
        );

        if (result.data) tableData = get(result, "data");
        else tableData = [];
        tableOptions["loading"] = false;
        let index = 1;
        tableData.forEach((data) => {
          data["index"] =
            (this.state.page - 1) * get(result, "meta.pagination.perPage") +
            index++;
        });

        this.setState({ tableData, tableOptions, page, loader: false });
      })
      .catch((error) => {
        this.setState({ loader: false });
      });
  };
  getOrdersData = () => {
    setInterval(() => this.getOrdersDataTimeOut(), 120000);
  };

  onClickPagination = (page) => {
    document.getElementById("table-id").scrollTop = 0;
    this.setState({ page }, () => {
      this.getOrdersDataTimeOut();
    });
  };

  handleNavigationToggle = () => {
    this.setState({ navigationDeployed: !this.state.navigationDeployed });
  };

  componentWillReceiveProps = async (newProps) => {
    // window.location.reload();
  };

  onKeyFormSubmission = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();

      window.location.href = `/orders?search=${this.state.search}`;
    }
  };

  getRenderingSubHeader = () => {
    const leftChildren = [
      <h2 key={0}>Orders</h2>,
      <div className="select-service-type" key={1}>
        <Select
          showSearch
          placeholder="Select Servie Type"
          style={{ width: 200 }}
          onChange={(value) => {
            this.setStatus(value);
          }}
          defaultValue={null}
        >
          <Option value={null}>All</Option>
          <Option value={0}>Created</Option>
          <Option value={1}>Confirmed</Option>
          <Option value={2}>Expired</Option>
          <Option value={3}>Failed</Option>
        </Select>
      </div>,
    ];

    const rightChildren = [
      <div className="global-search" key={3}>
        <Form.Group className="position-relative" controlId="searchEmergencies">
          <Form.Control
            placeholder="Search for Orders"
            onKeyDown={(e) => this.onKeyFormSubmission(e)}
            onChange={(e) => this.setState({ search: e.currentTarget.value })}
            value={this.state.search}
          />
          <Button
            type="button"
            className="btn btn-secondary btn-search d-flex align-items-center justify-content-center"
            onClick={() => {
              window.location.href = `/orders?search=${this.state.search}`;
            }}
          >
            <FontAwesomeIcon icon={faArrowRight} />
          </Button>
        </Form.Group>
      </div>,
    ];

    return (
      <SubHeader leftChildren={leftChildren} rightChildren={rightChildren} />
    );
  };

  render() {
    const { navigationDeployed, tableOptions, tableData } = this.state;

    return (
      <React.Fragment>
        {getRenderingHeader(this.props.user)}
        <div
          className={
            navigationDeployed
              ? "elders-page sidebar-page sidebar-page--open position-relative"
              : "elders-page sidebar-page sidebar-page--closed position-relative"
          }
          style={styles}
        >
          {navigationDeployed ? (
            <SideNavigation handleClose={this.handleNavigationToggle} />
          ) : (
            <Button
              type="button"
              className="btn btn-trigger"
              onClick={this.handleNavigationToggle}
            >
              <FontAwesomeIcon icon={faCaretRight} size="2x" color="#780001" />
            </Button>
          )}

          <main className="sidebar-page-wrapper position-relative">
            {/* Include the Sub Header on the Page */}
            {this.getRenderingSubHeader()}

            <div className="internal-content" id="table-id">
              <div>
                <Table
                  rowKey={(record) => record.index}
                  {...tableOptions}
                  columns={columns}
                  dataSource={tableOptions.hasData ? tableData : null}
                  pagination={{
                    onChange: this.onClickPagination,
                    pageSize: this.state.tableOptions.pagination.pageSize,
                    total: this.state.tableOptions.pagination.total,
                  }}
                />
              </div>
            </div>
          </main>
        </div>

        {/* ENABLE THIS PAGE LOADER CONDITIONALLY */}
        {this.state.loader ? <PageLoader /> : null}
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user.user,
});

export default hasPermission(
  requireAuth(connect(mapStateToProps, {})(OrdersPage))
);
