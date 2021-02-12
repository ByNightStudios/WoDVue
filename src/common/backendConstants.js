/* Begin Pusher Configurations
*
// WARNING - PRODUCTION ENVIROMENT SETTINGS
*/
export const PUSHER_KEY = 'fddb82923d3aa22cc529';
export const PUSHER_CLUSTER = 'ap2';
/*
// WARNING - END PRODUCTION ENVIRONMENT SETTINGS
*
*
*
// WARNING - DEVELOPMENT / STAGING ENVIRONMENT SETTINGS
*/
// export const PUSHER_KEY = '70049892bfe539a1dd70';
// export const PUSHER_CLUSTER = 'ap1';

export const OPENTOK_KEY = '46674672';
/*
// WARNING - END DEVELOPMENT / STAGING ENVIRONMENT SETTINGS
*
// End Pusher Configurations
*
*
*
*
*
*
*
// WARNING - END LOCAL ENVIRONMENT SETTINGS
*
// End Application Primary URI Configrations
*
*
*
*
*
*
*
*
// Begin Application Constants
*/
export const ADMINLOGIN = 'ADMINLOGIN';
export const ADDEVENT = 'ADDEVENT';
export const ADDOFFER = 'ADDOFFER';
export const ADDBLOG = 'ADDBLOG';
export const COMMUNITYPOSTLIST = 'COMMUNITYPOSTLIST';
export const COMMUNITYFAILURE = 'COMMUNITYFAILURE';
export const LOGOUT = 'LOGOUT';
export const ELDERDATA = 'ELDERDATA';
export const EMERGENCY_CONTACT = 'emergencycontact/UPDATE';
export const FAMILY_MEMBER = 'familymember/UPDATE';
export const REMOVEADDRESS = 'address/REMOVE';
export const ADDADDRESS = 'address/ADD';
export const UPDATEADDRESS = 'address/UPDATE';
export const FETCHNOTIFICATION = 'notifications/FETCH';
export const ADDNOTIFICATION = 'notifications/ADD';
export const READNOTIFICATIONS = 'notifications/REMOVE';
export const RESETNOTIFICATIONS = 'notifications/RESET';
export const ADMINPERMISSION = 'permission/UPDATE';
export const ADMINPROFILE = 'profile/UPDATE';
export const ELDERNOTES = 'elders/NOTES';
export const ADDELDERNOTE = 'elders/ADDNOTE';
export const EDITELDERNOTE = 'elders/EDITNOTE';
export const REMOVEELDERNOTE = 'elders/REMOVENOTE';
export const RESETELDERNOTES = 'elders/RESETNOTES';
export const MEDICALRECORDS = 'elders/MEDICALRECORDS';
export const SELECTMEDICALRECORD = 'elders/SELECTMEDICALRECORD';
export const EDITMEDICALRECORD = 'elders/EDITMEDICALRECORD';
export const ADDMEDICALRECORD = 'elders/ADDMEDICALRECORD';
export const PURGEMEDICALRECORD = 'elders/PURGEMEDICALRECORD';
export const GET_ANALYTCS = 'get_analytics';
/*
// End Application Constants
*
*
*
*
*
*
*
// Begin Application API URI Configrations
*/
export const ADMINLOGINURL = '/admin/login';
export const ANALYTICS = 'admin/analytics';
export const ANALYTICS_MAP = 'admin/analytics/map';
export const STAFFLISTURL = '/admin/users?user_type=1';
export const CONSUMER_LIST_URL =
  '/admin/users?user_type=3&includes=consumer_addresses';
export const RESPONDER_LIST_URL = '/admin/users?user_type=2';
export const EMERGENCIES_LIST_URL =
  '/admin/requests?includes=request_consumer,request_address,request_responder,request_responder_milestones,request_milestone,consumer_addresses,user_plans';
export const EMERGENCIES_LIST_COUNT_URL =
  '/admin/requests/count?includes=request_consumer,request_address,request_responder,request_responder_milestones,request_milestone,consumer_addresses,user_plans&emergencies_count=true';
export const SINGLE_EMERGENCY_DETAILS_URL =
  '/admin/requests/:request_uuid?includes=request_consumer,request_address,request_responder,request_responder_milestones,request_milestone,consumer_addresses,user_plans';
export const EMERGENCY_RESPONDERS_LIST_URL = '/admin/available-responder';
export const EMERGENCY_RESPONDERS_LIST_URL_TYPE =
  '/admin/available-responder-shc';
export const EMERGENCIES_ASSIGN_RESPONDER_URL = '/admin/request/';
export const EMERGENCIES_UPDATE_RESPONDER_URL =
  '/admin/requests/:request_uuid/assign-responder';
