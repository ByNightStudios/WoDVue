export const ROUTES = {
  HOME: '/',
  LOGIN: '/log-in',
  AddURL: '/add-url',
  DASHBOARD: '/dashboard',
  EMERGENCIES: '/emergencies',
  ADDEMERGENCY: '/emergencies/create',
  VIEWEMERGENCY: '/emergencies/view/:id',
  CONCIERGE: '/concierge',
  ADDCONCIERGE: '/concierge/create',
  RESPONDERS: '/responders',
  ADDRESPONDER: '/responders/create',
  PROVIDERS: '/providers',
  ADDPROVIDERS: '/providers/create',
  ELDERS: '/elders',
  ELDERS_DASHBOARD: '/elders/dashboard',
  ELDERS_PAGE: '/elders-page',
  ADDELDER: '/elders/create',
  VIEWELDER: '/elder/view/:id',
  STAFF: '/staff',
  ADDSTAFF: '/staff/create',
  SUPPORT: '/support',
  USER_MEDICAL_RECORD: '/user/:id/medical-record',
  COMMUNITY: '/community',
  COMMUNITYTHEMES: '/community/themes',
  ADDCOMMUNITYTHEMES: '/community/themes/add',
  EDITCOMMUNITYTHEMES: '/community/themes/edit/:id',
  VIEWCOMMUNITY: '/community/:type/view/:id',
  ADDEVENT: '/events/create',
  ADDOFFER: '/offers/create',
  ADDBLOG: '/blog/create',
  EDITBLOG: '/blog/edit/:id',
  EDITEVENT: '/event/edit/:id',
  EDITOFFER: '/offer/edit/:id',
  EDITELDERFAMILYMEMBER: '/edit/elder/:elder_id/family-member/:relation_id',
  EDITELDEREMERGENCYCONTACT:
    '/edit/elder/:elder_id/emergency-contact/:contact_id',
  ADDPLAN: '/plans/create',
  ADDUSERPLAN: '/plans/map',
  PLANS: '/plans',
  VIEWPLAN: '/plans/view/:id',
  ORDERS: '/orders',
  VIEWORDER: '/orders/view/:id',
  REPORTS: '/reports',
  PLANCATEGORIES: '/plan-categories',
  NOTIFICATIONS: '/notifications',
  RESPONDERREPORTS: '/reports/responder',
  RESPONDER_ASSIGN_ROLE: '/responder/assign',
  VIEWCONCIERGE: '/concierge/view/:id',
  VIEWRESPONDER: '/responder/view/:id',
  VIDEOSUPPORTPAGE: '/support/video',
  UNAUTHORIZEDPAGE: '/unauthorized',
  ROLESLIST: '/roles',
  VIEWROLE: '/roles/view/:id',
  ADDROLE: '/roles/add',
  ASSIGN_ROLES_TO_ADMIN: '/roles/assign',
  VIEWSTAFF: '/staff/view/:id',
  ADMINPROFILE: '/admin/profile',
  ELDERDETAILS: '/elder/details/:id',
  ADDCONCIERGETRIGGER: '/concierge/create/:id',
  BULKASSIGNTEAMMEMBERS: '/elders/map',
  MERGEELDERS: '/elder/merge',
  REPORTGENERATION: '/generate-report',
  REPORTGENERATIONWITHTYPE: '/generate-report/:type',
  ELDERZOHOSYNC: '/elders/sync',
  SHC: '/shc-elders-list',
  BIRTHDAY: '/Birthday',
  ASSIGN_ERM_SUPERVISOR: '/assign/erm/supervisor',
  MY_ELDERS: '/elders/myelders',
  DATA_MANAGER_UNASSIGNED_ELDER_LIST: '/elders/un-assigned',
  DATA_MANAGER_UNASSIGNED_ELDER_LIST_PLAN_PAGE: '/elder-profile/:id',
  PLAN_REPORTS: '/plan-report',
};

