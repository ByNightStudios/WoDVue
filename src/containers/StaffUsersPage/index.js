import React from "react";

import { Table, notification } from "antd";
import { Link } from "react-router-dom";
import { Button, Form } from "react-bootstrap";

import PageLoader from "../../components/PageLoader";
import SideNavigation from "../../components/SideNavigation";

import { ROUTES } from "../../common/constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretRight,
  faPlus,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import { columns } from "./dataManager";
import { getRenderingHeader } from "../../common/helpers";

import { connect } from "react-redux";
import { staffList } from "../../actions/StaffActions";
import requireAuth from "../../hoc/requireAuth";
import { get } from "lodash";
import SubHeader from "../../components/SubHeader";
import { updateUserStatus } from "../../actions/UserActions";
import AdminService from "../../service/AdminService";
import hasPermission from "../../hoc/hasPermission";

import styles from "./staff-users-page.scss";
class StaffUsersPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tableOptions: {
        showHeader: true,
        hasData: true,
        bordered: true,
        loading: false,
        size: "default",
        // expandedRowRender: this.expandedRowRender,
        pagination: { position: "bottom", total: 0, pageSize: 0 },
      },
      navigationDeployed: true,
      tableData: [],
      showNotification: false,
      page: 1,
      loader: false,
      search: "",
    };

    this.adminService = new AdminService();
  }

  // expandedRowRender = (record) => {
  //   return <ExpandedRowRender record={record} onClick={this.notification} />;
  // };

  notification = (message, description, status) => {
    this.openNotification(message, description, status);
    if (status) this.getStaffDataTimeOut();
  };

  openNotification = (message, description, status) => {
    let style = { color: "green" };
    if (!status)
      style = {
        color: "red",
      };
    const args = {
      message,
      description,
      duration: 5,
      style,
    };
    notification.open(args);
  };

  handleNavigationToggle = () => {
    this.setState({ navigationDeployed: !this.state.navigationDeployed });
  };

  componentDidMount() {
    document.title = "Emoha Admin | Staff";
    this.getStaffData();
    if (this.state.tableData.length === 0) {
      this.getStaffDataTimeOut();
    }
  }

  getStaffDataTimeOut = () => {
    let { tableData, tableOptions } = this.state;

    let payload = {
      page: this.state.page,
      query: this.state.search,
    };

    this.setState({ loader: true });
    this.adminService
      .getAdminsList(payload)
      .then((result) => {
        tableOptions["pagination"]["total"] = get(
          result,
          "meta.pagination.total"
        );
        tableOptions["pagination"]["pageSize"] = get(
          result,
          "meta.pagination.per_page"
        );
        tableData = get(result, "data");

        let index = 1;
        tableData.forEach((data) => {
          data["index"] = index++;
          data["updateStatus"] = () =>
            this.updateStaffStatusHandler(data.id, data.is_active);
        });

        this.setState({ tableData, tableOptions, loader: false });
      })
      .catch((error) => {
        this.setState({ loader: false });
      });
  };
  getStaffData = () => {
    setInterval(() => this.getStaffDataTimeOut(), 120000);
  };

  onClickPagination = (page) => {
    document.getElementById("table-id").scrollTop = 0;
    this.setState({ page }, () => {
      this.getStaffDataTimeOut();
    });
  };

  updateStaffStatusHandler = (consumer_id, is_active) => {
    let status;
    if (is_active) status = 0;
    else status = 1;

    this.setState({ loader: true });
    this.props
      .updateUserStatus(consumer_id, status)
      .then((result) => {
        this.openNotification(
          "Success",
          "Staff Status Updated Successfully.",
          1
        );
        this.setState({ loader: false });
        this.getStaffDataTimeOut();
      })
      .catch((error) => {
        this.openNotification("Success", error.message, 0);
        this.setState({ loader: false });
      });
  };

  componentWillReceiveProps(newProps) {
    // window.location.reload();
  }

  onKeyFormSubmission = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      this.getStaffDataTimeOut(1, this.state.search);
    }
  };

  getRenderingSubHeader = () => {
    const leftChildren = [<h2 key={0}>Staff Users</h2>];

    const rightChildren = [
      <div className="global-search global-search--margined" key={0}>
        <Form.Group className="position-relative" controlId="searchEmergencies">
          <Form.Control
            placeholder="Search for Staff Users"
            onKeyDown={(e) => this.onKeyFormSubmission(e)}
            onChange={(e) => this.setState({ search: e.currentTarget.value })}
          />
          <Button
            type="button"
            className="btn btn-secondary btn-search d-flex align-items-center justify-content-center"
            onClick={() => this.getStaffDataTimeOut(1, this.state.search)}
          >
            <FontAwesomeIcon icon={faArrowRight} />
          </Button>
        </Form.Group>
      </div>,
      <Link to={ROUTES.ADDSTAFF} className="btn btn-primary" key={1}>
        <FontAwesomeIcon icon={faPlus} /> Add New
      </Link>,
    ];

    return (
      <SubHeader leftChildren={leftChildren} rightChildren={rightChildren} />
    );
  };

  render() {
    const { navigationDeployed, tableOptions } = this.state;

    return (
      <React.Fragment>
        {getRenderingHeader(this.props.user)}
        <div
          className={
            navigationDeployed
              ? "staffusers-page sidebar-page sidebar-page--open position-relative"
              : "staffusers-page sidebar-page sidebar-page--closed position-relative"
          }
          style={styles}
        >
          {/* {this.state.showNotification ? this.openNotification('Success') : null} */}
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
                  dataSource={
                    tableOptions.hasData ? this.state.tableData : null
                  }
                  //onChange={this.onClickPagination}
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
  requireAuth(
    connect(mapStateToProps, { staffList, updateUserStatus })(StaffUsersPage)
  )
);
