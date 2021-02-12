import React from "react";
import * as _ from "lodash";

import {
  notification,
  Modal,
  Card,
  Select,
  Typography,
  Button,
  Col,
} from "antd";
import { connect } from "react-redux";
import { getRenderingHeader } from "../../common/helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretRight } from "@fortawesome/free-solid-svg-icons";
import requireAuth from "../../hoc/requireAuth";
import PageLoader from "../../components/PageLoader";
import SideNavigation from "../../components/SideNavigation";
import AdminService from "../../service/AdminService";
import hasPermission from "../../hoc/hasPermission";

const { Option } = Select;

const children = [];
const children1 = [];

class ViewAdminRolePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loader: false,
      admin: "",
      role: "",
      rolesList: [],
      navigationDeployed: true,
    };

    this.style = {};
    this.adminService = new AdminService();
    this.handleChange = this.handleChange.bind(this);
    this.handleChange1 = this.handleChange1.bind(this);
    this.assignRole = this.assignRole.bind(this);
  }

  componentDidMount() {
    document.title = "Emoha Admin | Assign Role";
    const payload = { page: 0 };

    this.adminService.getAdminsList(payload).then((result) => {
      const { data } = result;
      for (let i = 0; i < data.length; i += 1) {
        children.push(
          <Option key={data[i].id} value={data[i].id}>
            {data[i].full_name}
          </Option>
        );
      }
    });

    this.adminService.getAdminsRoles(payload).then((result) => {
      const { data } = result;
      this.setState({
          rolesList: data,
      })
      for (let i = 0; i < data.length; i += 1) {
        children1.push(
          <Option key={data[i].id} value={data[i].id}>
            {data[i].role}
          </Option>
        );
      }
    });
  }

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

  addRoleConfirmation = () => {
    Modal.confirm({
      title: `You won't be able to edit this role's title once added. Continue ?`,
      okType: "danger",
      okText: "Yes, Continue",
      cancelText: "No, Abort",
      centered: true,
      onOk: () => {
        this.addRoleHandler();
      },
      onCancel() {
        return;
      },
    });
  };

  assignRole = () => {
    const payload = {
      role_id: this.state.role,
      admin_id: this.state.admin,
    };
    this._startPageLoader();
    this.adminService
      .adminsAssignRoles(payload)
      .then((result) => {
        if (result) {
            const roleData = _.filter(this.state.rolesList, {id: this.state.role })
            this.openNotification("Success", "Role has been assigned.", 1);
            this._stopPageLoader();
            this.setState({
                admin:'',
                role:'',
            })
          this.adminService
            .adminsListRoles({ role: roleData[0].role })
            .then((result) => {
              if (result) {
               console.log(result)
              }
            });
        }
      })
      .catch((error) => {
        this._stopPageLoader();
        this.openNotification("Error", error.message, 0);
      });
  };

  handleChange(value) {
    this.setState({
      admin: value,
    });
  }

  handleChange1(value) {
    this.setState({
      role: value,
    });
  }

  render() {
    const { navigationDeployed, formData } = this.state;
    return (
      <React.Fragment>
        {getRenderingHeader(this.props.user)}

        <div
          className={
            navigationDeployed
              ? "viewelder-page sidebar-page sidebar-page--open position-relative"
              : "viewelder-page sidebar-page sidebar-page--closed position-relative"
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
              <FontAwesomeIcon icon={faCaretRight} size="2x" color="#780001"  />
            </Button>
          )}

          <main className="sidebar-page-wrapper position-relative">
            <div className="internal-header">
              <div className="internal-header-left">
                <h2>Role Assign Details</h2>
              </div>
            </div>

            <Card className="d-flex flex-column">
              <Col span={20}>
                <Typography>Admin</Typography>
                <Select
                  mode="single"
                  size="small"
                  placeholder="Please select"
                  onChange={this.handleChange}
                  style={{ width: "80%" }}
                >
                  {children}
                </Select>
                <Typography>Role</Typography>
                <Select
                  mode="single"
                  size="small"
                  placeholder="Please select"
                  onChange={this.handleChange1}
                  style={{ width: "80%" }}
                >
                  {children1}
                </Select>
                <br />
                <br />
                <Button
                  disabled={
                    _.isEmpty(this.state.admin) || _.isEmpty(this.state.role)
                  }
                  onClick={this.assignRole}
                >
                  Asign role
                </Button>
              </Col>
            </Card>
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

const mapDispatchToProps = {};

export default hasPermission(
  requireAuth(connect(mapsStateToProps, mapDispatchToProps)(ViewAdminRolePage))
);
