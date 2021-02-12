import React from "react";
import get from "lodash/get";
import mojs from "@mojs/core";
import Noty from "noty";
import "noty/lib/noty.css";
import "noty/lib/themes/mint.css";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { ROUTES, PERMISSIONS } from "../../common/constants";
import { faBell } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { isEmpty } from "lodash";
import {
  fetchNotifications,
  readNotifications,
  resetNotifications,
} from "../../actions/NotificationActions";

import NotificationService from "../../service/NotificationService";
import Logo from "../../assets/images/logos/emoha-logo.svg";

import styles from "./header.scss";
import alertMp3 from "./alert.mp3";
import chatMp3 from "./chat.mp3";
import { analytics } from "../../actions/UserActions";

Noty.defaults = {
  maxVisible: 1,
};

class Header extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasLoadMore: false,
      notificationPanelOpen: false,
      currentNotificationsPage: 0,
      analytics: null,
      playAudioFlag: true,
    };

    this.notificationService = new NotificationService();
    this.audioLoadContext = new AudioContext();
  }

  componentDidMount() {
    if (!isEmpty(get(this.props, "user"))) {
      this.props.resetNotifications();
      this.getDisplayNotifications();
      if (isEmpty(get(this.props, "user.analytics_data"))) {
        this.props.analytics().then((res) => {
          this.setState({
            analytics: res.data,
          });
        });
      }
    }

    this.requestInterval = setInterval(() => {
      if (!isEmpty(get(this.props, "user"))) {
        this.getAnalytics();
      }
    }, 30000);
  }

  getAnalytics = () => {
    this.props
      .analytics()
      .then((res) => {
        if (
          res.data.new_emergencies > 0
        ) {
          new Noty.setMaxVisible(1, "new_emergency");
          new Noty({
            queue: "new_emergency",
            type: "error",
            text: "New emergeny has been created",
            timeout: 6000,
            layout: "topRight",
            theme: "mint",
            sounds: {
              sources: [alertMp3],
              volume: 1,
              conditions: ["docVisible", "docHidden"],
            },
            animation: {
              open: function (promise) {
                var n = this;
                var Timeline = new mojs.Timeline();
                var body = new mojs.Html({
                  el: n.barDom,
                  x: { 500: 0, delay: 0, duration: 500, easing: "elastic.out" },
                  isForce3d: true,
                  onComplete: function () {
                    promise(function (resolve) {
                      resolve();
                    });
                  },
                });

                var parent = new mojs.Shape({
                  parent: n.barDom,
                  width: 200,
                  height: n.barDom.getBoundingClientRect().height,
                  radius: 0,
                  x: { [150]: -150 },
                  duration: 1.2 * 500,
                  isShowStart: true,
                });

                n.barDom.style["overflow"] = "visible";
                parent.el.style["overflow"] = "hidden";

                var burst = new mojs.Burst({
                  parent: parent.el,
                  count: 10,
                  top: n.barDom.getBoundingClientRect().height + 75,
                  degree: 90,
                  radius: 75,
                  angle: { [-90]: 40 },
                  children: {
                    fill: "#EBD761",
                    delay: "stagger(500, -50)",
                    radius: "rand(8, 25)",
                    direction: -1,
                    isSwirl: true,
                  },
                });

                var fadeBurst = new mojs.Burst({
                  parent: parent.el,
                  count: 2,
                  degree: 0,
                  angle: 75,
                  radius: { 0: 100 },
                  top: "90%",
                  children: {
                    fill: "#EBD761",
                    pathScale: [0.65, 1],
                    radius: "rand(12, 15)",
                    direction: [-1, 1],
                    delay: 0.8 * 500,
                    isSwirl: true,
                  },
                });

                Timeline.add(body, burst, fadeBurst, parent);
                Timeline.play();
              },
              close: function (promise) {
                var n = this;
                new mojs.Html({
                  el: n.barDom,
                  x: { 0: 500, delay: 10, duration: 500, easing: "cubic.out" },
                  skewY: {
                    0: 10,
                    delay: 10,
                    duration: 500,
                    easing: "cubic.out",
                  },
                  isForce3d: true,
                  onComplete: function () {
                    promise(function (resolve) {
                      resolve();
                    });
                  },
                }).play();
              },
            },
          }).show();
        }
        this.setState({
          analytics: res.data,
        });

        if (res.data.chats.length > 0) {
          new Noty.setMaxVisible(1, "new_message");
          new Noty({
            queue: "new_message",
            type: "success",
            text: "A new message has been arrived",
            timeout: 6000,
            layout: "topRight",
            theme: "mint",
            sounds: {
              sources: [chatMp3],
              volume: 1,
              conditions: ["docVisible", "docHidden"],
            },
          }).show();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  getDisplayNotifications = () => {
    const { currentNotificationsPage } = this.state;

    this.notificationService
      .getNotifications(currentNotificationsPage)
      .then((responseData) => {
        if (responseData) {
          this.props.fetchNotifications(responseData.data);

          if (
            responseData.meta.pagination.total >
            responseData.meta.pagination.perPage *
            (currentNotificationsPage + 1)
          ) {
            this.setState({ hasLoadMore: true });
          } else {
            this.setState({ hasLoadMore: false });
          }
        }
      })
      .catch((errorData) => {
        console.log("UNABLE TO FETCH NOTIFICATIONS", errorData);
      });
  };

  toggleNotificationPanel = () => {
    this.setState((state) => ({
      notificationPanelOpen: !state.notificationPanelOpen,
    }));
  };

  handleClearNotifications = () => {
    this.notificationService
      .markNotificationsRead()
      .then((responseData) => {
        if (responseData && responseData.code === 200) {
          this.props.readNotifications();
        }
      })
      .catch((errorData) => {
        console.log("ERROR MARKING NOTIFICATIONS READ", errorData);
      });
  };

  getNotificationsRoute = (notificationType, userIdentifier) => {
    if (notificationType !== "" && userIdentifier !== "") {
      switch (notificationType) {
        case "ADMIN_ELDER":
          return ROUTES.ELDERDETAILS.replace(":id", userIdentifier);

        case "ADMIN_VIDEO":
          return ROUTES.VIDEOSUPPORTPAGE;

        default:
          return "#";
      }
    } else {
      return "#";
    }
  };

  handleLoadMore = () => {
    this.setState(
      (state) => ({
        ...state,
        currentNotificationsPage: state.currentNotificationsPage + 1,
      }),
      () => {
        this.getDisplayNotifications();
      }
    );
  };

  componentWillUnmount = async () => {
    await clearInterval(this.requestInterval);
  };

  render() {
    const { notificationPanelOpen, hasLoadMore } = this.state;
    const {
      leftChildren,
      rightChildren,
      notifications,
      notificationsCount,
    } = this.props;

    return (
      <React.Fragment>
        <header className="application-header" style={styles}>
          <div className="application-header-left">
            <Link to={ROUTES.LOGIN}>
              <img
                src={Logo}
                className="application-header-logo"
                alt="Emoha Admin"
              />
            </Link>

            {leftChildren}
          </div>

          {rightChildren && (
            <div className="application-header-right">
              <button
                type="button"
                onClick={() => this.toggleNotificationPanel()}
                className="notification-wrapper position-relative"
              >
                <FontAwesomeIcon icon={faBell} />
                {notificationsCount !== undefined &&
                  notificationsCount !== null &&
                  notificationsCount !== 0 && (
                    <span className="notification-count">
                      {notificationsCount > 99 ? "99+" : notificationsCount}
                    </span>
                  )}
              </button>

              {rightChildren}
            </div>
          )}
        </header>
        {notificationPanelOpen && (
          <aside className="notification-panel d-flex align-items-start justify-content-start flex-column animated slideInRight">
            <div className="notification-panel-header d-flex align-items-center justify-content-between w-100">
              <div className="flex-wrapper d-flex align-item-center justify-content-start">
                <h4 className="notification-panel-title">Notifications</h4>
                {notifications !== undefined &&
                  notifications !== null &&
                  notifications.length !== 0 && (
                    <button
                      type="button"
                      className="notification-panel-clear"
                      onClick={() => this.handleClearNotifications()}
                    >
                      Mark All Read
                    </button>
                  )}
              </div>

              <button
                type="button"
                className="notification-panel-close"
                onClick={() => this.toggleNotificationPanel()}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            <div className="notification-panel-content d-flex align-items-start justify-content-start flex-column w-100">
              {notifications !== undefined &&
                notifications !== null &&
                notifications.length !== 0 ? (
                  notifications.map((item, index) => {
                    return (
                      <a
                        key={index}
                        href={this.getNotificationsRoute(
                          get(item, "type", ""),
                          get(item, "payload.identifier", "")
                        )}
                        className={
                          !item.read
                            ? "notification-item notification-item--unread"
                            : "notification-item"
                        }
                      >
                        <div className="notification-item-wrapper">
                          <div className="notification-item-header">
                            <h6 className="notification-item-title">
                              {`#${index + 1}`}
                            </h6>
                          </div>
                          <div className="notification-item-content">
                            <p className="notification-item-text">
                              {item.content}
                            </p>
                          </div>
                          <div className="notification-item-footer">
                            <span className="notification-item-timestamp">
                              {item.created_at}
                            </span>
                          </div>
                        </div>
                      </a>
                    );
                  })
                ) : (
                  <div className="notification-item-empty">
                    <p>No Notifications Available</p>
                  </div>
                )}

              {hasLoadMore && (
                <div className="notification-item-loadable w-100 d-flex align-items-center justify-content-center">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => this.handleLoadMore()}
                  >
                    Load More
                  </button>
                </div>
              )}
            </div>
          </aside>
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  notifications: state.notification.notifications,
  notificationsCount: state.notification.notificationsCount,
  user: state.user.user,
});

const mapDispatchToProps = {
  fetchNotifications,
  readNotifications,
  resetNotifications,
  analytics,
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
// export default hasPermission(
//   requireAuth(connect(mapsStateToProps, mapDispatchToProps)(EmergenciesPage))
// );
