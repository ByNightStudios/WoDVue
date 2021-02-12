import {
  RESPONDER_LIST_URL,
  UPDATE_RESPONDER_AVAILIBILITY_URL,
} from '../common/backendConstants';

export const responderList = (page = 1, query = '', consumer_id = null) => (
  dispatch,
  getState,
  { api }
) => {
  let url = `${RESPONDER_LIST_URL}&page=${page}&query=${query}`;
  if (consumer_id) {
    url = `${url}&consumer_id=${consumer_id}`;
  }
  return api
    .get(url)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      throw error;
    });
};

export const updateResponder = (admin_id, consumer_id, details) => (
  dispatch,
  getState,
  { api }
) => {
  return api
    .put(`/admin/${admin_id}/users/${consumer_id}`, details)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      throw error.response.data;
    });
};

export const addResponder = (
  admin_id,
  {
    first_name,
    last_name,
    mobile_number,
    gender,
    location,
    location_code,
    image_uuid,
    country_code,
    formatted_mobile_number,
    city,
    service_type,
    otherServiceType,
    pincode,
    state,
    email,
    loc_check,
    kyc_check,
    veri_status,
    region_owner,
    country,
    locality,
    geo_location,
    identity_proof_id,
    dob,
    anniversary,
    aadhaar,
    languages,
    other_language,
    meal_preference,
    weight,
    marital_status,
    exp_year,
    edu_qualification,
    other_qualification,
    previous_work,
    edu_docs,
    video_id,
    about_yourself,
    profile_completed,
  }
) => (dispatch, getState, { api }) => {
  return api
    .post(`/admin/${admin_id}/users`, {
      user_type: 2,
      first_name,
      last_name,
      mobile_number,
      gender,
      location,
      location_code,
      image_uuid,
      country_code,
      formatted_mobile_number,
      city,
      service_type: otherServiceType ? otherServiceType : service_type,
      pincode,
      state,
      email,
      kyc_check,
      loc_check,
      veri_status,
      region_owner,
      country,
      locality,
      geo_location: JSON.stringify(geo_location),
      identity_proof_id,
      source: 'Admin',
      dob,
      anniversary,
      aadhaar,
      languages: languages.length > 0 ? languages : [],
      other_language,
      meal_preference,
      weight,
      marital_status,
      exp_year,
      edu_qualification,
      other_qualification,
      previous_work,
      edu_docs,
      video_id,
      about_yourself,
      profile_completed,
    })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      throw error.response.data;
    });
};

export const updateResponderAvailibilty = (responder_uuid, status) => (
  dispatch,
  getState,
  { api }
) => {
  let url = UPDATE_RESPONDER_AVAILIBILITY_URL.replace(
    ':responder_uuid',
    responder_uuid
  );
  return api
    .put(url, {
      status,
    })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      throw error.response.data;
    });
};