export const PERMISSIONS = {
  DASHBOARD_BASIC: {
    value: 'DASHBOARD_STATS_BASIC',
    name: 'Dashboard Stats - Basic',
  },
  DASHBOARD_ADV: {
    value: 'DASHBOARD_STATS_ADV',
    name: 'Dashboard Stats - Advanced',
  },
  EMERGENCY_SEARCH: {
    value: 'EMERGENCY_SEARCH',
    name: 'Emergency - Search',
  },
  EMERGENCY_CREATE: {
    value: 'EMERGENCY_CREATE',
    name: 'Emergency - Create',
  },
  EMERGENCY_VIEW: {
    value: 'EMERGENCY_VIEW',
    name: 'Emergency - View',
  },
  EMERGENCY_CHAT: {
    value: 'EMERGENCY_BEGIN_CHAT',
    name: 'Emergency - Begin Chat',
  },
  EMERGENCY_RECORDS: {
    value: 'EMERGENCY_VIEW_RECORDS',
    name: 'Emergency - View Records',
  },
  EMERGENCY_PHOTO: {
    value: 'EMERGENCY_UPLOAD_PHOTO',
    name: 'Emergency - Upload Photo',
  },
  EMERGENCY_NOTES: {
    value: 'EMERGENCY_SAVE_NOTES',
    name: 'Emergency - Save Notes',
  },
  EMERGENCY_RESPONDER: {
    value: 'EMERGENCY_ALLOCATE_RESPONDER',
    name: 'Emergency - Allocate Responder',
  },
  EMERGENCY_CANCEL: {
    value: 'EMERGENCY_CANCEL',
    name: 'Emergency - Cancel',
  },
  ELDER_MODULE: {
    value: 'ELDER_MODULE',
    name: 'Elders Module',
  },
  RESPONDER_MODULE: {
    value: 'RESPONDER_MODULE',
    name: 'Responders Module',
  },
  CONCIERGE_MODULE: {
    value: 'CONCIERGE_MODULE',
    name: 'Concierge Module',
  },
  TEAM_MODULE: {
    value: 'TEAM_MEMBERS_MODULE',
    name: 'Team Members Module',
  },
  PLAN_MODULE: {
    value: 'PLAN_MANAGEMENT_MODULE',
    name: 'Plan Management Module',
  },
  ORDER_MODULE: {
    value: 'ORDER_MODULE',
    name: 'Orders Module',
  },
  CHAT_MODULE: {
    value: 'CHAT_SUPPORT_MODULE',
    name: 'Chat Support Module',
  },
  COMMUNITY_MODULE: {
    value: 'COMMUNITY_MODULE',
    name: 'Community Module',
  },
  REPORT_MODULE: {
    value: 'REPORTS_MODULE',
    name: 'View Reports',
  },
  NOTIFICATIONS_MODULE: {
    value: 'NOTIFICATIONS_MODULE',
    name: 'Post Notifications',
  },
  VIDEO_MODULE: {
    value: 'VIDEO_MODULE',
    name: 'Video Support Module',
  },
  SHC: {
    value: 'SHC',
    name: 'SHC',
  },
  DATA_MANAGER: {
    value: 'DATA_MANAGER',
    name: 'DATA_MANAGER',
  },
  ERM_Supervisors: {
    value: 'ERM_Supervisors',
    name: 'ERM_Supervisors',
  },
};


export const ROLE_PERMISSIONS = {
  DASHBOARD_BASIC: {
    value: 'DASHBOARD_STATS_BASIC',
    name: 'Dashboard Stats - Basic',
  },
  DASHBOARD_ADV: {
    value: 'DASHBOARD_STATS_ADV',
    name: 'Dashboard Stats - Advanced',
  },
  EMERGENCY_SEARCH: {
    value: 'EMERGENCY_SEARCH',
    name: 'Emergency - Search',
  },
  EMERGENCY_CREATE: {
    value: 'EMERGENCY_CREATE',
    name: 'Emergency - Create',
  },
  EMERGENCY_VIEW: {
    value: 'EMERGENCY_VIEW',
    name: 'Emergency - View',
  },
  EMERGENCY_CHAT: {
    value: 'EMERGENCY_BEGIN_CHAT',
    name: 'Emergency - Begin Chat',
  },
  EMERGENCY_RECORDS: {
    value: 'EMERGENCY_VIEW_RECORDS',
    name: 'Emergency - View Records',
  },
  EMERGENCY_PHOTO: {
    value: 'EMERGENCY_UPLOAD_PHOTO',
    name: 'Emergency - Upload Photo',
  },
  EMERGENCY_NOTES: {
    value: 'EMERGENCY_SAVE_NOTES',
    name: 'Emergency - Save Notes',
  },
  EMERGENCY_RESPONDER: {
    value: 'EMERGENCY_ALLOCATE_RESPONDER',
    name: 'Emergency - Allocate Responder',
  },
  EMERGENCY_CANCEL: {
    value: 'EMERGENCY_CANCEL',
    name: 'Emergency - Cancel',
  },
  ELDER_MODULE: {
    value: 'ELDER_MODULE',
    name: 'Elders Module',
  },
  RESPONDER_MODULE: {
    value: 'RESPONDER_MODULE',
    name: 'Responders Module',
  },
  CONCIERGE_MODULE: {
    value: 'CONCIERGE_MODULE',
    name: 'Concierge Module',
  },
  TEAM_MODULE: {
    value: 'TEAM_MEMBERS_MODULE',
    name: 'Team Members Module',
  },
  PLAN_MODULE: {
    value: 'PLAN_MANAGEMENT_MODULE',
    name: 'Plan Management Module',
  },
  ORDER_MODULE: {
    value: 'ORDER_MODULE',
    name: 'Orders Module',
  },
  CHAT_MODULE: {
    value: 'CHAT_SUPPORT_MODULE',
    name: 'Chat Support Module',
  },
  COMMUNITY_MODULE: {
    value: 'COMMUNITY_MODULE',
    name: 'Community Module',
  },
  REPORT_MODULE: {
    value: 'REPORTS_MODULE',
    name: 'View Reports',
  },
  NOTIFICATIONS_MODULE: {
    value: 'NOTIFICATIONS_MODULE',
    name: 'Post Notifications',
  },
  VIDEO_MODULE: {
    value: 'VIDEO_MODULE',
    name: 'Video Support Module',
  },
  SHC: {
    value: 'SHC',
    name: 'SHC',
  },
  ERM_Supervisors: {
    value: 'ERM_Supervisors',
    name: 'ERM_Supervisors',
  },
  DATA_MANAGER: {
    value: 'DATA_MANAGER',
    name: 'DATA_MANAGER',
  },
};
export const NOTESFILETYPES = [
  'text/csv',
  'image/png',
  'image/jpg',
  'image/jpeg',
  'application/pdf',
  'application/msword',
  'application/vnd.ms-excel',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
];

export const RHHUB = {
  '1': 'Gurgaon Sector 55',
  '2': 'Gurgaon Sector 39',
  '3': 'Noida Sector 46',
  '4': 'Green Park',
  '5': 'Dwarka',
};
