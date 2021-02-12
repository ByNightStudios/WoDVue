import React from 'react';
import get from 'lodash/get';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCaretLeft,
  faChartBar,
  faRunning,
  faUserFriends,
  faUserTie,
  faComments,
  faHands,
  faUsers,
  faTasks,
  faFileInvoice,
  faChartLine,
  faBell,
  faUsersCog,
  faVideo,
} from '@fortawesome/free-solid-svg-icons';
import { includes } from 'lodash';
import { connect } from 'react-redux';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import styles from './side-navigation.scss';
import AlertLight from '../../assets/images/icons/alert-light.svg';
import { ROUTES, PERMISSIONS } from '../../common/constants';

class SideNavigation extends React.Component {
  constructor(props) {
    super(props);

    this.urlPath = window.location.pathname;
    this.activeStyle = { backgroundColor: '#EBEBEB' };
  }

  render() {
    const { handleClose } = this.props;
    const permissions = get(this.props, 'user.permissions', []);
    return (
      <aside
        className="application-sidebar animated slideInLeft"
        style={styles}
      >
        <div className="application-sidebar-container">
          <Button
            type="button"
            className="btn btn-trigger position-fixed side-bar-button"
            onClick={handleClose}
          >
            <FontAwesomeIcon icon={faCaretLeft} size="2x" color="#780001" />
          </Button>

          {/* Being Navigation Items Below */}
          <ul className="navigation-list">
            <li>
              <Link
                to={ROUTES.DASHBOARD}
                style={
                  ROUTES.DASHBOARD === this.urlPath ? this.activeStyle : null
                }
              >
                <FontAwesomeIcon icon={faChartBar} /> Dashboard
              </Link>
            </li>

            {permissions &&
              permissions.length !== 0 &&
              permissions.includes(PERMISSIONS.EMERGENCY_VIEW.value) && (
              <li>
                <Link
                  to={ROUTES.EMERGENCIES}
                  style={
                    ROUTES.EMERGENCIES === this.urlPath
                      ? this.activeStyle
                      : null
                  }
                >
                  <img
                    src={AlertLight}
                    className="alert-lamp"
                    alt="Emergencies"
                  />{' '}
                    Emergencies
                </Link>
                <ul className="navigation-sublist">
                  <li>
                    {permissions &&
                        permissions.length !== 0 &&
                        permissions.includes(
                          PERMISSIONS.EMERGENCY_CREATE.value,
                        ) && (
                      <Link
                        to={ROUTES.ADDEMERGENCY}
                        style={
                          ROUTES.ADDEMERGENCY === this.urlPath
                            ? this.activeStyle
                            : null
                        }
                      >
                            Create Request
                      </Link>
                    )}
                  </li>
                </ul>
              </li>
            )}

            {permissions &&
              permissions.length !== 0 &&
              permissions.includes(PERMISSIONS.ERM_Supervisors.value) && (
              <li>
                <ul className="navigation-sublist">
                    <li>
                    <Link
                      to={ROUTES.ASSIGN_ERM_SUPERVISOR}
                      style={
                        ROUTES.ASSIGN_ERM_SUPERVISOR === this.urlPath
                          ? this.activeStyle
                          : null
                      }
                    >
                        My ERM Data
                    </Link>
                  </li>
                </ul>
                </li>
            )}

            {permissions &&
              permissions.length !== 0 &&
              permissions.includes(PERMISSIONS.DATA_MANAGER.value) && (
              <li>
                <ul className="navigation-sublist">
                  <li>
                    <Link
                      to={ROUTES.ASSIGN_ERM_SUPERVISOR}
                      style={
                        ROUTES.ASSIGN_ERM_SUPERVISOR === this.urlPath
                          ? this.activeStyle
                          : null
                      }
                    >
                        Assign Erm Supervisor
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={ROUTES.ELDERS_PAGE}
                      style={
                        ROUTES.ELDERS_PAGE === this.urlPath
                          ? this.activeStyle
                          : null
                      }
                    >
                        Elder Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={ROUTES.DATA_MANAGER_UNASSIGNED_ELDER_LIST}
                      style={
                        ROUTES.DATA_MANAGER_UNASSIGNED_ELDER_LIST ===
                          this.urlPath
                          ? this.activeStyle
                          : null
                      }
                    >
                        Operate Elder Plan
                    </Link>
                  </li>
                </ul>
                </li>
            )}

            {permissions &&
              permissions.length !== 0 &&
              permissions.includes(PERMISSIONS.ELDER_MODULE.value) && (
              <li>
                <Link
                  to={ROUTES.ELDERS}
                  style={
                    ROUTES.ELDERS === this.urlPath ? this.activeStyle : null
                  }
                >
                  <FontAwesomeIcon icon={faUserFriends} /> Elders
                </Link>
                <ul className="navigation-sublist">
                  <li>
                    <Link
                      to={ROUTES.ADDELDER}
                      style={
                        ROUTES.ADDELDER === this.urlPath
                          ? this.activeStyle
                          : null
                      }
                    >
                        Add an Elder
                    </Link>
                  </li>
                  {/* <li>
                    <Link
                      to={ROUTES.BULKASSIGNTEAMMEMBERS}
                      style={
                        ROUTES.BULKASSIGNTEAMMEMBERS === this.urlPath
                          ? this.activeStyle
                          : null
                      }
                    >
                        Assign Team Members
                    </Link>
                  </li> */}
                  <li>
                    <Link
                      to={ROUTES.ELDERZOHOSYNC}
                      style={
                        ROUTES.ELDERZOHOSYNC === this.urlPath
                          ? this.activeStyle
                          : null
                      }
                    >
                        Elders Zoho Sync
                    </Link>
                  </li>
                  {includes(
                      ['ERM', 'ERM Head', 'ERM Supervisors'],
                      get(this.props, 'user.roles[0]', ''),
                    ) && (
                      <Link
                        to={ROUTES.MY_ELDERS}
                        style={
                          ROUTES.MY_ELDERS === this.urlPath
                          ? this.activeStyle
                            : null
                        }
                      >
                        My Elder
                    </Link>
                  )}

                  <Link
                    to={ROUTES.ELDERS_PAGE}
                    style={
                        ROUTES.ELDERS_PAGE === this.urlPath
                          ? this.activeStyle
                        : null
                      }
                  >
                      Elder Dashboard
                    </Link>
                </ul>
              </li>
            )}

            {permissions &&
              permissions.length !== 0 &&
              permissions.includes(PERMISSIONS.RESPONDER_MODULE.value) && (
              <li>
                <Link
                  to={ROUTES.RESPONDERS}
                  style={
                    ROUTES.RESPONDERS === this.urlPath
                      ? this.activeStyle
                      : null
                  }
                >
                  <FontAwesomeIcon icon={faRunning} /> Responders
                </Link>
                <ul className="navigation-sublist">
                  <li>
                    <Link
                      to={ROUTES.ADDRESPONDER}
                      style={
                        ROUTES.ADDRESPONDER === this.urlPath
                          ? this.activeStyle
                          : null
                      }
                    >
                        Add a Responder
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={ROUTES.RESPONDER_ASSIGN_ROLE}
                      style={
                        ROUTES.RESPONDER_ASSIGN_ROLE === this.urlPath
                          ? this.activeStyle
                          : null
                      }
                    >
                        Assign Role to Responder
                    </Link>
                  </li>
                </ul>
              </li>
            )}

            {permissions &&
              permissions.length !== 0 &&
              permissions.includes(PERMISSIONS.CONCIERGE_MODULE.value) && (
              <li>
                <Link
                  to={ROUTES.CONCIERGE}
                  style={
                    ROUTES.CONCIERGE === this.urlPath
                      ? this.activeStyle
                      : null
                  }
                >
                  <FontAwesomeIcon icon={faHands} />
                    Concierge
                </Link>
                <ul className="navigation-sublist">
                  <li>
                    <Link
                      to={ROUTES.ADDCONCIERGE}
                      style={
                        ROUTES.ADDCONCIERGE === this.urlPath
                          ? this.activeStyle
                          : null
                      }
                    >
                        Create Request
                    </Link>
                  </li>
                </ul>
              </li>
            )}

            <li>
              <Link
                to={ROUTES.ADMINPROFILE}
                style={
                  ROUTES.ADMINPROFILE === this.urlPath ? this.activeStyle : null
                }
              >
                <FontAwesomeIcon icon={faUser} /> Profile
              </Link>
              <ul className="navigation-sublist">
                <li />
              </ul>
            </li>

            {permissions &&
              permissions.length !== 0 &&
              permissions.includes(PERMISSIONS.TEAM_MODULE.value) && (
              <li>
                <Link
                  to={ROUTES.STAFF}
                  style={
                    ROUTES.STAFF === this.urlPath ? this.activeStyle : null
                  }
                >
                  <FontAwesomeIcon icon={faUserTie} /> User Accounts
                </Link>
                <ul className="navigation-sublist">
                  <li>
                    <Link
                      to={ROUTES.ADDSTAFF}
                      style={
                        ROUTES.ADDSTAFF === this.urlPath
                          ? this.activeStyle
                          : null
                      }
                    >
                        Add a User Account
                    </Link>
                  </li>
                </ul>
              </li>
            )}

            {permissions &&
              permissions.length !== 0 &&
              permissions.includes(PERMISSIONS.TEAM_MODULE.value) && (
              <li>
                <Link
                  to={ROUTES.ROLESLIST}
                  style={
                    ROUTES.ROLESLIST === this.urlPath
                      ? this.activeStyle
                      : null
                  }
                >
                  <FontAwesomeIcon icon={faUsersCog} /> Role Management
                </Link>
                <ul className="navigation-sublist">
                  <li>
                    <Link
                      to={ROUTES.ADDROLE}
                      style={
                        ROUTES.ADDROLE === this.urlPath
                          ? this.activeStyle
                          : null
                      }
                    >
                        Add Role
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={ROUTES.ASSIGN_ROLES_TO_ADMIN}
                      style={
                        ROUTES.ASSIGN_ROLES_TO_ADMIN === this.urlPath
                          ? this.activeStyle
                          : null
                      }
                    >
                        Assign Role
                    </Link>
                  </li>
                </ul>
              </li>
            )}

            {permissions &&
              permissions.length !== 0 &&
              permissions.includes(PERMISSIONS.PLAN_MODULE.value) && (
              <li>
                <Link
                  to={ROUTES.PLANS}
                  style={
                    ROUTES.PLANS === this.urlPath ? this.activeStyle : null
                  }
                >
                  <FontAwesomeIcon icon={faTasks} /> Plans Management
                </Link>
                <ul className="navigation-sublist">
                  <li>
                    <Link
                      to={ROUTES.PLANCATEGORIES}
                      style={
                        ROUTES.PLANCATEGORIES === this.urlPath
                          ? this.activeStyle
                          : null
                      }
                    >
                        Add a Category
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={ROUTES.ADDPLAN}
                      style={
                        ROUTES.ADDPLAN === this.urlPath
                          ? this.activeStyle
                          : null
                      }
                    >
                        Add a Plan
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={ROUTES.ADDUSERPLAN}
                      style={
                        ROUTES.ADDUSERPLAN === this.urlPath
                          ? this.activeStyle
                          : null
                      }
                    >
                        Add Users Plan
                    </Link>
                  </li>
                </ul>
              </li>
            )}

            {permissions &&
              permissions.length !== 0 &&
              permissions.includes(PERMISSIONS.ORDER_MODULE.value) && (
              <li>
                <Link
                  to={ROUTES.ORDERS}
                  style={
                    ROUTES.ORDERS === this.urlPath ? this.activeStyle : null
                  }
                >
                  <FontAwesomeIcon icon={faFileInvoice} /> Orders
                </Link>
                <ul className="navigation-sublist">
                  <li />
                </ul>
              </li>
            )}

            {permissions &&
              permissions.length !== 0 &&
              permissions.includes(PERMISSIONS.CHAT_MODULE.value) && (
              <li>
                <Link
                  to={ROUTES.SUPPORT}
                  style={
                    ROUTES.SUPPORT === this.urlPath ? this.activeStyle : null
                  }
                >
                  <FontAwesomeIcon icon={faComments} /> Chat Support
                </Link>
                <ul className="navigation-sublist">
                  <li />
                </ul>
              </li>
            )}

            {permissions &&
              permissions.length !== 0 &&
              permissions.includes(PERMISSIONS.VIDEO_MODULE.value) && (
              <li>
                <Link
                  to={ROUTES.VIDEOSUPPORTPAGE}
                  style={
                    ROUTES.VIDEOSUPPORTPAGE === this.urlPath
                      ? this.activeStyle
                      : null
                  }
                >
                  <FontAwesomeIcon icon={faVideo} /> Video Support
                </Link>
                <ul className="navigation-sublist">
                  <li />
                </ul>
              </li>
            )}

            {permissions &&
              permissions.length !== 0 &&
              permissions.includes(PERMISSIONS.COMMUNITY_MODULE.value) && (
              <li>
                <Link
                  to={ROUTES.COMMUNITY}
                  style={
                    ROUTES.COMMUNITY === this.urlPath
                      ? this.activeStyle
                      : null
                  }
                >
                  <FontAwesomeIcon icon={faUsers} /> Community
                </Link>
                <ul className="navigation-sublist">
                  <li>
                    <Link
                      to={ROUTES.COMMUNITYTHEMES}
                      style={
                        ROUTES.COMMUNITYTHEMES === this.urlPath
                          ? this.activeStyle
                          : null
                      }
                    >
                        Community Themes
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={ROUTES.ADDBLOG}
                      style={
                        ROUTES.ADDBLOG === this.urlPath
                          ? this.activeStyle
                          : null
                      }
                    >
                        Create Blog
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={ROUTES.ADDEVENT}
                      style={
                        ROUTES.ADDEVENT === this.urlPath
                          ? this.activeStyle
                          : null
                      }
                    >
                        Create Event
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={ROUTES.ADDOFFER}
                      style={
                        ROUTES.ADDOFFER === this.urlPath
                          ? this.activeStyle
                          : null
                      }
                    >
                        Create Offer
                    </Link>
                  </li>
                </ul>
              </li>
            )}

            {permissions &&
              permissions.length !== 0 &&
              permissions.includes(PERMISSIONS.REPORT_MODULE.value) && (
              <li>
                <Link
                  to={ROUTES.REPORTS}
                  style={
                    ROUTES.REPORTS === this.urlPath ? this.activeStyle : null
                  }
                >
                  <FontAwesomeIcon icon={faChartLine} /> Reports
                </Link>
                <ul className="navigation-sublist">
                  <li>
                    <Link
                      to={ROUTES.RESPONDERREPORTS}
                      style={
                        ROUTES.RESPONDERREPORTS === this.urlPath
                          ? this.activeStyle
                          : null
                      }
                    >
                        Responder Report
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={`${ROUTES.REPORTGENERATION}/notes`}
                      style={
                        `${ROUTES.REPORTGENERATION}/notes` === this.urlPath
                          ? this.activeStyle
                          : null
                      }
                    >
                        Notes Report
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={`${ROUTES.REPORTGENERATION}/orders`}
                      style={
                        `${ROUTES.REPORTGENERATION}/orders` === this.urlPath
                          ? this.activeStyle
                          : null
                      }
                    >
                        Orders Report
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={`${ROUTES.REPORTGENERATION}/admins`}
                      style={
                        `${ROUTES.REPORTGENERATION}/admins` === this.urlPath
                          ? this.activeStyle
                          : null
                      }
                    >
                        Admins Report
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={`${ROUTES.REPORTGENERATION}/concierge-services`}
                      style={
                        `${ROUTES.REPORTGENERATION}/concierge-services` ===
                          this.urlPath
                          ? this.activeStyle
                          : null
                      }
                    >
                        Concierge Services
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={`${ROUTES.REPORTGENERATION}/community`}
                      style={
                        `${ROUTES.REPORTGENERATION}/community` ===
                          this.urlPath
                          ? this.activeStyle
                          : null
                      }
                    >
                        Community Report
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={`${ROUTES.REPORTGENERATION}/elders`}
                      style={
                        `${ROUTES.REPORTGENERATION}/elders` === this.urlPath
                          ? this.activeStyle
                          : null
                      }
                    >
                        Elder's Report
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={`${ROUTES.PLAN_REPORTS}`}
                      style={
                        `${ROUTES.PLAN_REPORTS}` === this.urlPath
                          ? this.activeStyle
                          : null
                      }
                    >
                        Plan Report
                    </Link>
                  </li>
                </ul>
              </li>
            )}

            {permissions &&
              permissions.length !== 0 &&
              permissions.includes(PERMISSIONS.NOTIFICATIONS_MODULE.value) && (
              <li>
                <Link
                  to={ROUTES.NOTIFICATIONS}
                  style={
                    ROUTES.NOTIFICATIONS === this.urlPath
                      ? this.activeStyle
                      : null
                  }
                >
                  <FontAwesomeIcon icon={faBell} /> Notifications
                </Link>
                <ul className="navigation-sublist">
                  <li />
                </ul>
              </li>
            )}
          </ul>
        </div>
      </aside>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user.user,
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SideNavigation);
