import React from "react";
import queryString from "query-string";

import { Table, notification } from "antd";
import { Link } from "react-router-dom";
import { Button, Form } from "react-bootstrap";

import SubHeader from "../../components/SubHeader";
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
import ExpandedRowRender from "./ExpandedRowRender";
import { getRenderingHeader } from "../../common/helpers";
import { consumerList } from "../../actions/ConsumerActions";
import requireAuth from "../../hoc/requireAuth";
import { connect } from "react-redux";
import { get, isEmpty } from "lodash";
import {
  consumerSearchList,
  emergencyCreate,
} from "../../actions/EmergencyActions";
import { updateUserStatus, zohoSync } from "../../actions/UserActions";

import ElderService from "../../service/ElderService";
import hasPermission from "../../hoc/hasPermission";

import styles from "./elders-page.scss";
class EldersPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      page: 1,
      search: "",
      tableData: [],
      loader: false,
      navigationDeployed: true,
      tableOptions: {
        showHeader: true,
        hasData: true,
        bordered: true,
        loading: false,
        pagination: { position: "bottom", total: 0, pageSize: 0 },
      },
      filter: "",
      filterStatus: "",
    };

    this.elderService = new ElderService();
  }

  expandedRowRender = (record) => {
    return (
      <ExpandedRowRender
        record={record}
        onClick={this.notification}
        disableExpandRow={this.disableExpandRow}
      />
    );
  };

  disableExpandRow = () => {
    let { tableOptions } = this.state;
    this.expandedRow = null;
    tableOptions["expandedRowKeys"] = [];
    this.setState({ tableOptions });
  };

  notification = (message, description, status) => {
    this.openNotification(message, description, status);
    if (status) this.getConsumerData();
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

  componentDidMount() {
    document.title = "Emoha Admin | Elders";

    let queryObject = queryString.parse(window.location.search);

    if (this.state.tableData.length === 0 && isEmpty(queryObject)) {
      this.getConsumerData();
    }

    if (!isEmpty(queryObject)) {
      let updateObj = {};
      if ("search" in queryObject) {
        updateObj = {
          ...updateObj,
          search: queryObject.search,
          page: 1,
        };
      }
      if ("filter" in queryObject && "filterStatus" in queryObject) {
        updateObj = {
          ...updateObj,
          filter: queryObject.filter,
          filterStatus: queryObject.filterStatus,
        };
      }

      this.setState(
        (state) => ({
          ...state,
          ...updateObj,
        }),
        () => this.getConsumerData()
      );
    } else {
      setInterval(() => {
        this.getConsumerData();
      }, 120000);
    }
  }

  getConsumerData = () => {
    let {
      tableData,
      tableOptions,
      page,
      search,
      filter,
      filterStatus,
    } = this.state;

    this.setState({ loader: true });
    this.elderService
      .getEldersList(page, search, filter, filterStatus)
      .then(async (result) => {
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
        delete tableOptions["expandedRowKeys"];
        let index = 1;
        tableData.forEach((data) => {
          data["index"] = index++;
          data["createEmergency"] = (isSimulation) =>
            this.addEmergencyHandler(data.id, isSimulation);
          data["createEmergency1"] = (isFalseAlarm) =>
            this.addEmergencyHandler1(data.id, isFalseAlarm);
        });

        this.setState({ tableData, tableOptions, loader: false });
      })
      .catch((error) => {
        this.setState({ loader: false });
      });
  };

  onClickPagination = (page) => {
    document.getElementById("table-id").scrollTop = 0;
    this.setState({ page }, () => {
      this.getConsumerData();
    });
  };

  handleNavigationToggle = () => {
    this.setState({ navigationDeployed: !this.state.navigationDeployed });
  };

  updateConsumerStatusHandler = (consumer_id, is_active) => {
    let status;
    if (is_active) status = 0;
    else status = 1;

    this.setState({ loader: true });
    this.props
      .updateUserStatus(consumer_id, status)
      .then((result) => {
        this.setState({ loader: false });
        this.openNotification(
          "Success",
          "Elder Status Updated Successfully.",
          1
        );
        this.getConsumerData(this.state.page, this.state.search);
      })
      .catch((error) => {
        this.setState({ loader: false });
        this.openNotification("Error", error.message, 0);
      });
  };

  componentWillReceiveProps = async (newProps) => {
    // window.location.reload(false);
  };

  onKeyFormSubmission = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      this.disableExpandRow();

      this.searchElder();
    }
  };

  searchElder = () => {
    const { search, filter, filterStatus } = this.state;

    let url = `/elders`;
    if (search && search !== "") {
      url = `${url}?search=${search}`;
    }
    if (filter && filter !== "" && filterStatus && filterStatus !== "") {
      if (search && search !== "") {
        url = `${url}&filter=${filter}&filterStatus=${filterStatus}`;
      } else {
        url = `${url}?filter=${filter}&filterStatus=${filterStatus}`;
      }
    }

    window.location.href = url;
  };

  addEmergencyHandler = (consumer_uuid, isSimulation) => {
    if (!consumer_uuid)
      return this.openNotification("Error", "Please select an elder", 0);

    this.setState({ loader: true });

    let body = {
      consumer_uuid,
      is_simulated: isSimulation,
    };

    this.props
      .emergencyCreate(body)
      .then((result) => {
        this.setState({ loader: false });
        this.openNotification(
          "Success",
          "Emergency was successfully declared for this elder.",
          1
        );
        this.props.history.push("/emergencies");
      })
      .catch((error) => {
        this.setState({ loader: false });
        this.openNotification("Error", error.message, 0);
      });
  };

  addEmergencyHandler1 = (consumer_uuid, isFalseAlarm) => {
    if (!consumer_uuid)
      return this.openNotification("Error", "Please select an elder", 0);

    this.setState({ loader: true });

    let body = {
      consumer_uuid,
      is_alarm: isFalseAlarm,
    };

    this.props
      .emergencyCreate(body)
      .then((result) => {
        this.setState({ loader: false });
        this.openNotification(
          "Success",
          "Emergency was successfully declared for this elder.",
          1
        );
        this.props.history.push("/emergencies");
      })
      .catch((error) => {
        this.setState({ loader: false });
        this.openNotification("Error", error.message, 0);
      });
  };

  getRenderingSubHeader = () => {
    const leftChildren = [<h2 key={0}>Elders</h2>];

    const rightChildren = [
      <div className="global-search global-search--margined" key={0}>
        <Form.Group className="position-relative" controlId="searchEmergencies">
          <Form.Control
            placeholder="Search for Elders"
            onKeyDown={(e) => this.onKeyFormSubmission(e)}
            onChange={(e) => this.setState({ search: e.currentTarget.value })}
            value={this.state.search}
          />
          <Button
            type="button"
            className="btn btn-secondary btn-search d-flex align-items-center justify-content-center"
            onClick={() => this.searchElder()}
          >
            <FontAwesomeIcon icon={faArrowRight} />
          </Button>
        </Form.Group>
      </div>,
      <Link to={ROUTES.ADDELDER} className="btn btn-primary" key={1}>
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
              ? "elderslisting-page sidebar-page sidebar-page--open position-relative"
              : "elderslisting-page sidebar-page sidebar-page--closed position-relative"
          }
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
                  //onChange={this.onClickPagination}
                  pagination={{
                    onChange: this.onClickPagination,
                    pageSize: this.state.tableOptions.pagination.pageSize,
                    total: this.state.tableOptions.pagination.total,
                    showSizeChanger: false,
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
      consumerList,
      updateUserStatus,
      consumerSearchList,
      zohoSync,
      emergencyCreate,
    })(EldersPage)
  )
);
