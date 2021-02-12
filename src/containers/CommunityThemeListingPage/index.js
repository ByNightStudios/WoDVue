import React from "react";

import { Table } from "antd";
import { Button } from "react-bootstrap";

import SubHeader from "../../components/SubHeader";
import PageLoader from "../../components/PageLoader";
import SideNavigation from "../../components/SideNavigation";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretRight, faPlus } from "@fortawesome/free-solid-svg-icons";
import CommunityThemeManagerFile, { columns } from "./dataManager";
import { getRenderingHeader } from "../../common/helpers";
import requireAuth from "../../hoc/requireAuth";
import { connect } from "react-redux";
import { get } from "lodash";

import styles from "./community-theme-page.scss";
import hasPermission from "../../hoc/hasPermission";

class CommunityThemeListingPage extends React.Component {
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
      themes: [],
    };

    this.communityThemeManager = new CommunityThemeManagerFile();
  }

  componentDidMount() {
    document.title = "Emoha Admin | Community Themes";

    this.getThemes();
  }

  getThemes = () => {
    let { tableData, tableOptions } = this.state;

    this.setState({ loader: true });

    const { page } = this.state;

    this.communityThemeManager
      .getCommunityTheme({ page: page - 1 })
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

          data["edit"] = () => this.editThemeHandler(data.id);
        });

        this.setState({ tableData, tableOptions, page, loader: false });
      })
      .catch((error) => {
        this.setState({ loader: false });
      });
  };

  editThemeHandler = (id) => {
    this.props.history.push(`/community/themes/edit/${id}`);
  };

  onClickPagination = (page) => {
    document.getElementById("table-id").scrollTop = 0;
    this.setState({ page }, () => {
      this.getThemes();
    });
  };

  handleNavigationToggle = () => {
    this.setState({ navigationDeployed: !this.state.navigationDeployed });
  };

  componentWillReceiveProps = async (newProps) => {
    // window.location.reload();
  };

  _startPageLoader = () => {
    this.setState({
      loader: true,
    });
  };

  _stopPageLoader = () => {
    this.setState({
      loader: false,
    });
  };

  getRenderingSubHeader = () => {
    const leftChildren = [<h2 key={0}>Community Themes</h2>];

    const rightChildren = [
      <button
        className="btn btn-primary"
        key={1}
        onClick={() => this.props.history.push("/community/themes/add")}
      >
        <FontAwesomeIcon icon={faPlus} /> Add New
      </button>,
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
  requireAuth(connect(mapStateToProps, {})(CommunityThemeListingPage))
);
