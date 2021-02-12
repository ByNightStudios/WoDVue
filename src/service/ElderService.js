import * as APIs from '../common/backendConstants';
import { axiosInstance } from '../store/store';

// export const ELDER_ADD_FRIENDS = "admin/add-friends";
// export const ELDER_GET_FRIENDS

export default class ElderService {
  getElderData = payload =>
    axiosInstance.get(APIs.GET_ELDER.replace(':id', payload.id));

  getInsuranceDetails = payload =>
    axiosInstance.get(`${APIs.GET_INSURANCE_DETAILS}${payload.id}`);

  addInsuranceDetails = payload =>
    axiosInstance.post(APIs.ADD_INSURANCE, payload);

  getElderFriendData = id =>
    axiosInstance.get(`${APIs.ELDER_GET_FRIENDS}${id}`);

  addElderFriendData = payload =>
    axiosInstance.post(APIs.ELDER_ADD_FRIENDS, payload);

  updateElderFriendData = (id, payload) =>
    axiosInstance.put(`${APIs.ELDER_UPDATE_FRIENDS}${id}`, payload);

  getElderSensorData = id =>
    axiosInstance.get(`${APIs.ELDER_GET_SENSORS}${id}`);

  addElderSensorData = payload =>
    axiosInstance.post(APIs.ELDER_ADD_SENSORS, payload);

  updateElderSensorData = (id, payload) =>
    axiosInstance.put(`${APIs.ELDER_UPDATE_SENSORS}${id}`, payload);

  getElderNotes = dataPayload => {
    const { page, search } = dataPayload;

    let url = `${APIs.GET_ELDER_NOTES.replace(
      `:elderIdentifier`,
      dataPayload.elderIdentifier,
    )}?page=${page}`;

    if (search) {
      url = `${url}&search=${search}`;
    }

    return axiosInstance.get(url);
  };

  addElderNote = payload => axiosInstance.post(APIs.ADD_ELDER_NOTE, payload);

  addNokFamilyMember = (id, payload) =>
    axiosInstance.put(`${APIs.ADD_NOK_FAMILY_MEMBERS}${id}`, payload);

  editElderNote = payload => axiosInstance.put(APIs.EDIT_ELDER_NOTE, payload);

  deleteElderNote = dataPayload =>
    axiosInstance.delete(
      APIs.DELETE_ELDER_NOTE.replace(
        ':noteIdentifier',
        dataPayload.noteIdentifier,
      ),
    );

  editElderProfile = payload => {
    const url = APIs.UPDATE_ELDER.replace(':id', payload.user_id);
    return axiosInstance.put(url, payload);
  };

  deleteElderAddress = payload => {
    let url = APIs.UPDATE_DELETE_ELDER_ADDRESS.replace(
      ':elder_id',
      payload.user_id,
    );
    url = url.replace(':address_id', payload.address_id);
    return axiosInstance.delete(url);
  };

  addElderAddress = payload => {
    const url = APIs.ADD_ELDER_ADDRESS.replace(':elder_id', payload.user_id);
    return axiosInstance.post(url, payload);
  };

  editElderAddress = payload => {
    let url = APIs.UPDATE_DELETE_ELDER_ADDRESS.replace(
      ':elder_id',
      payload.user_id,
    );
    url = url.replace(':address_id', payload.address_id);
    return axiosInstance.put(url, payload);
  };

  getElderFamilyMembersService = param =>
    axiosInstance.get(APIs.GET_ELDER_FAMILY_MEMBERS_URL.replace(':id', param));

  addFamilyMemberService = dataPayload =>
    axiosInstance.post(APIs.ADD_FAMILY_MEMBER_URL, dataPayload);

  getFamilyMemberService = param =>
    axiosInstance.get(APIs.GET_FAMILY_MEMBER_URL.replace(':id', param));

  updateFamilyMemberService = (contactIdentifier, dataPayload) => {
    const url = APIs.UPDATE_FAMILY_MEMBER_URL.replace(
      '{id}',
      contactIdentifier,
    );
    return axiosInstance.put(url, dataPayload);
  };

  removeFamilyMemberService = contactIdentifier =>
    axiosInstance.delete(
      APIs.DELETE_FAMILY_MEMBER_URL.replace('{id}', contactIdentifier),
    );

  addEmergencyContactService = dataPayload =>
    axiosInstance.post(APIs.ADD_EMERGENCY_CONTACT_URL, dataPayload);

  updateEmergencyContactService = (contactIdentifier, dataPayload) => {
    const url = APIs.UPDATE_EMERGENCY_CONTACT_URL.replace(
      '{id}',
      contactIdentifier,
    );
    return axiosInstance.put(url, dataPayload);
  };

  removeEmergencyContactService = contactIdentifier => {
    const apiUrl = APIs.DELETE_EMERGENCY_CONTACT_URL.replace(
      '{id}',
      contactIdentifier,
    );
    return axiosInstance.delete(apiUrl);
  };

  getEmergencyContactService = id =>
    axiosInstance.get(APIs.GET_EMERGENCY_CONTACT_URL.replace(':id', id));

  getInactivePlanUsers = search => {
    let url = APIs.GET_INACTIVE_PLAN_USERS;
    if (search) {
      url = `${url}?search=${search}`;
    }
    return axiosInstance.get(url);
  };

  getEldersList = (page = 1, query = '', filter = '', filterStatus = '') => {
    let url = `${APIs.GET_ELDERS_LIST}?page=${page}`;
    if (query) {
      url = `${url}&query=${query}`;
    }
    if (filterStatus && filter) {
      url = `${url}&filter=${filter}&filterStatus=${filterStatus}`;
    }
    return axiosInstance.get(url);
  };

