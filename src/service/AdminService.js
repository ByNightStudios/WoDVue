import * as APIs from '../common/backendConstants';
import { axiosInstance } from '../store/store';

export default class AdminService {
  getSelfPermissions() {
    return axiosInstance.get(APIs.GET_SELF_PERMISSIONS);
  }

  getRolesList(payload) {
    let url = APIs.ROLES_API;
    let page = 0;
    if (payload.page) {
      page = payload.page;

      url = `${url}?page=${page === 'all' ? 'all' : page - 1}`;
    }
    return axiosInstance.get(url);
  }

  getRoleByID(payload) {
    let url = APIs.ROLE_BY_ID_API.replace(':role_id', payload.roleID);
    return axiosInstance.get(url);
  }

  editRole(payload) {
    let url = APIs.ROLES_API;
    return axiosInstance.put(url, payload);
  }

  addRole(payload) {
    let url = APIs.ROLES_API;
    return axiosInstance.post(url, payload);
  }

  getAdminByID(payload) {
    let url = APIs.VIEW_ADMIN_BY_ID.replace(':admin_id', payload.adminID);
    return axiosInstance.get(url);
  }

  assignRole(payload) {
    let url = APIs.ASSIGN_ROLE;
    return axiosInstance.post(url, payload);
  }

  removeAssignedRole(payload) {
    let url = APIs.ASSIGN_ROLE;
    return axiosInstance.put(url, payload);
  }

  getAdminsList(payload) {
    let url = APIs.ADMINS_LIST;
    let page = 1;
    if (payload.page) {
      page = payload.page;
    }
    url = `${url}?page=${page - 1}`;
    if (payload.query) {
      url = `${url}&query=${encodeURIComponent(payload.query)}`;
    }
    return axiosInstance.get(url);
  }

  updateAdminProfile(payload) {
    let url = APIs.UPDATE_ADMIN_PROFILE;

    return axiosInstance.put(url, payload);
  }

  getUnassignedTeamMembers(payload) {
    return axiosInstance.post(APIs.GET_UNASSIGNED_TEAM_MEMBERS, payload);
  }

  getAdminsByRole(payload) {
    return axiosInstance.post(APIs.GET_ADMINS_BY_ROLE, payload);
  }

  mergeElders(payload) {
    return axiosInstance.post(APIs.MERGEELDERS, payload);
  }

  getElderDetailsUsingMobileNumber(mobile_number) {
    let url = APIs.GETELDERDETAILSUSINGMOBILENUMBER.replace(
      ':number',
      mobile_number
    );
    return axiosInstance.get(url);
  }

  getAdminsRoles(payload) {
    let url = APIs.ADMIN_ROLES;
    return axiosInstance.get(url);
  }

  getStaffAdminList(){
    let url = APIs.STAFFLISTURL;
    return axiosInstance.get(url);
  }

  getResponderList(){
    let url = APIs.RESPONDER_LIST_URL;
    return axiosInstance.get(url);
  }

  adminsAssignRoles(payload) {
    return axiosInstance.post(APIs.ADMIN_ASSIGN_ROLES, payload);
  }

  adminsListRoles(payload) {
    return axiosInstance.post(APIs.ADMIN_LIST_ROLES, payload);
  }

  adminResponderAssignRoles(payload){
    return axiosInstance.post(APIs.ADMIN_RESPONDER_ASSIGN_ROLES, payload);
  }

  getUserByType(payload) {
    let url = `admin/users?user_type=${payload.userType}&query=${payload.query}`;
    return axiosInstance.get(url);
  }

  adminAssignErmSupervisorRoles(payload){
    return axiosInstance.post(APIs.ASSIGN_ERM_SUPERVISOR, payload);
  }
}
