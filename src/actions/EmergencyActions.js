import {
  EMERGENCIES_LIST_URL,
  EMERGENCY_RESPONDERS_LIST_URL,
  EMERGENCY_RESPONDERS_LIST_URL_TYPE,
  EMERGENCIES_ASSIGN_RESPONDER_URL,
  EMERGENCIES_UPDATE_RESPONDER_URL,
  CREATE_EMERGENCY_REQUEST_URL,
  EMERGENCIES_UPDATE_MILESTONE_URL,
  CONSUMER_LIST_URL,
  ENGAGE_MCXTRA,
  ADD_EMERGENCY_NOTES,
  SINGLE_EMERGENCY_DETAILS_URL,
  EMERGENCIES_LIST_COUNT_URL,
  GET_NEAREST_RESPONDERS_EMERGENCY,
  GET_REQUEST_CALL_LOGS,
  ELDER_EMERGENCY_REQUEST_ASSIGN,
} from "../common/backendConstants";

export const emergenciesList = (
  page = 1,
  query = "",
  status = null,
  back_dated = 0
) => (dispatch, getState, { api }) => {
  let url;
  if (query) url = `${EMERGENCIES_LIST_URL}&page=${page}&query=${query}`;
  else url = `${EMERGENCIES_LIST_URL}&page=${page}`;

  if (status && status !== "INVALID") url = `${url}&status=${status}`;
  else url = `${url}`;

  url = `${url}&back_dated=${back_dated}`;
  return api
    .get(url)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      throw error;
    });
};

export const emergenciesCount = (
  page = 1,
  query = "",
  status = null,
  back_dated = 0
) => (dispatch, getState, { api }) => {
  let url = `${EMERGENCIES_LIST_COUNT_URL}`;
  if (query) url = `${url}&page=${page}&query=${query}`;
  else url = `${url}&page=${page}`;

  if (status && status !== "INVALID") url = `${url}&status=${status}`;
  else url = `${url}`;

  url = `${url}&back_dated=${back_dated}`;
  return api
    .get(url)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      throw error;
    });
};

export const getEmergencyDetails = (request_uuid) => (
  dispatch,
  getState,
  { api }
) => {
  const url = SINGLE_EMERGENCY_DETAILS_URL.replace(
    ":request_uuid",
    request_uuid
  );

  return api
    .get(url)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      throw error;
    });
};

export const emergencyRespondersList = (search = "", locationCode = "") => (
  dispatch,
  getState,
  { api }
) => {
  // let url = `${EMERGENCY_RESPONDERS_LIST_URL}?search=${search}&locationCode=${locationCode}`;
  let url = `${EMERGENCY_RESPONDERS_LIST_URL}?search=${search}`;
  return api
    .get(url)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      throw error;
    });
};

export const emergencyRespondersListType = (responderType = "", locationCode = "") => (
  dispatch,
  getState,
  { api }
) => {
  let url = `${EMERGENCY_RESPONDERS_LIST_URL_TYPE}?service_type=${responderType}`;
  return api
    .get(url)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      throw error;
    });
}

export const emergencyUpdate = (request_id, details) => (
  dispatch,
  getState,
  { api }
) => {
  return api
    .put(`${EMERGENCIES_ASSIGN_RESPONDER_URL}${request_id}`, details)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      throw error.response.data;
    });
};

export const emergencyUpdateResponder = (request_uuid, responder_uuid) => (
  dispatch,
  getState,
  { api }
) => {
  const url = EMERGENCIES_UPDATE_RESPONDER_URL.replace(
    ":request_uuid",
    request_uuid
  );
  return api
    .put(url, {
      responder_uuid,
    })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      throw error.response.data;
    });
};

export const emergencyCreate = (body) => (dispatch, getState, { api }) => {
  return api
    .post(CREATE_EMERGENCY_REQUEST_URL, body)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      throw error.response.data;
    });
};

export const emergencyUpdateMilestone = (
  request_uuid,
  milestone_uuid,
  status
) => (dispatch, getState, { api }) => {
  const url = EMERGENCIES_UPDATE_MILESTONE_URL.replace(
    ":request_uuid",
    request_uuid
  );
  return api
    .put(url, {
      status,
      milestone_uuid,
    })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      throw error.response.data;
    });
};

export const consumerSearchList = (query, status = 0) => (
  dispatch,
  getState,
  { api }
) => {
  let url;
  if (status) url = `${CONSUMER_LIST_URL}&query=${query}&status=${status}`;
  else url = `${CONSUMER_LIST_URL}&query=${query}`;
  return api
    .get(url)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      throw error;
    });
};

export const createMcxtraRequest = (payload) => (
  dispatch,
  getState,
  { api }
) => {
  let url = ENGAGE_MCXTRA.replace(":request_uuid", payload.request_uuid);
  return api
    .post(url, payload)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      throw error.response.data;
    });
};

export const updateNotes = (payload) => (dispatch, getState, { api }) => {
  return api
    .put(ADD_EMERGENCY_NOTES, payload)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      throw error.response.data;
    });
};

export const fetchNearestRespondersList = (payload) => (
  dispatch,
  getState,
  { api }
) => {
  return api
    .post(GET_NEAREST_RESPONDERS_EMERGENCY, payload)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error.response.data;
    });
};

export const fetchCallLogs = (payload) => (dispatch, getState, { api }) => {
  return api
    .post(GET_REQUEST_CALL_LOGS, payload)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error.response.data;
    });
};

export const emergencyAssigner = (payload) => (dispatch, getState, { api }) => {
  const myPayload = {
    status: `${payload.status}`,
  };
  return api
    .put(`${ELDER_EMERGENCY_REQUEST_ASSIGN}${payload.id}`, myPayload)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log(error);
    });
};
