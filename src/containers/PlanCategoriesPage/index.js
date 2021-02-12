import React from "react";

import { Table, notification, Modal } from "antd";
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
import PlanCategoriesManagerFile, { columns } from "./dataManager";
import { getRenderingHeader } from "../../common/helpers";
import requireAuth from "../../hoc/requireAuth";
import { connect } from "react-redux";
import { get, isEmpty } from "lodash";
import queryString from "query-string";

import styles from "./plan-categories-page.scss";
import hasPermission from "../../hoc/hasPermission";

const PlanCategoriesManager = new PlanCategoriesManagerFile();
const { confirm } = Modal;

class PlanCategoriesPage extends React.Component {
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
      categories: [],
      addPlanCategory: false,
      editPlanCategory: false,
      selectedCategoryID: null,
      selectedCategoryName: null,
    };
  }

  componentDidMount() {
    document.title = "Emoha Admin | Plan Categories";

    let queryObject = queryString.parse(window.location.search);
    if (this.state.tableData.length === 0 && isEmpty(queryObject)) {
      this.getPlanCategoriesTimeOut();
    }
    if ("search" in queryObject) {
      this.setState({ search: queryObject.search }, () => {
        this.getPlanCategoriesTimeOut();
      });
    }
  }

  getPlanCategoriesTimeOut = () => {
    let { tableData, tableOptions } = this.state;

    this.setState({ loader: true });

    const { page, search } = this.state;

    const payload = {
      page,
      search,
    };

    PlanCategoriesManager.getPlanCategories(payload)
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

          data["edit"] = () =>
            this.CategorySelector(data.id, data.category, false);
          data["delete"] = () =>
            this.CategorySelector(data.id, data.category, true);
        });

        this.setState({ tableData, tableOptions, page, loader: false });
      })
      .catch((error) => {
        this.setState({ loader: false });
      });
  };

  getPlanCategories = () => {
    setInterval(() => this.getPlanCategoriesTimeOut(), 10000);
  };

  onClickPagination = (page) => {
    document.getElementById("table-id").scrollTop = 0;
    this.setState({ page }, () => {
      this.getPlanCategoriesTimeOut();
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

      window.location.href = `/plan-categories?search=${this.state.search}`;
    }
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

  destroyCategoryStateData = (stop_loader = false) => {
    let dataObject = {
      addPlanCategory: false,
      editPlanCategory: false,
      selectedCategoryID: null,
      selectedCategoryName: null,
    };

    if (stop_loader) {
      dataObject["loader"] = false;
    }

    this.setState(dataObject);
  };

  addCategoryHandler = () => {
    if (!this.state.categories.length) {
      return this.openNotification(
        "Error",
        "Please specify a plan category.",
        0
      );
    }

    this._startPageLoader();
    PlanCategoriesManager.addPlanCategories({
      categories: this.state.categories,
    })
      .then((res) => {
        this.openNotification(
          "Success",
          "Plan Category Added Successfully.",
          1
        );
        this.destroyCategoryStateData();
        this.getPlanCategoriesTimeOut();
      })
      .catch((error) => {
        this.destroyCategoryStateData(true);
        this.openNotification("Error", error.response.data.message, 0);
      });
  };

  editCategoryHandler = () => {
    if (!this.state.selectedCategoryID || !this.state.selectedCategoryName) {
      return this.openNotification(
        "Error",
        "Please specify a plan category.",
        0
      );
    }

    this._startPageLoader();
    PlanCategoriesManager.editPlanCategory({
      selectedCategoryID: this.state.selectedCategoryID,
      selectedCategoryName: this.state.selectedCategoryName,
    })
      .then((res) => {
        this.openNotification(
          "Success",
          "Plan Category Updated Successfully.",
          1
        );
        this.destroyCategoryStateData();
        this.getPlanCategoriesTimeOut();
      })
      .catch((error) => {
        this.destroyCategoryStateData(true);
        this.openNotification("Error", error.response.data.message, 0);
      });
  };

  deleteCategoryHandler = () => {
    if (!this.state.selectedCategoryID) {
      return this.openNotification(
        "Error",
        "Please select a category to delete",
        0
      );
    }

    this._startPageLoader();
    PlanCategoriesManager.deletePlanCategory({
      selectedCategoryID: this.state.selectedCategoryID,
    })
      .then((res) => {
        this.destroyCategoryStateData();
        this.getPlanCategoriesTimeOut();
        this.openNotification(
          "Success",
          "Plan Category Deleted Successfully",
          1
        );
      })
      .catch((error) => {
        this.destroyCategoryStateData(true);
        this.openNotification("Error", error.response.data.message, 0);
      });
  };

  confirmDeletion = () => {
    confirm({
      title: "Are you sure that you wish to perform this action?",
      okText: "Yes, I'm Sure",
      okType: "danger",
      cancelText: "No, Abort",
      centered: true,
      onOk: () => {
        this.deleteCategoryHandler();
      },
      onCancel: () => {
        this.destroyCategoryStateData();
      },
    });
  };

  CategorySelector = (
    selectedCategoryID,
    selectedCategoryName,
    to_delete = false
  ) => {
    if (!selectedCategoryID) {
      return;
    }

    this.setState({ selectedCategoryID, selectedCategoryName }, () => {
      if (to_delete) {
        this.confirmDeletion();
      } else {
        this.setState({ editPlanCategory: true, addPlanCategory: false });
      }
    });
  };
  getRenderingSubHeader = () => {
    const leftChildren = [<h2 key={0}>Plan Categories</h2>];

    const rightChildren = [
      <div className="global-search global-search--margined" key={0}>
        <Form.Group className="position-relative" controlId="searchEmergencies">
          <Form.Control
            placeholder="Search for Plan Categories"
            onKeyDown={(e) => this.onKeyFormSubmission(e)}
            onChange={(e) => this.setState({ search: e.currentTarget.value })}
            value={this.state.search}
          />
          <Button
            type="button"
            className="btn btn-secondary btn-search d-flex align-items-center justify-content-center"
            onClick={() => {
              window.location.href = `/plan-categories?search=${this.state.search}`;
            }}
          >
            <FontAwesomeIcon icon={faArrowRight} />
          </Button>
        </Form.Group>
      </div>,
      <button
        className="btn btn-primary"
        key={1}
        onClick={() =>
          this.setState({ addPlanCategory: true, editPlanCategory: false })
        }
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
              {this.state.addPlanCategory && (
                <div className="row">
                  <div className="col-12 col-sm-6">
                    <h4 className="add-plan-category">Add a Plan Category</h4>
                    <div
                      style={{ marginBottom: "16px" }}
                      className="d-flex align-items-center justify-content-start"
                    >
                      <Form.Group
                        style={{ marginBottom: "0px", marginRight: "8px" }}
                        controlId="responderFirstName"
                      >
                        <Form.Control
                          type="text"
                          placeholder="Emoha Care Angel"
                          onChange={(e) =>
                            this.setState({
                              categories: [e.currentTarget.value],
                            })
                          }
                        />
                      </Form.Group>

                      <button
                        onClick={this.addCategoryHandler}
                        className="btn btn-primary"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => this.destroyCategoryStateData()}
                        className="btn btn-secondary"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {this.state.editPlanCategory && (
                <div className="row">
                  <div className="col-12 col-sm-6">
                    <h4 className="add-plan-category">Edit Plan Category</h4>
                    <div
                      style={{ marginBottom: "16px" }}
                      className="d-flex align-items-center justify-content-start"
                    >
                      <Form.Group
                        style={{ marginBottom: "0px", marginRight: "8px" }}
                        controlId="responderFirstName"
                      >
                        <Form.Control
                          type="text"
                          placeholder="Emoha Care Angel"
                          value={this.state.selectedCategoryName}
                          onChange={(e) =>
                            this.setState({
                              selectedCategoryName: e.currentTarget.value,
                            })
                          }
                        />
                      </Form.Group>

                      <button
                        onClick={this.editCategoryHandler}
                        className="btn btn-primary"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => this.destroyCategoryStateData()}
                        className="btn btn-secondary"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
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
  requireAuth(connect(mapStateToProps, {})(PlanCategoriesPage))
);
