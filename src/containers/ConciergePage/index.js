import React from "react";

import { Link } from "react-router-dom";
import { Table, notification, Select, Switch } from "antd";
import { Button, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretRight,
  faPlus,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import { columns } from "./dataManager";
import { ROUTES } from "../../common/constants";
import { getRenderingHeader } from "../../common/helpers";
import { conciergeList } from "../../actions/ConciergeAction";
import { connect } from "react-redux";
import { get } from "lodash";

import queryString from "query-string";
import requireAuth from "../../hoc/requireAuth";
import PageLoader from "../../components/PageLoader";
import SideNavigation from "../../components/SideNavigation";
import AudioAlert from "../../assets/audios/alert.mp3";
import ExpandedRowRender from "./ExpandedRowRender";
import SubHeader from "../../components/SubHeader";
import hasPermission from "../../hoc/hasPermission";

import styles from "./concierge-page.scss";

const { Option } = Select;

class ConciergePage extends React.Component {
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
        scroll: {
          x: true,
        },
        pagination: { position: "bottom", pageSize: 0, total: 0 },
      },
      status: null,
      recordsCount: Number.MAX_SAFE_INTEGER,
      navigationDeployed: true,
      page: 1,
      loader: false,
      search: "",
      searchState: false,
      totalrecord: null,
      back_dated: 0,
    };

    this.expandedRow = null;
    this.loaderFlag = 0;
    this.requestInterval = undefined;
    this.requestIntervalBackDated = undefined;
  }

  componentDidMount = async () => {
    document.title = "Emoha Admin | Concierge";
    let q = queryString.parse(window.location.search);

    if (q.open === "true") {
      let { tableOptions } = this.state;
      tableOptions["expandedRowKeys"] = [0];
      await this.setState({ tableOptions });
    }

    if ("search" in q) {
      this.setState({ search: q.search, searchState: true }, () => {
        this.getConciergeList();
      });
    } else {
      this.getConciergeList();

      if (!this.state.searchState) {
        this.requestInterval = setInterval(() => {
          this.getConciergeList();
        }, 30000);
      }
    }
  };

  clearAutoLoaders = () => {
    clearInterval(this.requestInterval);
    clearInterval(this.requestIntervalBackDated);
  };

  autoLoadRequests = () => {
    if (!this.state.searchState) {
      this.requestInterval = setInterval(() => {
        this.getConciergeList();
      }, 30000);
    }
  };

  autoLoadBackDatedRequests = () => {
    const { status } = this.state;

    if (
      !this.state.searchState &&
      (!status || status === "" || status === "0")
    ) {
      this.requestIntervalBackDated = setInterval(() => {
        this.getConciergeList();
      }, 30000);
    }
  };

  getConciergeList = async () => {
    let { tableData, tableOptions } = this.state;
    if (!this.loaderFlag) {
      this.setState({ loader: true });
      this.loaderFlag = 1;
    }

    let { page, search, status, back_dated } = this.state;

    await this.props
      .conciergeList(page, search, status, back_dated)
      .then(async (result) => {
        console.log(result);
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
        let recordsCount = result.meta.pagination.total;
        if (this.expandedRow && this.state.recordsCount < recordsCount)
          tableOptions["expandedRowKeys"] = [
            this.expandedRow + (recordsCount - this.state.recordsCount),
          ];

        if (
          this.state.recordsCount < recordsCount &&
          (!this.state.status || this.state.status === "0")
        )
          this.playAudioAlert();

        let index = 1;
        tableData.forEach((data) => {
          data["index"] = index++;
        });
        await this.setState({
          tableData,
          tableOptions,
          page,
          recordsCount,
          loader: false,
        });

        delete tableOptions["expandedRowKeys"];
        await this.setState({ tableOptions });
      })
      .catch((error) => {
        this.setState({ loader: false });
      });
  };

  expandedRowRender = (record, index, indent, expanded) => {
    if (expanded) {
      this.expandedRow = index;
    }

    return (
      <ExpandedRowRender
        record={record}
        onClick={this.notification}
        disableExpandRow={this.disableExpandRow}
        getConciergeList={this.getConciergeList}
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
    if (status) this.getConciergeList();
  };

  handleNavigationToggle = () => {
    this.setState({ navigationDeployed: !this.state.navigationDeployed });
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

  onClickPagination = (page) => {
    document.getElementById("table-id").scrollTop = 0;
    this.setState({ page, loader: false }, () => {
      this.getConciergeList();
    });
  };

  playAudioAlert = () => {
    // let audio = new Audio(AudioAlert);
    // audio.play();
  };

  componentWillUnmount = async () => {
    this.clearAutoLoaders();
  };

  componentWillReceiveProps(props) {
    // window.location.reload();
  }

  onKeyFormSubmission = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      this.onSearch();
    }
  };

  onSearch = () => {
    if (this.state.searchState)
      this.props.history.push(`/concierge?search=${this.state.search}`);
    else window.open(`/concierge?search=${this.state.search}`, "_blank");
  };

  setStatus = async (value) => {
    console.log(value);
    this.setState(
      {
        status: value,
        page: 1,
        search: "",
      },
      () => {
        this.getConciergeList();
      }
    );

    if (value === "" || value === "0") {
      this.clearAutoLoaders();
      this.autoLoadRequests();
    } else {
      this.clearAutoLoaders();
    }
  };

  getBackDatedData = (checked) => {
    this.setState({ back_dated: checked ? 0 : 1 }, () => {
      if (checked) {
        this.getConciergeList();
        this.clearAutoLoaders();
        this.autoLoadRequests();
      } else {
        this.getConciergeList();
        this.clearAutoLoaders();
        this.autoLoadBackDatedRequests();
      }
    });
  };

  getRenderingSubHeader = () => {
    const leftChildren = [
      <h2 key={0}>Service requests</h2>,
      <div key={1} className="select-service-type">
        <Select
          showSearch
          placeholder="Select Servie Type"
          style={{ width: 200 }}
          onChange={(value) => {
            this.setStatus(value);
          }}
          defaultValue=""
        >
          <Option value="">All</Option>
          <Option value="0">New</Option>
          <Option value="1">Ongoing</Option>
          <Option value="2">Completed</Option>
          <Option value="3">Cancelled</Option>
          <Option value="4">Feedback Required</Option>
        </Select>
      </div>,
      <div key={2}>
        <Switch
          checkedChildren="Current"
          unCheckedChildren="Back Dated"
          defaultChecked
          onChange={(checked) => this.getBackDatedData(checked)}
        />
      </div>,
    ];

    const rightChildren = [
      <div className="global-search global-search--margined" key={0}>
        <Form.Group className="position-relative" controlId="searchConcierge">
          <Form.Control
            placeholder="Search for Concierge Services"
            value={this.state.search}
            onKeyDown={(e) => this.onKeyFormSubmission(e)}
            onChange={(e) => this.setState({ search: e.currentTarget.value })}
          />
          <Button
            type="button"
            className="btn btn-secondary btn-search d-flex align-items-center justify-content-center"
            onClick={() => this.onSearch()}
          >
            <FontAwesomeIcon icon={faArrowRight} />
          </Button>
        </Form.Group>
      </div>,
      <Link to={ROUTES.ADDCONCIERGE} className="btn btn-primary" key={1}>
        <FontAwesomeIcon icon={faPlus} /> Create New
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
              ? "concierge-page sidebar-page sidebar-page--open position-relative"
              : "concierge-page sidebar-page sidebar-page--closed position-relative"
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
}

const mapsStateToProps = (state) => ({
  user: state.user.user,
});

export default hasPermission(
  requireAuth(connect(mapsStateToProps, { conciergeList })(ConciergePage))
);