  getEldersListOnDashboard = id => {
    const url = `${APIs.GET_ELDERS_LIST_ON_DASHBOARD}/${id}`;

    console.log(url);

    return axiosInstance.get(url);
  };

  updateElderFormData = payload =>
    axiosInstance.put(APIs.UPDATE_ELDER_FORMS, payload);

  deleteERMManager = id => {
    const url = `${APIs.DELETE_ERM_MANAGER}${id}`;

    return axiosInstance.delete(url);
  };

  updateElderFormData = payload =>
    axiosInstance.put(APIs.UPDATE_ELDER_FORMS, payload);

  getElderFormData = (id, form = 'all') => {
    let url = APIs.GET_ELDER_FORM_DATA.replace('{elder_id}', id);
    url = `${url}?form=${form}`;
    return axiosInstance.get(url);
  };

  getElderEmergencies = payload => {
    let url = APIs.ELDER_EMERGENCY_REQUESTS.replace(
      ':elderIdentifier',
      payload.currentElderIdentifier,
    );
    let page = 0;
    if (payload.page) {
      page = payload.page;
    }

    url = `${url}?page=${page}&back_dated=${payload.back_dated}`;

    if (payload.search) {
      url = `${url}&search=${payload.search}`;
    }

    if (payload.status) {
      url = `${url}&status=${payload.status}`;
    }

    return axiosInstance.get(url);
  };

  getElderConciergeRequests = payload => {
    let url = APIs.ELDER_CONCIERGE_REQUESTS.replace(
      ':elderIdentifier',
      payload.currentElderIdentifier,
    );
    let page = 0;
    if (payload.page) {
      page = payload.page;
    }

    url = `${url}?page=${page}&back_dated=${payload.back_dated}`;

    if (payload.search) {
      url = `${url}&search=${payload.search}`;
    }

    if (payload.status) {
      url = `${url}&status=${payload.status}`;
    }

    return axiosInstance.get(url);
  };

  getElderPlans = payload => {
    const url = APIs.GET_ELDER_PLANS.replace(
      ':elderIdentifier',
      payload.currentElderIdentifier,
    );

    return axiosInstance.get(url);
  };

  addElderPlan = payload => axiosInstance.post(APIs.ADD_ELDER_PLANS, payload);

  getAssignedTeamMembers = payload =>
    axiosInstance.get(
      APIs.GET_ELDER_ASSIGNED_TEAM_MEMBERS.replace(
        ':elderIdentifier',
        payload.elderIdentifier,
      ),
    );

  removeAssignedTeamMembers = payload =>
    axiosInstance.put(APIs.ELDER_ASSIGN_TEAM_MEMBERS, payload);

  assignTeamMembers = payload =>
    axiosInstance.post(APIs.ELDER_ASSIGN_TEAM_MEMBERS, payload);

  bulkAssignTeamMembers = payload =>
    axiosInstance.post(APIs.BULK_ELDER_ASSIGN_TEAM_MEMBERS, payload);

  getDirectory = payload => {
    const url = APIs.GET_DIRECTORY.replace(
      ':elderIdentifier',
      payload.currentElderIdentifier,
    );

    return axiosInstance.get(url);
  };

  addDirectory = payload => axiosInstance.post(APIs.ADD_DIRECTORY, payload);

  editDirectory = payload =>
    axiosInstance.put(
      APIs.EDIT_DIRECTORY.replace(':id', payload.directoryID),
      payload,
    );

  deleteDirectory = payload => {
    const apiUrl = APIs.DELETE_DIRECTORY.replace(
      ':id',
      payload.directoryID,
    ).replace('{:user_id}', payload.user_id);
    return axiosInstance.delete(apiUrl);
  };

  addMedicalRecord = payload =>
    axiosInstance.post(APIs.ADD_MEDICAL_RECORD, payload);

  editMedicalRecord = payload =>
    axiosInstance.put(
      APIs.EDIT_MEDICAL_RECORD.replace(':id', payload.recordID),
      payload,
    );

  deleteMedicalRecord = payload =>
    axiosInstance.delete(
      APIs.DELETE_MEDICAL_RECORD.replace(':id', payload.recordID).replace(
        ':user_id',
        payload.user_id,
      ),
    );

  initiateUserService = dataPayload =>
    axiosInstance.post(APIs.INITIATE_USER_SERVICE, dataPayload);

  elderZohoResync = payload =>
    axiosInstance.post(APIs.ELDERSZOHORESYNC, payload);

  elderZohoSync = payload => axiosInstance.post(APIs.ELDERSZOHOSYNC, payload);

  wmsNf1Info = payload => axiosInstance.post(APIs.WMSNF1INFO, payload);

  wmsRespAttendance = payload =>
    axiosInstance.post(APIs.WMSRESPATTENDANCE, payload);

  getEmergencyInput = payload => axiosInstance.post(APIs.GETEMERGENCY, payload);

  getElderWMSDoc = payload =>
    axiosInstance.post(APIs.ELDER_WMS_DAILY_DOC_COUNT, payload);

  addElderFriendNotes = payload =>
    axiosInstance.post(APIs.ADD_ELDER_FRIEND_NOTES, payload);

  getElderFriendNotes = payload =>
    axiosInstance.get(`${APIs.VIEW_ELDER_FRIEND_NOTES}/${payload.id}`);
}