export const CREATE_EMERGENCY_REQUEST_URL = 'admin/request';
export const EMERGENCIES_UPDATE_MILESTONE_URL =
  '/admin/requests/:request_uuid/milestone';
export const UPDATE_RESPONDER_AVAILIBILITY_URL =
  '/responder/:responder_uuid/available';
export const UPDATE_ELDER_ADDRESS_URL =
  '/admin/:admin_uuid/consumer/:consumer_uuid/address/:address_uuid';
export const ADD_NEW_ELDER_ADDRESS_URL =
  '/admin/:admin_uuid/consumer/:consumer_uuid/address';
export const IMAGE_UPLOAD_URL = '/uploads';
export const ICON_UPLOAD_URL = '/uploads/icons';
export const UPDATE_USER_STATUS_URL = '/admin/users/:user_uuid/active-status';
export const UPDATE_USER_BRIEFING_STATUS_URL =
  '/admin/users/:user_uuid/active-briefing';
export const UPDATE_USER_NOK_STATUS_URL = '/admin/users/:user_uuid/active-nok';
export const UPDATE_WELCOME_PACK_STATUS_URL =
  '/admin/users/:user_uuid/welcome-pack';

export const UPDATE_PRIMARY_ELDER_STATUS_URL =
  'admin/update-primery-elder/:user_uuid';

export const STATES_URL = '/config?includes=states';
export const COUNTRY_CODES_URL = '/config?includes=country_codes';
export const MESSAGE_CHATS = '/message/chats';
export const MESSAGES = '/message';
export const MESSAGES_CREATE = '/message/create';
export const MESSAGE_CHATS_UNREAD = '/message/chats/:chat_id';
export const MESSAGE_CHATS_USERS = '/message/users';
export const USER_METADATA_KEY = '/chat/users/:user_id/metadata/';
export const ENGAGE_MCXTRA = '/admin/requests/:request_uuid/mcxtra';
export const FCM_DATA_URL = 'user/fcm/token';
export const PROVIDER_LIST_URL = '/admin/providers';
export const ADD_NEW_PROVIDER_URL = '/admin/providers';
export const UPDATE_PROVIDER_URL = '/admin/providers/:provider_id';
export const CONCIERGE_SERVICE_REQUEST_LIST_URL =
  '/admin/service-requests?includes=request_consumer,request_address,request_provider,request_responder,request_provider_milestones,request_milestone,user_plans';
export const CONCIERGE_SERVICE_ASSIGN_PROVIDER = 'admin/service-requests/';
export const CONCIERGE_SERVICE_ASSIGN_NEW_PROVIDER =
  'admin/service-requests/assign-provider/new';
export const CONCIERGE_SERVICE_LIST = 'admin/service-categories';
export const SERVICE_UPDATE_MILESTONE_URL =
  '/admin/service-requests/:service_request_id/milestone';
export const SERVICE_UPDATE_PROVIDER_URL =
  '/admin/service-requests/assign-provider/new';
export const CONCIERGE_SERVICE_CREATE =
  'admin/user/:consumer_uuid/services/:service_uuid';
export const PROVIDER_LIST_TYPE_URL = 'admin/providers/types?search=';
export const USER_MEDICAL_RECORD = '/user/:user_uuid/medical-record/';

export const ADDFEEDBACK = 'user/service-requests/feedback';
export const ZOHOSYNC = 'admin/zoho-sync';
export const COMMUNITY_POSTLIST_URL = 'admin/community-feed';
export const ADD_COMMUNITY_POST_URL = 'admin/community-feed';
export const GET_COMMUNITY_POST_URL = 'admin/community-feed/:id';
export const ADD_EVENT_URL = 'admin/community-feed';
export const ADD_OFFER_URL = 'admin/community-feed';
export const ADD_BLOG_URL = 'admin/community-feed';
export const ADD_CONCIERGE_NOTES = 'admin/service-requests/notes';
export const ADD_EMERGENCY_NOTES = 'admin/requests/notes';
export const GET_COUNTRIES = '/countries';
export const GET_STATES = '/states?country=:country';
export const GET_CITIES = '/cities?state=:state';
export const DELETE_COMMUNITY_POST_URL =
  'admin/community-feed?community_feed_id=:id';
export const GET_ELDER =
  'admin/elder/:id?includes=consumer_addresses,user_relationships,plans';
export const UPDATE_ELDER = 'admin/elder/:id';
export const GET_ELDER_FAMILY_MEMBERS_URL =
  'admin/elder/:id?includes=user_relationships';
