import React from 'react';
import get from 'lodash/get';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { ROUTES, PERMISSIONS } from '../common/constants';
import { updateAdminPermissions } from '../actions/AuthActions';
import AdminService from '../service/AdminService';
import PageLoader from '../components/PageLoader';

export default ChildComponent => {
  class requireAuth extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        shouldRender: false,
      };

      this.adminService = new AdminService();
    }

    componentDidMount() {
      this.adminService
        .getSelfPermissions()
        .then(responseData => {
          if (responseData.data) {
            this.props.updateAdminPermissions(responseData.data);
            this.checkPermissions();
          }
        })
        .catch(errorData => {
          console.log(errorData);
        });
    }

    toggleShouldRender = () => {
      this.setState({ shouldRender: true });
    };

    checkPermissions = () => {
      const permissions = get(this.props, 'user.user.permissions', null);
      if (!permissions || !permissions.length) {
        this.props.history.push(ROUTES.UNAUTHORIZEDPAGE);
      } else {
        switch (this.props.match.path) {
          case ROUTES.ADDELDER:
          case ROUTES.ELDERS:
          case ROUTES.ELDERS_DASHBOARD:
          case ROUTES.VIEWELDER:
          case ROUTES.ELDERDETAILS:
          case ROUTES.BULKASSIGNTEAMMEMBERS:
          case ROUTES.MERGEELDERS:
          case ROUTES.REPORTGENERATIONWITHTYPE:
          case ROUTES.ELDERZOHOSYNC:
            if (!permissions.includes(PERMISSIONS.ELDER_MODULE.value)) {
              this.props.history.push(ROUTES.UNAUTHORIZEDPAGE);
            } else {
              this.toggleShouldRender();
            }
            break;

          case ROUTES.ADDRESPONDER:
          case ROUTES.RESPONDERS:
          case ROUTES.VIEWRESPONDER:
            if (!permissions.includes(PERMISSIONS.RESPONDER_MODULE.value)) {
              this.props.history.push(ROUTES.UNAUTHORIZEDPAGE);
            } else {
              this.toggleShouldRender();
            }
            break;

          case ROUTES.CONCIERGE:
          case ROUTES.VIEWCONCIERGE:
          case ROUTES.ADDCONCIERGE:
          case ROUTES.ADDCONCIERGETRIGGER:
            if (!permissions.includes(PERMISSIONS.CONCIERGE_MODULE.value)) {
              this.props.history.push(ROUTES.UNAUTHORIZEDPAGE);
            } else {
              this.toggleShouldRender();
            }
            break;

          case ROUTES.STAFF:
          case ROUTES.ADDSTAFF:
          case ROUTES.ADDROLE:
          case ROUTES.ASSIGN_ROLES_TO_ADMIN:
          case ROUTES.RESPONDER_ASSIGN_ROLE:
          case ROUTES.ROLESLIST:
          case ROUTES.VIEWROLE:
          case ROUTES.VIEWSTAFF:
            if (!permissions.includes(PERMISSIONS.TEAM_MODULE.value)) {
              this.props.history.push(ROUTES.UNAUTHORIZEDPAGE);
            } else {
              this.toggleShouldRender();
            }
            break;

          case ROUTES.PLANCATEGORIES:
          case ROUTES.ADDPLAN:
          case ROUTES.ADDUSERPLAN:
          case ROUTES.VIEWPLAN:
            if (!permissions.includes(PERMISSIONS.PLAN_MODULE.value)) {
              this.props.history.push(ROUTES.UNAUTHORIZEDPAGE);
            } else {
              this.toggleShouldRender();
            }
            break;

          case ROUTES.ORDERS:
          case ROUTES.VIEWORDER:
            if (!permissions.includes(PERMISSIONS.ORDER_MODULE.value)) {
              this.props.history.push(ROUTES.UNAUTHORIZEDPAGE);
            } else {
              this.toggleShouldRender();
            }
            break;

          case ROUTES.SUPPORT:
            if (!permissions.includes(PERMISSIONS.CHAT_MODULE.value)) {
              this.props.history.push(ROUTES.UNAUTHORIZEDPAGE);
            } else {
              this.toggleShouldRender();
            }
            break;

          case ROUTES.VIDEOSUPPORTPAGE:
            if (!permissions.includes(PERMISSIONS.VIDEO_MODULE.value)) {
              this.props.history.push(ROUTES.UNAUTHORIZEDPAGE);
            } else {
              this.toggleShouldRender();
            }
            break;

          case ROUTES.COMMUNITY:
          case ROUTES.COMMUNITYTHEMES:
          case ROUTES.VIEWCOMMUNITY:
          case ROUTES.EDITBLOG:
          case ROUTES.EDITEVENT:
          case ROUTES.EDITOFFER:
          case ROUTES.EDITCOMMUNITYTHEMES:
          case ROUTES.ADDBLOG:
          case ROUTES.ADDOFFER:
          case ROUTES.ADDEVENT:
            if (!permissions.includes(PERMISSIONS.COMMUNITY_MODULE.value)) {
              this.props.history.push(ROUTES.UNAUTHORIZEDPAGE);
            } else {
              this.toggleShouldRender();
            }
            break;

          case ROUTES.REPORTS:
          case ROUTES.RESPONDERREPORTS:
            if (!permissions.includes(PERMISSIONS.REPORT_MODULE.value)) {
              this.props.history.push(ROUTES.UNAUTHORIZEDPAGE);
            } else {
              this.toggleShouldRender();
            }
            break;

          case ROUTES.NOTIFICATIONS:
            if (!permissions.includes(PERMISSIONS.NOTIFICATIONS_MODULE.value)) {
              this.props.history.push(ROUTES.UNAUTHORIZEDPAGE);
            } else {
              this.toggleShouldRender();
            }
            break;

          case ROUTES.EMERGENCIES:
          case ROUTES.VIEWEMERGENCY:
            if (!permissions.includes(PERMISSIONS.EMERGENCY_VIEW.value)) {
              this.props.history.push(ROUTES.UNAUTHORIZEDPAGE);
            } else {
              this.toggleShouldRender();
            }
            break;

          case ROUTES.ADDEMERGENCY:
            if (!permissions.includes(PERMISSIONS.EMERGENCY_CREATE.value)) {
              this.props.history.push(ROUTES.UNAUTHORIZEDPAGE);
            } else {
              this.toggleShouldRender();
            }
            break;

          case ROUTES.SHC:
            this.toggleShouldRender();
            break;

          case ROUTES.DASHBOARD:
            this.toggleShouldRender();
            break;

          case ROUTES.BIRTHDAY:
            this.toggleShouldRender();
            break;

          default:
            this.props.history.push(ROUTES.UNAUTHORIZEDPAGE);
            break;
        }
      }
    };

    render() {
      let is_logged_in = this.props.user.is_logged_in;
      if (!is_logged_in) {
        return <Redirect to='/log-in' />;
      }

      if (this.state.shouldRender) {
        return (
          <React.Fragment>
            <ChildComponent {...this.props} />
          </React.Fragment>
        );
      }
      return <PageLoader />;
    }
  }

  const mapStateToProps = state => ({
    user: state.user,
  });

  return connect(
    mapStateToProps,
    { updateAdminPermissions },
  )(requireAuth);
};
