import {
  CONCIERGE_SERVICE_REQUEST_LIST_URL,
  CONCIERGE_SERVICE_ASSIGN_PROVIDER,
  CONCIERGE_SERVICE_ASSIGN_NEW_PROVIDER,
  CONCIERGE_SERVICE_LIST,
  SERVICE_UPDATE_MILESTONE_URL,
  SERVICE_UPDATE_PROVIDER_URL,
  CONCIERGE_SERVICE_CREATE,
  ADDFEEDBACK,
  ADD_CONCIERGE_NOTES,
  SINGLE_CONCIERGE_DETAILS_URL,
  GET_NEAREST_RESPONDERS_CONCIERGE,
  CONCIERGE_SERVICE_MEDIA_UPLOAD
} from '../common/backendConstants';

export const conciergeList = (
  page = 1,
  query = '',
  status = null,
  back_dated = 0
) => (dispatch, getState, { api }) => {
  let url;
  if (query)
    url = `${CONCIERGE_SERVICE_REQUEST_LIST_URL}&page=${page}&query=${query}`;
  else url = `${CONCIERGE_SERVICE_REQUEST_LIST_URL}&page=${page}`;

  if (status) url = `${url}&status=${status}`;
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

export const conciergeCreate = (consumer_uuid, service_uuid, details) => (
  dispatch,
  getState,
  { api }
) => {
  let url = CONCIERGE_SERVICE_CREATE.replace(':consumer_uuid', consumer_uuid);
  url = url.replace(':service_uuid', service_uuid);
  return api
    .post(url, details)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      throw error;
    });
};

export const conciergeImageUpload = (details) => (dispatch, getState, { api }) => {
  return api
    .post(CONCIERGE_SERVICE_MEDIA_UPLOAD, details)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      throw error;
    });
};


export const conciergeUpdate = (details) => (dispatch, getState, { api }) => {
  return api
    .put(CONCIERGE_SERVICE_ASSIGN_PROVIDER, details)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      throw error;
    });
};

export const conciergeUpdateProvider = (details) => (
  dispatch,
  getState,
  { api }
) => {
  return api
    .put(CONCIERGE_SERVICE_ASSIGN_NEW_PROVIDER, details)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      throw error;
    });
};

export const conciergeServiceList = () => (dispatch, getState, { api }) => {
  return api
    .get(CONCIERGE_SERVICE_LIST)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      throw error;
    });
};

export const serviceUpdateMilestone = (
  service_request_id,
  milestone_uuid,
  status
) => (dispatch, getState, { api }) => {
  const url = SERVICE_UPDATE_MILESTONE_URL.replace(
    ':service_request_id',
    service_request_id
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

export const serviceUpdate = (details) => (dispatch, getState, { api }) => {
  return api
    .put(`${CONCIERGE_SERVICE_ASSIGN_PROVIDER}`, details)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      throw error.response.data;
    });
};

export const serviceUpdateResponder = (service_request_id, provider_uuid) => (
  dispatch,
  getState,
  { api }
) => {
  return api
    .put(SERVICE_UPDATE_PROVIDER_URL, {
      service_request_id,
      provider_uuid,
    })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      throw error.response.data;
    });
};

export const addFeedback = (details) => (dispatch, getState, { api }) => {
  return api
    .post(ADDFEEDBACK, details)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      throw error.response.data;
    });
};

export const updateNotes = (payload) => (dispatch, getState, { api }) => {
  return api
    .put(ADD_CONCIERGE_NOTES, payload)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      throw error.response.data;
    });
};

export const getConciergeDetails = (service_request_id) => (
  dispatch,
  getState,
  { api }
) => {
  const url = SINGLE_CONCIERGE_DETAILS_URL.replace(
    ':service_request_id',
    service_request_id
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

export const fetchNearestRespondersList = (payload) => (
  dispatch,
  getState,
  { api }
) => {
  return api
    .post(GET_NEAREST_RESPONDERS_CONCIERGE, payload)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error.response.data;
    });
};
