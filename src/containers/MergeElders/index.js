import React from "react";
import { Button, Form } from "react-bootstrap";
import PageLoader from "../../components/PageLoader";
import SideNavigation from "../../components/SideNavigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretRight,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import { getRenderingHeader } from "../../common/helpers";
import styles from "./merge-elders.scss";
import { notification, Select, Modal } from "antd";
import { connect } from "react-redux";
import requireAuth from "../../hoc/requireAuth";
import MergeElderManager from "./dataManager";
import ElderService from "../../service/ElderService";
import hasPermission from "../../hoc/hasPermission";
import { consumerSearchList } from "../../actions/EmergencyActions";
const { Option } = Select;
const { confirm } = Modal;

class MergeElders extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      navigationDeployed: true,
      loader: false,
      finalMerger: "",
      changeMapping: [],
      users: [],
    };

    this.mergeElderManager = new MergeElderManager();
    this.elderService = new ElderService();
  }

  componentDidMount() {
    document.title = "Emoha Admin | Merge Elders";
  }

  startLoader = () => {
    this.setState({ loader: true });
  };

  stopLoader = () => {
    this.setState({ loader: false });
  };

  formValidation = () => {
    const { finalMerger, changeMapping } = this.state;

    if (!finalMerger || !changeMapping.length) {
      return {
        validation: false,
        msg: "All fields are neecessary",
      };
    }
    if (changeMapping.includes(finalMerger)) {
      return {
        validation: false,
        msg: "Final Elder should be different from Selected Elders",
      };
    }
    return {
      validation: true,
      msg: "",
    };
  };

  setStateValues = (e, field) => {
    let state = this.state;
    state[`${field}`] = e;
    this.setState(state);
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
      duration: 3,
      style,
    };
    notification.open(args);
  };

  getConsumersList = async (query) => {
    let users = [];
    if (!query || query === "") {
      users = [];
      this.setState({ users });
      return;
    }
    await this.props.consumerSearchList(query, 1).then((result) => {
      result.data.forEach((data, index) => {
        users.push(data);
      });
    });

    this.setState({ users });
  };

  getUsers = (userSearch) => {
    this.elderService
      .getInactivePlanUsers(userSearch)
      .then((res) => {
        if (res.data && res.data.length) {
          this.setState({ users: res.data });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  mergeUserHandler = () => {
    const { validation, msg } = this.formValidation();
    if (!validation) {
      return this.openNotification("Error", msg, 0);
    }
    confirm({
      title:
        "Merging of users is permanent action. Do you still want to continue ?",
      okType: "danger",
      okText: "Yes, Continue",
      cancelText: "No, Abort",
      centered: true,
      onOk: () => {
        const { finalMerger, changeMapping } = this.state;
        const payload = {
          finalMerger,
          changeMapping,
        };
        this.startLoader();
        this.mergeElderManager
          .mergeElders(payload)
          .then((res) => {
            this.openNotification("Success", "Elders Merged Successfully", 1);
            this.stopLoader();
            this.setState({
              finalMerger: "",
              changeMapping: [],
            });
          })
          .catch((err) => {
            this.stopLoader();
            console.log(err);
            this.openNotification(
              "Error",
              "Something went wrong Please try again",
              0
            );
            this.setState({
              finalMerger: "",
              changeMapping: [],
            });
          });
      },
      onCancel() {
        return false;
      },
    });
  };

  render() {
    const { navigationDeployed } = this.state;

    return (
      <React.Fragment>
        {getRenderingHeader(this.props.user)}
        <div
          className={
            navigationDeployed
              ? "addelders-page sidebar-page sidebar-page--open position-relative"
              : "addelders-page sidebar-page sidebar-page--closed position-relative"
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
              <FontAwesomeIcon icon={faCaretRight} size="2x" color="#780001"  />
            </Button>
          )}

          <main className="sidebar-page-wrapper position-relative">
            <div className="internal-header">
              <div className="internal-header-left">
                <h2>Merge Users </h2>
              </div>
            </div>
            <div className="internal-content">
              <div className="row">
                <div className="col-12 col-sm-8">
                  <div className="form-container">
                    <Form className="map-provider-form">
                      <div className="row">
                        <div className="col-12">
                          <div className="row">
                            <div className="col-sm-10">
                              <Form.Group controlId="communityEventCity">
                                <Form.Label>
                                  Please select elders to merge
                                </Form.Label>
                                <Select
                                  showSearch
                                  mode="multiple"
                                  placeholder="Select multiple elders"
                                  onChange={(e) =>
                                    this.setStateValues(e, "changeMapping")
                                  }
                                  value={this.state.changeMapping}
                                  onSearch={this.getConsumersList}
                                  defaultActiveFirstOption={false}
                                  filterOption={false}
                                  style={{ minWidth: 300 }}
                                >
                                  <Option value={""} disabled>
                                    Please select elders to merge
                                  </Option>
                                  {this.state.users && this.state.users.length
                                    ? this.state.users.map((user, index) => (
                                        <Option key={index} value={user.id}>
                                          {`${user.full_name} (${user.mobile_number}) - ${user.id}`}
                                        </Option>
                                      ))
                                    : null}
                                </Select>
                              </Form.Group>
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-sm-10">
                              <Form.Group controlId="communityEventCity">
                                <Form.Label>
                                  Please select Final Elder
                                </Form.Label>
                                <Select
                                  showSearch
                                  mode="single"
                                  placeholder="Select Final Elder"
                                  onChange={(e) =>
                                    this.setStateValues(e, "finalMerger")
                                  }
                                  value={this.state.finalMerger}
                                  onSearch={this.getConsumersList}
                                  defaultActiveFirstOption={false}
                                  filterOption={false}
                                  style={{ minWidth: 300 }}
                                >
                                  <Option value={""} disabled>
                                    Please select Final Elder
                                  </Option>
                                  {this.state.users && this.state.users.length
                                    ? this.state.users.map((user, index) => (
                                        <Option key={index} value={user.id}>
                                          {`${user.full_name} (${user.mobile_number}) - ${user.id}`}
                                        </Option>
                                      ))
                                    : null}
                                </Select>
                              </Form.Group>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="merge-explanation">
                        <h4 className="merge-explanation-title">
                          <FontAwesomeIcon icon={faExclamationTriangle} />
                          Merging Procedure:
                        </h4>
                        <p className="merge-explanation-description">
                          The system will merge the Source record into the
                          Destination record and DELETE the source record. The
                          merging logic works as follows:
                          <ol className="merge-explanation-list">
                            <li>
                              The following fields will be MERGED from Source to
                              Destination:
                              <ul>
                                <li>
                                  General Tab: Family Members, Users Addresses
                                  and Team Member Assigned
                                </li>
                                <li>
                                  Emergency Tab: Emergency Contacts and
                                  Emergency Requests (excluding Virtual House
                                  Mapping)
                                </li>
                                <li>Concierge Requests</li>
                                <li>Notes</li>
                              </ul>
                            </li>
                            <li>
                              The following fields will be merged from the
                              Source record to Destination record only if no
                              data (in any field) is already available in the
                              Destination record. Otherwise, the source data
                              will be ignored.
                              <ul>
                                <li>Plans</li>
                                <li>Medical</li>
                                <li>Social</li>
                                <li>Virtual House Mapping - AF5</li>
                              </ul>
                            </li>
                          </ol>
                        </p>
                      </div>
                      <div>
                        <div>
                          <Button
                            onClick={this.mergeUserHandler}
                            className="btn btn-primary"
                          >
                            Confirm Merge
                          </Button>
                        </div>
                      </div>
                    </Form>
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

const mapStateToProps = (state) => ({
  user: state.user.user,
});

export default hasPermission(
  requireAuth(
    connect(mapStateToProps, {
      consumerSearchList,
    })(MergeElders)
  )
);
