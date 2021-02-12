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
      adminList: [],
      responderList: [],
    };

    this.style = {};
    this.adminService = new AdminService();
    this.handleChange = this.handleChange.bind(this);
    this.handleChange1 = this.handleChange1.bind(this);
    this.assignRole = this.assignRole.bind(this);
    this.onAdminSearch = this.onAdminSearch.bind(this);
    this.onResponderSearch = this.onResponderSearch.bind(this);
  }

  componentDidMount() {
    document.title = "Emoha Admin | Assign Role";
    const payload = { page: 0 };

    this.adminService.getStaffAdminList(payload).then((result) => {
      const { data } = result;
      this.setState({ adminList: data });
    });

    this.adminService.getResponderList(payload).then((result) => {
      const { data } = result;
      const filteredData = data.filter(function (el) {
        return el.full_name !== "";
      });
      this.setState({ responderList: filteredData });
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
      responder_id: this.state.role,
      admin_id: this.state.admin,
    };
    this._startPageLoader();
    this.adminService
      .adminResponderAssignRoles(payload)
      .then((result) => {
        if (result) {
          this.openNotification("Success", "Role has been assigned.", 1);
          this._stopPageLoader();
          this.setState({
            admin: "",
            role: "",
          });
        }
      })
      .catch((error) => {
        this._stopPageLoader();
        this.openNotification(
          "Error",
          "This responder has already been assigned to this admin",
          0
        );
        this.setState({
          admin: "",
          role: "",
        });
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

  onAdminSearch(value) {
    const payload = {
      userType: 1,
      query: value,
    };
    this.adminService.getUserByType(payload).then((result) =>
      this.setState({
        adminList: result.data,
      })
    );
  }

  onResponderSearch(value) {
    const payload = {
      userType: 2,
      query: value,
    };
    this.adminService.getUserByType(payload).then((result) =>
      this.setState({
        responderList: result.data,
      })
    );
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
              <FontAwesomeIcon icon={faCaretRight} size="2x" color="#780001" />
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
                <Typography>Select Admin</Typography>
                <Select
                  showSearch
                  mode="single"
                  size="small"
                  value={this.state.admin}
                  placeholder="Please select"
                  onChange={this.handleChange}
                  style={{ width: "80%" }}
                  onSearch={this.onAdminSearch}
                  onFocus={() => {}}
                  onBlur={() => {}}
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {_.map(_.get(this.state, "adminList", []), (item) => (
                    <Option
                      key={item.id}
                      value={_.get(item, "id", _.get(item, "owner.id", "n/a"))}
                    >
                      {item.full_name}
                    </Option>
                  ))}
                </Select>
                <Typography>Select Responder</Typography>
                <Select
                  showSearch
                  mode="single"
                  size="small"
                  value={this.state.role}
                  placeholder="Please select"
                  onChange={this.handleChange1}
                  style={{ width: "80%" }}
                  onSearch={this.onResponderSearch}
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  style={{ minWidth: 300 }}
                >
                  {_.map(_.get(this.state, "responderList", []), (item) => (
                    <Option
                      key={item.id}
                      value={_.get(item, "id", _.get(item, "owner.id", "n/a"))}
                    >
                      {item.full_name}
                    </Option>
                  ))}
                </Select>
                <br />
                <br />
                <Button
                  disabled={
                    _.isEmpty(this.state.admin) || _.isEmpty(this.state.role)
                  }
                  onClick={this.assignRole}
                >
                  Assign responder to admin role
                </Button>
              </Col>
            </Card>
          </main>
        </div>
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
