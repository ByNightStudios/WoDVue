import React from "react";

import { Table } from "antd";
import { Link } from "react-router-dom";
import { Button, Form } from "react-bootstrap";

import SideNavigation from "../../components/SideNavigation";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretRight,
  faPlus,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import { columns } from "./dataManager";
import PageLoader from "../../components/PageLoader";
import { getRenderingHeader } from "../../common/helpers";
import requireAuth from "../../hoc/requireAuth";
import { connect } from "react-redux";
import {
  responderList,
  updateResponderAvailibilty,
} from "../../actions/ResponderActions";
import { ROUTES } from "../../common/constants";
import { get } from "lodash";
import { notification } from "antd";
import SubHeader from "../../components/SubHeader";
import { updateUserStatus } from "../../actions/UserActions";
import hasPermission from "../../hoc/hasPermission";

import styles from "./responders-page.scss";

class RespondersPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tableData: [],
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
      page: 1,
      loader: false,
      search: "",
    };
  }

  componentDidMount() {
    document.title = "Emoha Admin | Responders";
    if (this.state.tableData.length === 0) {
      this.getResponderDataTimeOut(1);
    }
    this.getResponderData(1);
  }

  // expandedRowRender = record => {
  //   return <ExpandedRowRender record={record} onClick={this.notification} />;
  // };

  notification = (message, description, status) => {
    this.openNotification(message, description, status);
    if (status) this.getResponderDataTimeOut(this.state.page);
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

  getResponderDataTimeOut = (page, query) => {
    let { tableData, tableOptions } = this.state;
    this.setState({ loader: true });
    this.props
      .responderList(page, this.state.search)
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
        tableOptions["loading"] = false;

        let index = 1;
        tableData.forEach((data) => {
          data["index"] = index++;
          data["updateStatus"] = () =>
            this.updateResponderStatusHandler(data.id, data.is_active);
        });

        this.setState({ tableData, tableOptions, page, loader: false });
      })
      .catch((error) => {
        this.setState({ loader: false });
      });
  };

  getResponderData = (page, query) => {
    setInterval(() => this.getResponderDataTimeOut(page, query), 120000);
  };
  onClickPagination = (page) => {
    //let { current } = page;
    document.getElementById("table-id").scrollTop = 0;
    this.getResponderDataTimeOut(page);
    this.setState({ page });
  };

  handleNavigationToggle = () => {
    this.setState({ navigationDeployed: !this.state.navigationDeployed });
  };

  updateResponderStatusHandler = (responder_uuid, is_active) => {
    let responderStatus;
    if (is_active) responderStatus = 0;
    else responderStatus = 1;

    this.props
      .updateUserStatus(responder_uuid, responderStatus)
      .then((result) => {
        this.openNotification("Success", "Responder Status Updated", 1);
        this.getResponderDataTimeOut(this.state.page);
      })
      .catch((error) => {
        this.openNotification("Success", error.message, 0);
      });
  };

  componentWillReceiveProps(newProps) {
    //this.getResponderData(1)
    // window.location.reload();
  }

  onKeyFormSubmission = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      this.getResponderDataTimeOut(1, this.state.search);
    }
  };

  getRenderingSubHeader = () => {
    const leftChildren = [<h2 key={0}>Responders</h2>];

    const rightChildren = [
      <div className="global-search global-search--margined" key={0}>
        <Form.Group className="position-relative" controlId="searchEmergencies">
          <Form.Control
            placeholder="Search for Responders"
            value={this.state.search}
            onKeyDown={(e) => this.onKeyFormSubmission(e)}
            onChange={(e) => this.setState({ search: e.currentTarget.value })}
          />
          <Button
            type="button"
            className="btn btn-secondary btn-search d-flex align-items-center justify-content-center"
            onClick={() => this.getResponderDataTimeOut(1, this.state.search)}
          >
            <FontAwesomeIcon icon={faArrowRight} />
          </Button>
        </Form.Group>
      </div>,
      <Link to={ROUTES.ADDRESPONDER} className="btn btn-primary" key={1}>
        <FontAwesomeIcon icon={faPlus} /> Add New
      </Link>,
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
              ? "responders-page sidebar-page sidebar-page--open position-relative"
              : "responders-page sidebar-page sidebar-page--closed position-relative"
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
  requireAuth(
    connect(mapStateToProps, {
      responderList,
      updateResponderAvailibilty,
      updateUserStatus,
    })(RespondersPage)
  )
);
