import React from "react";

import { Select, notification, Modal } from "antd";
import { Button, Form } from "react-bootstrap";

import SubHeader from "../../components/SubHeader";
import PageLoader from "../../components/PageLoader";
import SideNavigation from "../../components/SideNavigation";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretRight } from "@fortawesome/free-solid-svg-icons";
import NotificationsManagerFile from "./dataManager";
import { getRenderingHeader } from "../../common/helpers";
import requireAuth from "../../hoc/requireAuth";
import { connect } from "react-redux";

import { consumerSearchList } from "../../actions/EmergencyActions";

import hasPermission from "../../hoc/hasPermission";
import styles from "./notifications-page.scss";

const NotificationsManager = new NotificationsManagerFile();
const { confirm } = Modal;

class NotificationsPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      navigationDeployed: true,
      page: 1,
      loader: false,
      searchFieldText: "",
      consumers: [],
      content: "",
      userID: "",
    };
  }

  componentDidMount() {
    document.title = "Emoha Admin | Notifications";
  }

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

  getConsumersList = async (query) => {
    let consumers = [];
    if (!query || query === "") {
      consumers = [];
      this.setState({ consumers });
      return;
    }

    this.props.consumerSearchList(query, 1).then((result) => {
      this.setState({ consumers: result.data });
    });
  };

  userSearchHandler = (value) => {
    this.setState({ searchFieldText: value });
    this.getConsumersList(value);
  };

  confirmNotification = () => {
    confirm({
      title:
        "Confirm whether you wish to send this notification to all Emoha users?",
      okText: "Yes, Continue",
      okType: "danger",
      cancelText: "No, Abort",
      centered: true,
      onOk: () => {
        this.addNotificationHandler(false);
      },
      onCancel() {
        return;
      },
    });
  };

  addNotificationHandler = (showConfirmationDialog = true) => {
    if (!this.state.content) {
      return this.openNotification(
        "Error",
        "Notification content is required.",
        0
      );
    }

    if (showConfirmationDialog && !this.state.userID) {
      return this.confirmNotification();
    }

    this._startPageLoader();
    NotificationsManager.addNotification({
      userID: this.state.userID,
      content: this.state.content,
    })
      .then((res) => {
        this.openNotification("Success", "Notification Sent Successfully.", 1);
        this.setState({ content: "", userID: "", loader: false });
      })
      .catch((error) => {
        this._stopPageLoader();
        this.openNotification("Error", error.response.data.message, 0);
      });
  };

  getRenderingSubHeader = () => {
    const leftChildren = [<h2 key={0}>Notifications</h2>];

    const rightChildren = [];

    return (
      <SubHeader leftChildren={leftChildren} rightChildren={rightChildren} />
    );
  };

  render() {
    const { navigationDeployed } = this.state;

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

            <div className="internal-content">
              <div className="row">
                <div className="col-6">
                  <h4 className="add-plan-category">Post a notification</h4>
                  <Form.Group controlId="responderFirstName">
                    <Form.Label>Notification: </Form.Label>
                    <Form.Control
                      rows="4"
                      as="textarea"
                      maxLength={160}
                      placeholder="Short content of the notification..."
                      value={this.state.content}
                      onChange={(e) =>
                        this.setState({ content: e.currentTarget.value })
                      }
                    />
                  </Form.Group>
                  <Form.Group controlId="emergencyUser">
                    <Form.Label>User: </Form.Label>
                    <br />
                    <Select
                      showSearch
                      style={{ width: "100%" }}
                      showArrow={false}
                      notFoundContent={
                        this.state.searchFieldText === "" ||
                        this.state.searchFieldText === null
                          ? null
                          : "User not found"
                      }
                      defaultActiveFirstOption={false}
                      value={this.state.userID}
                      onSearch={(value) => this.userSearchHandler(value)}
                      onChange={(e) => this.setState({ userID: e })}
                      placeholder="Search for a user"
                      filterOption={false}
                      style={{ minWidth: 300 }}
                    >
                      <Select.Option value={""}>
                        Search for a user
                      </Select.Option>
                      {this.state.consumers.map((consumer, index) => {
                        return (
                          <Select.Option
                            key={consumer.id}
                            value={consumer.id}
                          >{`${consumer.full_name}  ${
                            consumer.mobile_number
                              ? "(" +
                                consumer.country_code +
                                "-" +
                                consumer.mobile_number +
                                ")"
                              : ""
                          }`}</Select.Option>
                        );
                      })}
                    </Select>
                  </Form.Group>
                  <div className="notifications-page-definition">
                    <h6>Please note</h6>
                    <ul>
                      <li>
                        <b>Notification</b>: Specify the content of a
                        notification. Notification once sent can not be deleted.
                      </li>
                      <li>
                        <b>User</b>: Select the user to whom you want to send
                        the notification. If not selected, notification will be
                        sent to all the users.
                      </li>
                    </ul>
                  </div>
                  <hr />
                  <button
                    onClick={() => this.addNotificationHandler(true)}
                    className="btn btn-primary"
                  >
                    SEND
                  </button>
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

const mapStateToProps = (state) => ({
  user: state.user.user,
});

export default hasPermission(
  requireAuth(
    connect(mapStateToProps, { consumerSearchList })(NotificationsPage)
  )
);
