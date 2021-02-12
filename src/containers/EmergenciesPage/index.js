import React from "react";
import queryString from "query-string";

import { Link } from "react-router-dom";
import { Table, Select, Switch } from "antd";
import { Button, Form } from "react-bootstrap";

import requireAuth from "../../hoc/requireAuth";
import PageLoader from "../../components/PageLoader";
import SideNavigation from "../../components/SideNavigation";
import SubHeader from "../../components/SubHeader";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretRight,
  faPlus,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import { tableColumns } from "./dataManager";
import { ROUTES, PERMISSIONS } from "../../common/constants";
import { getRenderingHeader } from "../../common/helpers";
import {
  emergenciesList,
  emergenciesCount,
  emergencyAssigner,
} from "../../actions/EmergencyActions";
import { connect } from "react-redux";
import { get, isEmpty } from "lodash";
import hasPermission from "../../hoc/hasPermission";

import styles from "./emergencies-page.scss";

const { Option } = Select;

class EmergenciesPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      page: 1,
      search: "",
      status: "INVALID",
      tableData: [],
      loader: false,
      searchState: false,
      navigationDeployed: true,
      recordsCount: Number.MAX_SAFE_INTEGER,
      tableOptions: {
        hasData: true,
        bordered: true,
        loading: true,
        size: "default",
        scroll: {
          x: true,
        },
        showHeader: true,
        pagination: { position: "bottom", pageSize: 0, total: 0 },
      },
      playAudioFlag: true,
    };
    this.loaderFlag = 0;
    this.requestInterval = undefined;
    this.requestIntervalNew = undefined;
    this.requestIntervalBackdated = undefined;
    this.audioLoadContext = new AudioContext();
    this.handleNavigationEmergencyAssign = this.handleNavigationEmergencyAssign.bind(
      this
    );
  }

  componentDidMount = async () => {
    document.title = "Emoha Admin | Emergencies";

    let queryObject = queryString.parse(window.location.search);
    if ("search" in queryObject) {
      this.getEmergenciesCount(
        this.state.page,
        queryObject.search,
        this.state.status,
        this.state.back_dated
      );
    }

    if (this.state.tableData.length === 0 && isEmpty(queryObject)) {
      this.getEmergenciesCount(
        this.state.page,
        this.state.search,
        this.state.status,
        this.state.back_dated
      );
    }
    this.autoLoadRequests();
  };

  handleNavigationEmergencyAssign(myRowData) {
    const payload = {
      id: myRowData.id,
      status: 3,
    };
    this.props.emergencyAssigner(payload);
    this.getEmergenciesCount(
      this.state.page,
      this.state.search,
      this.state.status,
      this.state.back_dated
    );
  }

  autoLoadNewRequests = (value) => {
    const { page, search } = this.state;

    if (!this.state.searchState) {
      this.requestIntervalNew = setInterval(() => {
        this.getEmergenciesCount(page, search, value, this.state.back_dated);
      }, 5000);
    }
  };
  autoLoadBackDatedRequests = () => {
    const { page, search, status } = this.state;
    if (!this.state.searchState) {
      this.requestIntervalBackdated = setInterval(() => {
        this.getEmergenciesCount(page, search, status, 1);
      }, 20000);
    }
  };

  autoLoadRequests = () => {
    const { page, search, status, back_dated } = this.state;
    if (!this.state.searchState) {
      this.requestInterval = setInterval(() => {
        this.setState({ status, search: "" });
        this.getEmergenciesCount(page, search, status, back_dated);
      }, 20000);
    }
  };

  clearAutoLoaders = () => {
    clearInterval(this.requestInterval);
    clearInterval(this.requestIntervalNew);
    clearInterval(this.requestIntervalBackdated);
  };

  setTableFilter = async (value) => {
    const { page, search, back_dated } = this.state;
    this.setState({ status: value });
    this.getEmergenciesCount(page, search, value, back_dated);
  };

  // componentDidUpdate(prevProps, prevState) {
  //   if (this.state.recordsCount < prevState.recordsCount) {
  //     this.playAudioAlert();
  //   }
  // }

  updateTableOptions = (optionKey, optionValue) => {
    this.setState((state) => ({
      ...state,
      tableOptions: {
        ...state.tableOptions,
        [`${optionKey}`]: optionValue,
      },
    }));
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

  getEmergenciesCount = (page, query, status, back_dated) => {
    this.props.emergenciesCount(page, query, status, back_dated);
    this.getEmergenciesListTimeOut(page, query, status, back_dated);
  };

  getEmergenciesListTimeOut = (page, query, status, back_dated) => {
    this.props
      .emergenciesList(page, query, status, back_dated)
      .then(async (result) => {
        let index = 1;
        let fetchedTableData = get(result, "data");

        this.updateTablePaginationOptions(
          "total",
          get(result, "meta.pagination.total")
        );
        this.updateTablePaginationOptions(
          "pageSize",
          get(result, "meta.pagination.per_page")
        );
        this.updateTableOptions("loading", false);

        fetchedTableData.forEach((record) => {
          record["index"] = (this.state.page - 1) * 20 + index++;
          record["handleNavigationEmergencyAssign"] = (data) =>
            this.handleNavigationEmergencyAssign(data);
        });

        // Check Sound on Load & All Subsequent Calls and Sound Siren
        let recordsCount = result.meta.pagination.total;

        if (this.state.recordsCount < recordsCount) {
          // this.playAudioAlert();
        }

        this.setState({
          page,
          recordsCount,
          loader: false,
          tableData: fetchedTableData,
        });
      })
      .catch((error) => {
        this.setState({ loader: false });

        console.log("ERROR FETCHING EMERGENCIES", error);
      });
  };

  getEmergenciesList = (page, query, status, back_dated) => {
    this.autoLoadRequests();
  };

  getBackDatedData = (checked) => {
    console.log("fffffff");
    let { search, value } = this.state;
    this.setState({ back_dated: checked ? 0 : 1 });
    if (checked) {
      this.getEmergenciesCount(1, search, value, 0);
      this.clearAutoLoaders();
      this.autoLoadRequests();
    } else {
      this.getEmergenciesCount(1, search, value, 1);
      this.clearAutoLoaders();
      this.autoLoadBackDatedRequests();
    }
  };

  onClickPagination = (page) => {
    document.getElementById("table-id").scrollTop = 0;
    this.getEmergenciesCount(
      page,
      this.state.search,
      this.state.status,
      this.state.back_dated
    );

    this.setState({ page, loader: false });
  };

  playAudioAlert = () => {
    console.log("Called");
    if (this.state.playAudioFlag) {
      this.audioLoadContext
        .resume()
        .then(() => {
          document.getElementById("emergencyAlertAudio").play();
          console.log("Played");
        })
        .catch((err) => {
          console.log("Error While Playing Audio", err);
        });
    }

    // let audio = new Audio(AudioAlert);

    // audio.setAttribute("autoplay", "true");
    // audio.setAttribute("allow", "autoplay");

    // const audioPromise = audio
    //   .play()
    //   .then(res => {})
    //   .catch(err => {
    //     audio.play();
    //   });
  };

  onKeyFormSubmission = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      event.stopPropagation();
      this.handleSearch();
    }
  };

  handleSearch = () => {
    if (this.state.searchState) {
      this.props.history.push(`/emergencies?search=${this.state.search}`);
    } else {
      window.open(`/emergencies?search=${this.state.search}`, "_blank");
    }
  };

  handleNavigationToggle = () => {
    this.setState({ navigationDeployed: !this.state.navigationDeployed });
  };

  getRenderingSubHeader = () => {
    const permissions = get(this.props, "user.permissions", []);

    const leftChildren = [
      <h2 key={0}>Emergencies</h2>,
      <div className="select-service-type" key={1}>
        <Select
          value={this.state.status}
          placeholder="Filter by Status"
          style={{ width: 200 }}
          onChange={(value) => {
            this.setTableFilter(value);
          }}
        >
          <Option value="INVALID">Show All</Option>
          <Option value="0">New</Option>
          <Option value="1">Ongoing</Option>
          <Option value="2">Completed</Option>
          <Option value="3">Cancelled</Option>
        </Select>
      </div>,
      <div className="switch-backdated-list" key={3}>
        <Switch
          checkedChildren="Current"
          unCheckedChildren="Back Dated"
          defaultChecked
          onChange={(checked) => this.getBackDatedData(checked)}
        />
      </div>,
    ];

    let rightChildren = [];
    if (
      permissions &&
      permissions.length &&
      permissions.includes(PERMISSIONS.EMERGENCY_SEARCH.value)
    ) {
      rightChildren.push(
        <div className="global-search global-search--margined" key={4}>
          <Form.Group
            className="position-relative"
            controlId="searchEmergencies"
          >
            <Form.Control
              placeholder="Search for Emergencies"
              value={this.state.search}
              onKeyDown={(e) => this.onKeyFormSubmission(e)}
              onChange={(e) => this.setState({ search: e.currentTarget.value })}
            />
            <Button
              type="button"
              className="btn btn-secondary btn-search d-flex align-items-center justify-content-center"
              onClick={() => this.handleSearch()}
            >
              <FontAwesomeIcon icon={faArrowRight} />
            </Button>
          </Form.Group>
        </div>
      );
    }

    if (
      permissions &&
      permissions.length &&
      permissions.includes(PERMISSIONS.EMERGENCY_CREATE.value)
    ) {
      rightChildren.push(
        <Link to={ROUTES.ADDEMERGENCY} className="btn btn-primary" key={5}>
          <FontAwesomeIcon icon={faPlus} /> Create New
        </Link>
      );
    }

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
              ? "emergencies-page sidebar-page sidebar-page--open position-relative"
              : "emergencies-page sidebar-page sidebar-page--closed position-relative"
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
                  columns={tableColumns}
                  dataSource={tableOptions.hasData ? tableData : null}
                  pagination={{
                    onChange: this.onClickPagination,
                    total: this.state.tableOptions.pagination.total,
                    pageSize: this.state.tableOptions.pagination.pageSize,
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
            </div>
          </main>
        </div>

        {/* ENABLE THIS PAGE LOADER CONDITIONALLY */}
        {this.state.loader ? <PageLoader /> : null}
      </React.Fragment>
    );
  }

  componentWillUnmount = async () => {
    this.clearAutoLoaders();
  };
}

const mapsStateToProps = (state) => ({
  user: state.user.user,
});

const mapDispatchToProps = {
  emergenciesList,
  emergenciesCount,
  emergencyAssigner,
};

export default hasPermission(
  requireAuth(connect(mapsStateToProps, mapDispatchToProps)(EmergenciesPage))
);
