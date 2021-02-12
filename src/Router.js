import React from 'react';

import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import { includes, get } from 'lodash';

import { connect } from 'react-redux';
import { ROUTES } from './common/constants';
import { messaging } from './common/firebaseInit';
import { firebaseDataInit } from './common/firebaseGateway';

import AddPage from './containers/AddPage';

import DashboardPage from './containers/DashboardPage';
import EmergenciesPage from './containers/EmergenciesPage';
import RespondersPage from './containers/RespondersPage';
import EldersPage from './containers/EldersPage';
import StaffUsersPage from './containers/StaffUsersPage';
import AddEldersPage from './containers/AddEldersPage';
import AddEmergencyPage from './containers/AddEmergencyPage';
import AddStaffPage from './containers/AddStaffPage';
import AddResponderPage from './containers/AddResponderPage';
import SupportPage from './containers/SupportPage';
import ConciergePage from './containers/ConciergePage';
import AddConciergePage from './containers/AddConciergePage';
import UserMedicalRecordPage from './containers/UserMedicalRecordPage';
import CommunityPage from './containers/CommunityPage';
import AddEventPage from './containers/AddEventPage';
import AddOfferPage from './containers/AddOfferPage';
import AddBlogPage from './containers/AddBlogPage';
import ViewEmergencyPage from './containers/ViewEmergencyPage';
import EditBlogPage from './containers/EditBlogPage';
import EditOfferPage from './containers/EditOfferPage';
import EditEventPage from './containers/EditEventPage';
import ViewCommunityPage from './containers/ViewCommunityPage';
import ViewElderPage from './containers/ViewElderPage';
import AddPlanPage from './containers/AddPlanPage';
import AddUserPlanPage from './containers/AddUserPlanPage';
import EditPlanPage from './containers/EditPlanPage';
import ReportsPage from './containers/ReportsPage';
import OrdersPage from './containers/OrdersPage';
import PlanCategoriesPage from './containers/PlanCategoriesPage';
import PlansListingPage from './containers/PlansListingPage';
import ViewOrderPage from './containers/ViewOrderPage';
import NotificationsPage from './containers/NotificationsPage';
import CommunityThemePage from './containers/CommunityThemeListingPage';
import AddCommunityThemePage from './containers/AddCommunityThemePage';
import EditCommunityThemePage from './containers/EditCommunityThemePage';
import ResponderReportsPage from './containers/ResponderReportsPage';
import ViewConciergePage from './containers/ViewConciergePage';
import ViewResponderPage from './containers/ViewResponderPage';
import VideoSupportPage from './containers/VideoSupportPage';
import UnauthorizedPage from './containers/UnauthorizedPage';
import RolesPage from './containers/RolesPage';
import ViewRolePage from './containers/ViewRolePage';
import AddRolePage from './containers/AddRolePage';
import AssignRolePage from './containers/AssignRolePage';
import ViewAdminPage from './containers/ViewAdminPage';
import AdminProfilePage from './containers/AdminProfilePage';
import ViewElderDetailsPage from './containers/ViewElderDetailsPage';
import AssignTeamMemberPage from './containers/AssignTeamMemberPage';
import MergeElders from './containers/MergeElders';
import ReportGeneration from './containers/ReportGeneration';
import ElderZohoSyncPage from './containers/ElderZohoSyncPage';
import AssignResponderPage from './containers/AssignResponderPage';
import SHC from './containers/SHC';
import BirthDayPage from './containers/BirthDayPage';
import AssignERMSupervisor from './containers/AssignERMSupervisor';

import Elders from './containers/Elders';
import ElderDashboard from './containers/ElderDashboard';
import MyElders from './containers/MyElders';
import DataManagerUnAssignedElder from './containers/DataManagerUnAssignedElder';
import DataManagerUnAssignedElderPlanPage from './containers/DataManagerUnAssignedElderPlanPage';

import AntFromLoginPage from './containers/AntFromLoginPage';
import PlanReports from './containers/PlanReport';

class AppRouter extends React.Component {
  firebasePermission = () => {
    messaging
      .requestPermission()
      .then(async () => {
        messaging
          .getToken()
          .then(token => firebaseDataInit(token, this.props.user))
          .catch(error => {
            if (error.code === 'messaging/token-unsubscribe-failed')
              return alert(
                'Please refresh your page for changes to take place.',
              );
          });
      })
      .catch(function(err) {});

    navigator.serviceWorker.addEventListener('message', message => {});
  };

  async componentDidMount() {
    // this.firebasePermission();
  }

