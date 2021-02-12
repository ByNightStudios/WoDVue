import React from "react";

import { notification, Checkbox } from "antd";
import { connect } from "react-redux";
import { Button, Form } from "react-bootstrap";
import { getRenderingHeader } from "../../common/helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretRight,
  faEdit,
  faMinus,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { updateStaff } from "../../actions/StaffActions";

import requireAuth from "../../hoc/requireAuth";
import PageLoader from "../../components/PageLoader";
import SideNavigation from "../../components/SideNavigation";

import AdminService from "../../service/AdminService";
import hasPermission from "../../hoc/hasPermission";
import LanguagesSpoken from "../../components/LanguagesSpoken";

import styles from "./view-admin-page.scss";
import { lang } from "moment";

class ViewAdminPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loader: true,
      navigationDeployed: true,
      adminDetails: {},
      formData: {
        first_name: "",
        last_name: "",
        email: "",
        mobile_number: "",
        password: "",
        confirm_password: "",
        languages: [],
        other_language: "",
      },
      roles: [],

      showUpdatePassword: false,
    };

    this.style = {};
    this.adminService = new AdminService();
  }

  componentDidMount() {
    document.title = "Emoha Admin | Role Details";
    this.getRoles();
    this.getAdminDataTimeOut(this.props.match.params.id, true);
    this.getAdminData(this.props.match.params.id, true);
  }

  getRoles = () => {
    this.adminService
      .getRolesList({ page: "all" })
      .then((res) => {
        if (res.data) {
          this.setState({ roles: res.data });
        }
      })
      .catch((error) => {
        console.log("Unable to fetch roles");
      });
  };

  getAdminDataTimeOut = (id, showLoader = false) => {
    if (showLoader) {
      this._startPageLoader();
    }
    this.adminService
      .getAdminByID({ adminID: id })
      .then((res) => {
        this._stopPageLoader();
        if (res.data) {
          this.setState({ adminDetails: res.data }, () => {
            this.triggerEditAdmin();
          });
        }
      })
      .catch((error) => {
        this._stopPageLoader();
        this.openNotification("Error", "Something went wrong", 0);
      });
  };

  getAdminData = (id, showLoader = false) => {
    setInterval(() => this.getAdminDataTimeOut(id, showLoader), 120000);
  };

  openNotification = (message, description, status) => {
    const style = { color: status ? "green" : "red" };

    const args = {
      message,
      description,
      duration: 5,
      style,
    };

    notification.open(args);
  };

  _startPageLoader = () => {
    this.setState({ loader: true });
  };

  _stopPageLoader = () => {
    this.setState({ loader: false });
  };

  handleNavigationToggle = () => {
    this.setState({ navigationDeployed: !this.state.navigationDeployed });
  };

  setLanguages = (language) => {
    this.setStateValues("languages", language);
  };
  setStateValues = (field, e) => {
    let value;
    let formData = this.state.formData;
    if (field === "languages") {
      formData[`${field}`] = e;
    } else if (field !== "permissions") {
      value = e.currentTarget.value;
      formData[`${field}`] = value;
    } else {
      value = e.target.value;

      let permissions = formData.permissions;
      if (permissions.includes(value)) {
        permissions = permissions.filter((p) => p !== value);
      } else {
        permissions.push(value);
      }
      formData.permissions = permissions;
    }

    this.setState({ formData });
  };

  triggerEditAdmin = () => {
    let formData = Object.assign({}, this.state.formData);
    const { adminDetails } = this.state;

    formData = {
      first_name: adminDetails.first_name,
      last_name: adminDetails.last_name,
      email: adminDetails.email,
      mobile_number: adminDetails.mobile_number,
      languages:
        adminDetails.languages.length > 0 ? adminDetails.languages : [],
      other_language: adminDetails.other_language,
    };

    this.setState({ formData });
  };

  formValidation = () => {
    let formData = Object.assign(this.state.formData, {});

    // All feilds validation
    if (
      !formData.first_name ||
      !formData.last_name ||
      !formData.email ||
      !formData.mobile_number
    ) {
      this.openNotification("Error", "All Fields are required.", 0);
      return { success: false, payload: null };
    }

    if (
      this.state.showUpdatePassword &&
      (!formData.password ||
        formData.password.length < 6 ||
        !formData.confirm_password ||
        formData.confirm_password.length < 6 ||
        formData.confirm_password !== formData.password)
    ) {
      this.openNotification(
        "Error",
        "Passwords must be equal and greater than 6 characters.",
        0
      );
      return { success: false, payload: null };
    }
    if (
      formData.languages.includes("Other") &&
      formData.other_language === ""
    ) {
      this.openNotification("Error", "Please fill other language.", 0);
      return { success: false, payload: null };
    }
    let payload = {
      user_type: 1,
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      mobile_number: formData.mobile_number,
      languages:
        formData.languages.length > 0 ? formData.languages.toString() : "",
      other_language: formData.other_language,
    };

    if (this.state.showUpdatePassword) {
      payload.password = formData.password;
    }

    return { success: true, payload };
  };

  showUpdatePasswordHandler = () => {
    this.setState({ showUpdatePassword: !this.state.showUpdatePassword });
  };

  updateAdminDetails = () => {
    const validation = this.formValidation();

    if (!validation.success) {
      return;
    }
    // Phone number validation for  view admin details
    if (!/^\d{10,10}$/.test(this.state.formData.mobile_number)) {
      this.openNotification("Error", "Mobile Number is invalid.", 0);
      return { success: true, payload: null };
    }

    this._startPageLoader();

    this.props
      .updateStaff(
        this.props.user.id,
        this.state.adminDetails.id,
        validation.payload
      )
      .then((result) => {
        this.setState({ loader: false });
        this.openNotification("Success", "Details Updated Successfully.", 1);
        this.getAdminDataTimeOut(this.state.adminDetails.id, false);
      })
      .catch((error) => {
        this.setState({ loader: false });
        this.openNotification("Error", error.message, 0);
      });
  };

  updateRoleHandler = (role_id) => {
    const payload = {
      admin_id: this.state.adminDetails.id,
      role_id,
    };

    if (!this.state.adminDetails.role_ids.includes(role_id)) {
      this.assignRoleHandler(payload);
    } else {
      this.removeRoleHandler(payload);
    }
  };

  assignRoleHandler = (payload) => {
    this._startPageLoader();
    this.adminService
      .assignRole(payload)
      .then((res) => {
        this._stopPageLoader();
        this.openNotification("Success", "Role Assigned Successfully.", 1);
        this.getAdminDataTimeOut(this.state.adminDetails.id, false);
      })
      .catch((err) => {
        this._stopPageLoader();
        this.openNotification(
          "Error",
          "Something went wrong. Please try again later.",
          0
        );
      });
  };

  removeRoleHandler = (payload) => {
    this._startPageLoader();
    this.adminService
      .removeAssignedRole(payload)
      .then((res) => {
        this._stopPageLoader();
        this.openNotification("Success", "Role Removed Successfully.", 1);
        this.getAdminDataTimeOut(this.state.adminDetails.id, false);
      })
      .catch((err) => {
        this._stopPageLoader();
        this.openNotification(
          "Error",
          "Something went wrong. Please try again later.",
          0
        );
      });
  };

  render() {
    const { navigationDeployed, formData, adminDetails, roles } = this.state;
    return (
      <React.Fragment>
        {getRenderingHeader(this.props.user)}

        <div
          className={
            navigationDeployed
              ? "viewelder-page sidebar-page sidebar-page--open position-relative"
              : "viewelder-page sidebar-page sidebar-page--closed position-relative"
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
            <div className="internal-header">
              <div className="internal-header-left">
                <h2>Admin Details</h2>
              </div>
            </div>

            <div className="internal-content">
              <div className="elder-details">
                <div className="row">
                  <div className="col-12 col-sm-8">
                    <div className="elder-details-area">
                      <div className="row">
                        <div className="col-6">
                          <Form.Group>
                            <Form.Label>First Name</Form.Label>

                            <Form.Control
                              type="text"
                              value={formData.first_name}
                              onChange={(e) =>
                                this.setStateValues("first_name", e)
                              }
                              placeholder="Vijay"
                            />
                          </Form.Group>
                        </div>

                        <div className="col-6">
                          <Form.Group>
                            <Form.Label>Last Name</Form.Label>

                            <Form.Control
                              type="text"
                              value={formData.last_name}
                              onChange={(e) =>
                                this.setStateValues("last_name", e)
                              }
                              placeholder="Singh"
                            />
                          </Form.Group>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-6">
                          <Form.Group>
                            <Form.Label>Contact Number</Form.Label>

                            <Form.Control
                              type="number"
                              className="no-arrow"
                              value={formData.mobile_number}
                              placeholder="9876543210"
                            />
                          </Form.Group>
                        </div>

                        <div className="col-6">
                          <Form.Group>
                            <Form.Label>Email Address</Form.Label>

                            <Form.Control
                              type="text"
                              value={formData.email}
                              onChange={(e) => this.setStateValues("email", e)}
                              placeholder="test@admin.com"
                            />
                          </Form.Group>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-12">
                          <Form.Label>Roles</Form.Label>
                          <div className="row">
                            {roles &&
                              roles.length !== 0 &&
                              roles.map((role, index) => {
                                return (
                                  <div key={index} className="col-6">
                                    <Checkbox
                                      checked={
                                        adminDetails &&
                                        adminDetails.role_ids &&
                                        adminDetails.role_ids.includes(role.id)
                                          ? true
                                          : false
                                      }
                                      onChange={() =>
                                        this.updateRoleHandler(role.id)
                                      }
                                      value={role.id}
                                    >
                                      {role.role}
                                    </Checkbox>
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                      </div>
                      <div className="language-spoken">
                        <LanguagesSpoken
                          option={formData.languages}
                          onChange={this.setLanguages}
                          className="language"
                        />

                        <div className="row">
                          <div className="col-12 col-sm-6">
                            <Form.Group controlId="otherLanguage">
                              <Form.Label>Other Language</Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="Other Langauge"
                                disabled={!formData.languages.includes("Other")}
                                value={
                                  this.state.formData.languages.includes(
                                    "Other"
                                  )
                                    ? formData.other_language
                                    : ""
                                }
                                onChange={(e) =>
                                  this.setStateValues("other_language", e)
                                }
                              />
                            </Form.Group>
                          </div>
                        </div>
                      </div>
                      {!this.state.showUpdatePassword ? (
                        <Button
                          type="button"
                          className="btn btn-link"
                          onClick={(e) => this.showUpdatePasswordHandler()}
                        >
                          <FontAwesomeIcon icon={faPlus} /> Update Password
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          className="btn btn-link"
                          onClick={(e) => this.showUpdatePasswordHandler()}
                        >
                          <FontAwesomeIcon icon={faMinus} /> Cancel
                        </Button>
                      )}
                      <br />
                      {this.state.showUpdatePassword ? (
                        <div className="row">
                          <div className="col-12 col-sm-6">
                            <Form.Group controlId="responderPassword">
                              <Form.Label>Password</Form.Label>
                              <Form.Control
                                type="password"
                                placeholder="New password"
                                onChange={(e) =>
                                  this.setStateValues("password", e)
                                }
                              />
                            </Form.Group>
                          </div>
                          <div className="col-12 col-sm-6">
                            <Form.Group controlId="responderCPassword">
                              <Form.Label>Confirm password</Form.Label>
                              <Form.Control
                                type="password"
                                placeholder="Confirm new password"
                                onChange={(e) =>
                                  this.setStateValues("confirm_password", e)
                                }
                              />
                            </Form.Group>
                          </div>
                        </div>
                      ) : null}

                      <Button
                        onClick={() => this.updateAdminDetails()}
                        type="button"
                        className="btn btn-primary"
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                </div>
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

const mapDispatchToProps = {
  updateStaff,
};

export default hasPermission(
  requireAuth(connect(mapsStateToProps, mapDispatchToProps)(ViewAdminPage))
);