export const ADD_FAMILY_MEMBER_URL = 'admin/elder/family-members';
export const UPDATE_FAMILY_MEMBER_URL = 'admin/elder/family-members/{id}';
export const DELETE_FAMILY_MEMBER_URL = 'admin/elder/family-members/{id}';
export const GET_FAMILY_MEMBER_URL = 'admin/elder/family-members/{id}';
export const ADD_EMERGENCY_CONTACT_URL = 'admin/elder/emergency-contacts';
export const GET_EMERGENCY_CONTACT_URL = 'admin/elder/emergency-contacts/{id}';
export const UPDATE_EMERGENCY_CONTACT_URL =
  'admin/elder/emergency-contacts/{id}';
export const DELETE_EMERGENCY_CONTACT_URL =
  'admin/elder/emergency-contacts/{id}';
export const PLANS_URL = 'admin/plans';
export const PLANS_ID_URL = 'admin/plans/:id';
export const GENERATE_REPORT_URL = '/admin/requests/report';
export const GET_ORDERS_URL = '/admin/orders';
export const GET_ORDERS_BY_ID_URL = '/admin/orders/:order_id';
export const GET_PLAN_CATEGORIES = '/admin/plan-categories';
export const UPDATE_DELETE_PLAN_CATEGORIES =
  '/admin/plan-categories/:plan_category_id';
export const UPDATE_DELETE_ELDER_ADDRESS =
  '/admin/elder/:elder_id/address/:address_id';
export const ADD_ELDER_ADDRESS = '/admin/elder/:elder_id/address/';
export const NOTIFICATIONS = '/admin/notifications';
export const NOTIFICATIONS_SELF = '/admin/notifications/self';
export const COMMUNITY_THEME = '/admin/community-theme';
export const COMMUNITY_THEME_BY_ID = '/admin/community-theme/:theme_id';
export const GET_INACTIVE_PLAN_USERS = '/admin/elders/no-plan';
export const ADD_USER_PLAN = 'admin/plans/map';
export const RESPONDER_CONFIG_URL =
  '/responder/config?includes=responder_types';

export const RESPONDER_KYC_URL = 'admin/responder/:responder_id/kyc';
export const REQUEST_MEDIA_FETCH_URL = 'admin/requests/media/fetch';
export const REQUEST_MEDIA_ADD_URL = 'admin/requests/media/add';
export const UPLOAD_REQUEST_MEDIA_URL = 'uploads/request';
export const GENERATE_RESPONDER_REPORT_URL = '/admin/responder/report/all';
export const SINGLE_CONCIERGE_DETAILS_URL =
  '/admin/service-requests/:service_request_id?includes=request_consumer,request_address,request_provider,request_responder,request_provider_milestones,request_milestone,user_plans';
export const GET_NEAREST_RESPONDERS_EMERGENCY =
  '/admin/requests/nearest-responders';
export const GET_NEAREST_RESPONDERS_CONCIERGE =
  'admin/service-requests/nearest-responders';
export const GET_REQUEST_CALL_LOGS = 'admin/requests-call-log';
export const RESPONDER_KYC_UPLOAD = 'uploads/kyc';
export const PENDING_SERVICE_RESPONDERS = 'admin/pending-requests/service/:id';
export const GET_ELDERS_LIST = 'admin/elders/list';
export const GET_ELDERS_MANAGER_LIST = 'admin/data-manager-elder-list';
export const GET_ACTIVE_CALLS_LIST = 'admin/conference/calls';
export const JOIN_ROOM = 'admin/conference/join';
export const DISCONNECT_CALL = 'admin/conference/disconnect';
export const ROOM_MEMBERS = 'admin/conference/members';
export const GET_SELF_PERMISSIONS = 'admin/rbac/permissions/self';
export const ROLES_API = 'admin/rbac/roles/';
export const ROLE_BY_ID_API = 'admin/rbac/roles/:role_id';
export const VIEW_ADMIN_BY_ID = 'admin/list/:admin_id';
export const ADMINS_LIST = 'admin/list';
export const ASSIGN_ROLE = 'admin/rbac/roles/assign';
export const RESPONDER_VERIFICATION_URL = '/admin/responder/verification';
export const UPDATE_ADMIN_PROFILE = 'admin/profile';
export const GET_ELDER_NOTES = 'admin/elder-notes/:elderIdentifier';
export const DELETE_ELDER_NOTE = 'admin/elder-notes/:noteIdentifier';
export const ADD_ELDER_NOTE = 'admin/elder-notes/';
export const EDIT_ELDER_NOTE = 'admin/elder-notes/';
export const UPDATE_ELDER_FORMS = 'admin/elder-forms';
export const GET_ELDER_FORM_DATA = 'admin/elder-forms/{elder_id}';
export const ELDER_EMERGENCY_REQUESTS =
  'admin/elder-requests/emergency/:elderIdentifier';
export const ELDER_CONCIERGE_REQUESTS =
  'admin/elder-requests/service/:elderIdentifier';
