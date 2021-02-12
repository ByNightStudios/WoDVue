import React from "react";

import { Table, notification, Select, Modal } from "antd";
import { Button, Form } from "react-bootstrap";
import requireAuth from "../../hoc/requireAuth";
import PageLoader from "../../components/PageLoader";
import SideNavigation from "../../components/SideNavigation";
// import ExpandedRowRender from './ExpandedRowRender';
import SubHeader from "../../components/SubHeader";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretRight, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { ROUTES } from "../../common/constants";
import { getRenderingHeader } from "../../common/helpers";
import { conciergeList } from "../../actions/ConciergeAction";
import { connect } from "react-redux";
import { get } from "lodash";
import queryString from "query-string";
import styles from "./community-page.scss";
import {
  getCommunityPostList,
  columns,
  deleteCommunityPostList,
} from "./dataManager";
import hasPermission from "../../hoc/hasPermission";
const { Option } = Select;
const { confirm } = Modal;

class CommunityPage extends React.Component {
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
        pagination: { position: "bottom", pageSize: 0, total: 0 },
      },
      status: null,
      recordsCount: Number.MAX_SAFE_INTEGER,
      navigationDeployed: true,
      page: 0,
      loader: false,
      search: "",
      searchState: false,
      totalrecord: null,
    };

    this.loaderFlag = 0;
    this.requestInterval = undefined;
  }

  componentDidMount = async () => {
    document.title = "Emoha Admin | Community";
    //let q = window.location.search.replace('?', '');
    let q = queryString.parse(window.location.search);

    if (q.open === "true") {
      let { tableOptions } = this.state;
      // tableOptions['expandedRowKeys'] = [0];
      await this.setState({ tableOptions });
    }

    if ("search" in q) {
      await this.setState({ search: q.search, searchState: true });
    }

    this.getCommunityList(0, this.state.search);

    // if (!this.state.searchState) {
    //     this.requestInterval = setInterval(() => {
    //         this.getCommunityList(this.state.page);
    //     }, 30000);
    // }
  };

  getCommunityList = async (page, query, status) => {
    let { tableData, tableOptions } = this.state;

    if (!this.loaderFlag) {
      this.setState({ loader: true });
      this.loaderFlag = 1;
    }

    await getCommunityPostList(page, query, status)
      .then(async (result) => {
        tableOptions["pagination"]["total"] = result.meta.pagination.total;
        tableOptions["pagination"]["pageSize"] = 20;
        tableData = get(result, "data");

        tableOptions["loading"] = false;

        let index = 1;
        tableData.forEach((data) => {
          data["index"] = index++;
          data["onEdit"] = () => this.onEditPost(data);
          data["onDelete"] = () => this.onDeletePost(data);
        });
        await this.setState({
          tableData,
          tableOptions,
          page,
          loader: false,
        });

        // delete tableOptions['expandedRowKeys'];
        await this.setState({ tableOptions });
      })
      .catch((error) => {
        this.setState({ loader: false });
      });
  };

  disableExpandRow = () => {
    let { tableOptions } = this.state;
    this.expandedRow = null;
    // tableOptions['expandedRowKeys'] = [];
    this.setState({ tableOptions });
  };
  onDeletePost = (data) => {
    confirm({
      title: "Are you sure that you wish to perform this action?",
      okText: "Yes, I'm Sure",
      okType: "danger",
      cancelText: "No, Abort",
      centered: true,
      onOk: () => {
        deleteCommunityPostList(data.id).then((result) => {
          this.openNotification("Success", "Post Deleted Successfully", 1);
          this.props.history.push("/community");
        });
      },
      onCancel() {
        return;
      },
    });
  };
  onEditPost = (data) => {
    switch (data.category_type) {
      case 1: {
        let url = ROUTES.EDITBLOG.replace(":id", data.id);
        this.props.history.push(url);
        break;
      }
      case 2: {
        let url = ROUTES.EDITEVENT.replace(":id", data.id);
        this.props.history.push(url);
        break;
      }
      case 3: {
        let url = ROUTES.EDITOFFER.replace(":id", data.id);
        this.props.history.push(url);
        break;
      }
    }
  };

  notification = (message, description, status) => {
    this.openNotification(message, description, status);
    if (status) this.getCommunityList(this.state.page, this.state.search);
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
    this.getCommunityList(page - 1, this.state.query, this.state.status);
    this.setState({ page, loader: false });
  };

  componentWillUnmount = async () => {
    await clearInterval(this.requestInterval);
  };

  componentWillReceiveProps(props) {
    window.location.reload(false);
  }

  onKeyFormSubmission = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      this.onSearch();
    }
  };

  // onDeletePost = data => {
  //     console.log('this is details of data while delete', data)
  //     deleteCommunityPostList(data.id)
  //         .then(result => {
  //             this.openNotification('Success', 'Post Deleted Successfully', 1);
  //             window.location.reload();
  //         })
  // }

  onSearch = () => {
    if (this.state.searchState)
      this.props.history.push(`/community?search=${this.state.search}`);
    else window.open(`/community?search=${this.state.search}`, "_blank");
  };
  setStatus = async (value) => {
    this.setState({
      status: value,
    });

    this.getCommunityList(this.state.page, this.state.search, value);
  };

  getRenderingSubHeader = () => {
    const leftChildren = [
      <h2 key={0}>Community</h2>,
      <div className="select-service-type" key={1}>
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
          <Option value="2">Event</Option>
          <Option value="3">Offer</Option>
          <Option value="1">Blog</Option>
        </Select>
      </div>,
    ];

    const rightChildren = [
      <div className="global-search" key={0}>
        <Form.Group className="position-relative" controlId="searchConcierge">
          <Form.Control
            placeholder="Search for Community Feed"
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
                  dataSource={tableData ? tableData : null}
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

const mapsStateToProps = (state) => ({
  user: state.user.user,
});

export default hasPermission(
  requireAuth(connect(mapsStateToProps, { conciergeList })(CommunityPage))
);
