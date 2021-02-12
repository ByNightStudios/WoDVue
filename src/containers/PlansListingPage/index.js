import React from "react";

import { Table } from "antd";
import { Button, Form } from "react-bootstrap";

import SubHeader from "../../components/SubHeader";
import PageLoader from "../../components/PageLoader";
import SideNavigation from "../../components/SideNavigation";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretRight,
  faArrowRight,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import PlansListingManagerFile, { columns } from "./dataManager";
import { getRenderingHeader } from "../../common/helpers";
import requireAuth from "../../hoc/requireAuth";
import { connect } from "react-redux";
import { get, isEmpty } from "lodash";
import queryString from "query-string";

import { Link } from "react-router-dom";
import { ROUTES } from "../../common/constants";

import styles from "./plans-listing-page.scss";

const PlansListingManager = new PlansListingManagerFile();

class PlansListingPage extends React.Component {
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
    };
  }

  componentDidMount() {
    document.title = "Emoha Admin | Plans";
    let queryObject = queryString.parse(window.location.search);
    console.log(queryObject);
    if (this.state.tableData.length === 0 && isEmpty(queryObject)) {
      this.getPlansTimeOut();
    }

    if ("search" in queryObject) {
      this.setState({ search: queryObject.search }, () => {
        this.getPlansTimeOut();
      });
    } else this.getPlans();
  }

  getPlansTimeOut = () => {
    let { tableData, tableOptions } = this.state;

    this.setState({ loader: true });

    const { page, search } = this.state;

    const payload = {
      page,
      search,
    };

    PlansListingManager.getPlans(payload)
      .then((result) => {
        tableOptions["pagination"]["total"] = get(
          result,
          "meta.pagination.total"
        );
        tableOptions["pagination"]["pageSize"] = get(
          result,
          "meta.pagination.perPage"
        );

        let plansData = [];
        if (result.data && result.data.length) {
          let data = result.data;
          for (let category of data) {
            if (category.plan && category.plan.length) {
              for (let plan of category.plan) {
                plan["category"] = category.category;
                plan["description"] =
                  plan.description && plan.description.length > 100
                    ? `${plan.description.substr(0, 100)}...`
                    : plan.description;
                plansData.push(plan);
              }
            }
          }

          tableData = plansData;
        } else tableData = [];

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
  getPlans = () => {
    setInterval(() => this.getPlansTimeOut(), 120000);
  };

  onClickPagination = (page) => {
    document.getElementById("table-id").scrollTop = 0;
    this.setState({ page }, () => {
      this.getPlansTimeOut();
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

      window.location.href = `/plans?search=${this.state.search}`;
    }
  };

  getRenderingSubHeader = () => {
    const leftChildren = [<h2 key={0}>Plans</h2>];

    const rightChildren = [
      <div className="global-search global-search--margined" key={0}>
        <Form.Group className="position-relative" controlId="searchEmergencies">
          <Form.Control
            placeholder="Search for Plans"
            onKeyDown={(e) => this.onKeyFormSubmission(e)}
            onChange={(e) => this.setState({ search: e.currentTarget.value })}
            value={this.state.search}
          />
          <Button
            type="button"
            className="btn btn-secondary btn-search d-flex align-items-center justify-content-center"
            onClick={() => {
              window.location.href = `/plans?search=${this.state.search}`;
            }}
          >
            <FontAwesomeIcon icon={faArrowRight} />
          </Button>
        </Form.Group>
      </div>,
      <Link to={ROUTES.ADDPLAN} className="btn btn-primary" key={1}>
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

export default requireAuth(connect(mapStateToProps, {})(PlansListingPage));