  render() {
    const { user } = this.props;
    return (
      <Router>
        <Switch>
          {/* Hit the Home URL and Re-direct to Login Entry Point */}
          <Route
            exact
            path={ROUTES.HOME}
            render={() => <Redirect to={ROUTES.LOGIN} />}
          />
          {/* Login Entry Point */}
          <Route exact path={ROUTES.LOGIN} component={AntFromLoginPage} />

          {/* Add Entry Point */}
          <Route exact path={ROUTES.AddURL} component={AddPage} />

          {/* Dashboard Entry Point */}
          <Route exact path={ROUTES.DASHBOARD} component={DashboardPage} />
          {/* Emergencies Listing Entry Point */}
          <Route exact path={ROUTES.EMERGENCIES} component={EmergenciesPage} />
          {/* Concierge Listing Entry Point */}
          <Route exact path={ROUTES.CONCIERGE} component={ConciergePage} />
          {/* Responders Listing Entry Point */}
          <Route exact path={ROUTES.RESPONDERS} component={RespondersPage} />

          <Route
            exact
            path={ROUTES.DATA_MANAGER_UNASSIGNED_ELDER_LIST}
            render={props => (
              <DataManagerUnAssignedElder {...props} user={user} />
            )}
          />

          <Route
            exact
            path={ROUTES.DATA_MANAGER_UNASSIGNED_ELDER_LIST_PLAN_PAGE}
            render={props => (
              <DataManagerUnAssignedElderPlanPage {...props} user={user} />
            )}
          />

          {/* Providers Listing Entry Point */}
          {/* <Route exact path={ROUTES.PROVIDERS} component={ProvidersPage} /> */}
          {/* Elders Listing Entry Point */}
          <Route exact path={ROUTES.ELDERS} component={EldersPage} />
          <Route
            exact
            path={ROUTES.ELDERS_PAGE}
            render={props => (
              <Elders
                {...props}
                isEdit={includes(user.roles, 'Data Manager')}
              />
            )}
          />

          <Route exact path={ROUTES.MY_ELDERS} component={MyElders} />

          <Route
            exact
            path={`${ROUTES.ELDERS_DASHBOARD}/:id`}
            render={props => (
              <ElderDashboard
                {...props}
                isEdit={includes(user.roles, 'Data Manager')}
              />
            )}
          />

          {/* Staff Listing Entry Point */}
          <Route exact path={ROUTES.STAFF} component={StaffUsersPage} />
          {/* Add Elders Entry Point */}
          <Route exact path={ROUTES.ADDELDER} component={AddEldersPage} push />
          {/* Add Emergency Entry Point */}
          <Route
            exact
            path={ROUTES.ADDEMERGENCY}
            component={AddEmergencyPage}
          />
          {/* Add Concierge Entry Point */}
          <Route
            exact
            path={ROUTES.ADDCONCIERGE}
            component={AddConciergePage}
          />
          <Route
            exact
            path={ROUTES.ADDCONCIERGETRIGGER}
            component={AddConciergePage}
          />
          {/* Add Staff Entry Point */}
          <Route exact path={ROUTES.ADDSTAFF} component={AddStaffPage} />
          {/* Add Responder Entry Point */}
          <Route
            exact
            path={ROUTES.ADDRESPONDER}
            component={AddResponderPage}
          />
          {/* Add Provider Entry Point */}
          {/* <Route exact path={ROUTES.ADDPROVIDERS} component={AddProviderPage} /> */}

          {/* Add Support Entry Point */}
          <Route exact path={ROUTES.SUPPORT} component={SupportPage} />

          {/* Add User Medical Records Entry Point */}
          <Route
            exact
            path={ROUTES.USER_MEDICAL_RECORD}
            component={UserMedicalRecordPage}
          />

          {/* Add View Emergency Entry Point */}
          <Route
            exact
            path={ROUTES.VIEWEMERGENCY}
            component={ViewEmergencyPage}
          />

          {/* Add View Emergency Entry Point */}
          <Route
            exact
            path={ROUTES.VIEWCONCIERGE}
            component={ViewConciergePage}
          />

          {/* Add View Community Entry Point */}
          <Route
            exact
            path={ROUTES.VIEWCOMMUNITY}
            component={ViewCommunityPage}
          />
          {/* Add View Eldrer Entry Point */}
          <Route exact path={ROUTES.VIEWELDER} component={ViewElderPage} />

          {/* Community paths START */}
          <Route exact path={ROUTES.COMMUNITY} component={CommunityPage} />
          <Route
            exact
            path={ROUTES.COMMUNITYTHEMES}
            component={CommunityThemePage}
          />
          <Route
            exact
            path={ROUTES.ADDCOMMUNITYTHEMES}
            component={AddCommunityThemePage}
          />
          <Route
            exact
            path={ROUTES.EDITCOMMUNITYTHEMES}
            component={EditCommunityThemePage}
          />
          <Route exact path={ROUTES.ADDBLOG} component={AddBlogPage} />
          <Route exact path={ROUTES.ADDEVENT} component={AddEventPage} />
          <Route exact path={ROUTES.ADDOFFER} component={AddOfferPage} />
          <Route exact path={ROUTES.EDITBLOG} component={EditBlogPage} />
          <Route exact path={ROUTES.EDITEVENT} component={EditEventPage} />
          <Route exact path={ROUTES.EDITOFFER} component={EditOfferPage} />
          {/* Community paths END */}

          {/* Plan Management path START */}
          <Route exact path={ROUTES.ADDPLAN} component={AddPlanPage} />
          <Route exact path={ROUTES.ADDUSERPLAN} component={AddUserPlanPage} />
          <Route exact path={ROUTES.VIEWPLAN} component={EditPlanPage} />
          <Route exact path={ROUTES.PLANS} component={PlansListingPage} />
          <Route
            exact
            path={ROUTES.PLANCATEGORIES}
            component={PlanCategoriesPage}
          />
          {/* Plan Management path END */}

          {/* Reporting Entry Point */}
          <Route exact path={ROUTES.REPORTS} component={ReportsPage} />
          <Route
            exact
            path={ROUTES.RESPONDERREPORTS}
            component={ResponderReportsPage}
          />
          <Route
            exact
            path={ROUTES.RESPONDER_ASSIGN_ROLE}
            component={AssignResponderPage}
          />
          <Route
            exact
            path={ROUTES.REPORTGENERATIONWITHTYPE}
            component={ReportGeneration}
          />
          {/* Reporting End Point */}

          {/* Orders Entry Point */}
          <Route exact path={ROUTES.ORDERS} component={OrdersPage} />
          <Route exact path={ROUTES.VIEWORDER} component={ViewOrderPage} />
          {/* Orders End Point */}
          {/* Notifications Routes Start */}

          <Route
            exact
            path={ROUTES.NOTIFICATIONS}
            component={NotificationsPage}
          />

          {/* Add View Responder Entry Point */}
          <Route
            exact
            path={ROUTES.VIEWRESPONDER}
            component={ViewResponderPage}
          />

          {/* Notifications Routes End */}
          {/* Video Support Routes Start */}

          <Route
            exact
            path={ROUTES.VIDEOSUPPORTPAGE}
            component={VideoSupportPage}
          />

          {/* Video Support Routes End */}

          <Route
            exact
            path={ROUTES.UNAUTHORIZEDPAGE}
            component={UnauthorizedPage}
          />

          <Route exact path={ROUTES.ROLESLIST} component={RolesPage} />
          <Route exact path={ROUTES.VIEWROLE} component={ViewRolePage} />
          <Route exact path={ROUTES.ADDROLE} component={AddRolePage} />
          <Route
            exact
            path={ROUTES.ASSIGN_ROLES_TO_ADMIN}
            component={AssignRolePage}
          />
          <Route exact path={ROUTES.VIEWSTAFF} component={ViewAdminPage} />
          <Route
            exact
            path={ROUTES.ADMINPROFILE}
            component={AdminProfilePage}
          />

          {/* Temporary Paths for Integration Purposes */}

          <Route
            exact
            path={ROUTES.ELDERDETAILS}
            component={ViewElderDetailsPage}
          />

          <Route
            exact
            path={ROUTES.BULKASSIGNTEAMMEMBERS}
            component={AssignTeamMemberPage}
          />

          <Route exact path={ROUTES.MERGEELDERS} component={MergeElders} />
          <Route
            exact
            path={ROUTES.ELDERZOHOSYNC}
            component={ElderZohoSyncPage}
          />
          <Route exact path={ROUTES.SHC} component={SHC} />
          <Route exact path={ROUTES.BIRTHDAY} component={BirthDayPage} />
          <Route
            exact
            path={ROUTES.ASSIGN_ERM_SUPERVISOR}
            render={props => (
              <AssignERMSupervisor
                {...props}
                isEdit={includes(user.roles, 'Data Manager')}
              />
            )}
          />
          <Route
            exact
            path={ROUTES.PLAN_REPORTS}
            render={props => <PlanReports {...props} user={user} />}
          />
        </Switch>
      </Router>
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
)(AppRouter);