export const GET_ELDER_PLANS = 'admin/elder-plans/:elderIdentifier';
export const ADD_ELDER_PLANS = 'admin/elder-plans/';
export const GET_ELDER_ASSIGNED_TEAM_MEMBERS =
  'admin/elder-assignment/:elderIdentifier';
export const ELDER_ASSIGN_TEAM_MEMBERS = 'admin/elder-assignment/';
export const GET_UNASSIGNED_TEAM_MEMBERS =
  'admin/list/unassigned-team-members/';
export const GET_ADMINS_BY_ROLE = 'admin/list/roles';
export const BULK_ELDER_ASSIGN_TEAM_MEMBERS = 'admin/elder-assignment/bulk';
export const UPLOAD_NOTES_DOCUMENT = 'uploads/notes-documents';
export const UPLOAD_S3_URL = 'uploads/upload-to-aws';
export const GET_DIRECTORY = 'admin/medical-records/elder/:elderIdentifier';
export const ADD_DIRECTORY = 'admin/medical-records/directories';
export const DELETE_DIRECTORY =
  'admin/medical-records/directories/:id?user_id={:user_id}';
export const EDIT_DIRECTORY = 'admin/medical-records/directories/:id';
export const ADD_FILE = 'admin/medical-records/';
export const EDIT_MEDICAL_RECORD = 'admin/medical-records/:id';
export const ADD_MEDICAL_RECORD = 'admin/medical-records/';
export const INITIATE_USER_SERVICE = 'admin/elder-plans/initiate';
export const MERGEELDERS = 'admin/elders/merge-data';
export const DELETE_MEDICAL_RECORD =
  'admin/medical-records/:id?user_id=:user_id';
export const REPORTGENERATOR = 'admin/reports';
export const GETELDERDETAILSUSINGMOBILENUMBER =
  'admin/elders/mobile-number/:number';
export const CONCIERGE_SERVICE_MEDIA_UPLOAD =
  'admin/upload-media-concierge-service';
export const ELDERSZOHORESYNC = 'admin/elders/zoho/resync';
export const ELDERSZOHOSYNC = 'admin/elders/zoho/sync';

export const WMSNF1INFO = 'responder/requests/wmsNf1Info';
export const GETEMERGENCY = 'responder/requests/get-emergency-input';
export const WMSRESPATTENDANCE = 'responder/requests/wmsRespAttendance';
export const ADMIN_ROLES = 'admin/rbac/roles?page=all';
export const ADMIN_ASSIGN_ROLES = 'admin/rbac/roles/assign';
export const ADMIN_LIST_ROLES = 'admin/list/roles';
export const ADMIN_RESPONDER_ASSIGN_ROLES =
  'admin/rbac/roles/responder-admin-assign';

export const SHC_ACTIVE_ELDERS_LIST = 'admin/shc-active-elders-list-new';
export const ELDER_WMS_DAILY_DOC_COUNT =
  'responder/requests/wms-daily-doc-count';

export const ADD_NOK_FAMILY_MEMBERS = 'admin/elder/add-nok-family-members/';
export const ELDER_ADD_FRIENDS = 'admin/add-friends';
export const ELDER_GET_FRIENDS = 'admin/friends-details/';
export const ELDER_UPDATE_FRIENDS = 'admin/update-friend/';

export const ELDER_ADD_SENSORS = 'admin/add-sensor';
export const ELDER_GET_SENSORS = 'admin/sensor-details/';
export const ELDER_UPDATE_SENSORS = 'admin/update-sensor/';
export const ELDER_EMERGENCY_REQUEST_ASSIGN = 'admin/request-accept-agen/';
export const BIRTHDAY = 'admin/birthday-list';
export const GET_INSURANCE_DETAILS = 'admin/insurance-details/';
export const ADD_INSURANCE = 'admin/add-insurance';
export const ASSIGN_ERM_SUPERVISOR = 'admin/rbac/roles/erm-manager-assign';
export const GET_ELDERS_LIST_ON_DASHBOARD = 'admin/rbac/roles/erm-manager';
export const ADD_ELDER_FRIEND_NOTES = 'admin/add-friend-note';
export const VIEW_ELDER_FRIEND_NOTES = 'admin/friends-details-note';
export const DELETE_ERM_MANAGER = 'admin/rbac/roles/remove-erm-manager/';
export const VIEW_MY_ELDERS = 'admin/erm-elder-list';
export const ELDER_DETAILS = 'details';
export const ELDER_PLAN_EXPIRE = '/admin/elder-plan-will-expire';
export const GET_UN_ASSIGNED_ELDERS_MANAGER_LIST =
  'admin/data-manager-elder-list-plan-expiry';
/*
// End Application API URI Configrations
*/
