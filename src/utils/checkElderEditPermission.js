import { includes, isEmpty, get, map } from 'lodash';

const ElderEditPermission = ['ERM', 'ERM Head', 'ERM Supervisors'];
const VirtualHouseMappingPermission = ['C&C User', 'C&C Head'];
const MedicalTabPermission = ['DOC', 'DOC Super User', 'Dietitian', 'Dietitian Head', 'Physio', 'Physio Super User'];
const SensorAndDocumentsTabPermission = ['Regional Community Manager', 'Physio', 'Physio Super User'];
const ElderActiveEditPermission = ['ERM', 'ERM Head', 'ERM Supervisors','IT Admin', 'Leadership Team', 'C&C Head', 'DOC Super User'];

export const checkIsErmOrErmSuperVisor = (loggedInUser, ErmData) => {
  const loggedInUserId = get(loggedInUser, 'id');
  const checkRole = !includes(
    ElderEditPermission,
    get(loggedInUser, 'role[0]'),
  );
  const ErmTeam = get(ErmData, 'erm_data[0]', []);
  const ermDataId = [
    get(ErmTeam, 'admin_user.uuid'),
    get(ErmTeam, 'ermSupervisorData.manager_assignments.uuid'),
  ];

  const isUserIdMatch = includes(ermDataId, loggedInUserId);

  const hasLoggedUserPermissionToEditData = isUserIdMatch && checkRole;
  return !hasLoggedUserPermissionToEditData;
};

export const checkIsErmOrErmSuperVisorElderActive = (loggedInUser) => {
 return !includes(ElderActiveEditPermission,get(loggedInUser, 'role[0]', get(loggedInUser, 'roles[0]')));
};

export const checkIsCCTeamOrCCHead = role => {
  if (isEmpty(role)) {
    return null;
  }
  return !includes(VirtualHouseMappingPermission, role[0]);
};


export const checkForMedicalTab = (loggedInUser, ErmData) => {
  const loggedInUserId = get(loggedInUser, 'id');
  const LoggedInUserRole = get(loggedInUser, 'role[0]', get(loggedInUser, 'roles[0]') );

  if(includes(MedicalTabPermission, LoggedInUserRole)){
    return false;
  }

 if(includes(ElderEditPermission, LoggedInUserRole)){
  return checkIsErmOrErmSuperVisor(loggedInUser, ErmData)
 }
 return true;
}

 export const checkForSensorAndDocumentationTab = (loggedInUser, ErmData) => {
  const loggedInUserId = get(loggedInUser, 'id');
  const LoggedInUserRole = get(loggedInUser, 'role[0]', get(loggedInUser, 'roles[0]') );

  if(includes(SensorAndDocumentsTabPermission, LoggedInUserRole)){
    return false;
  }

 if(includes(ElderEditPermission, LoggedInUserRole)){
  return checkIsErmOrErmSuperVisor(loggedInUser, ErmData)
 }
 return true;
}
