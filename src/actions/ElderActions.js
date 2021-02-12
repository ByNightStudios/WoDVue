import {
  ELDERDATA,
  EMERGENCY_CONTACT,
  REMOVEADDRESS,
  ADDADDRESS,
  FAMILY_MEMBER,
  ELDERNOTES,
  REMOVEELDERNOTE,
  ADDELDERNOTE,
  EDITELDERNOTE,
  RESETELDERNOTES,
  MEDICALRECORDS,
  SELECTMEDICALRECORD,
  EDITMEDICALRECORD,
  ADDMEDICALRECORD,
  PURGEMEDICALRECORD,
  UPDATEADDRESS,
} from '../common/backendConstants';

export const getElderData = (payload) => (dispatch) => {
  dispatch({
    type: ELDERDATA,
    payload,
  });
};

export const removeElderData = () => (dispatch) => {
  dispatch({
    type: ELDERDATA,
    payload: null,
  });
};

export const removeElderAddress = (payload) => (dispatch) => {
  dispatch({
    type: REMOVEADDRESS,
    payload,
  });
};

export const addElderAddress = (payload) => (dispatch) => {
  dispatch({
    type: ADDADDRESS,
    payload,
  });
};


export const updateElderAddress = (payload) => (dispatch) => {
  dispatch({
    type: UPDATEADDRESS,
    payload,
  });
};

export const removeEmergencyContact = (dataPayload) => (dispatch) => {
  dispatch({
    type: EMERGENCY_CONTACT,
    payload: dataPayload,
  });
};

export const addEmergencyContact = (dataPayload) => (dispatch) => {
  dispatch({
    type: EMERGENCY_CONTACT,
    payload: dataPayload,
  });
};

export const updateEmergencyContact = (dataPayload) => (dispatch) => {
  dispatch({
    type: EMERGENCY_CONTACT,
    payload: dataPayload,
  });
};

export const removeFamilyContact = (dataPayload) => (dispatch) => {
  dispatch({
    type: FAMILY_MEMBER,
    payload: dataPayload,
  });
};

export const addFamilyContact = (dataPayload) => (dispatch) => {
  dispatch({
    type: FAMILY_MEMBER,
    payload: dataPayload,
  });
};

export const updateFamilyContact = (dataPayload) => (dispatch) => {
  dispatch({
    type: FAMILY_MEMBER,
    payload: dataPayload,
  });
};

export const fetchElderNotes = (dataPayload) => (dispatch) => {
  dispatch({
    type: ELDERNOTES,
    payload: dataPayload,
  });
};

export const addElderNote = (dataPayload) => (dispatch) => {
  dispatch({
    type: ADDELDERNOTE,
    payload: dataPayload,
  });
};

export const editElderNote = (dataPayload) => (dispatch) => {
  dispatch({
    type: EDITELDERNOTE,
    payload: dataPayload,
  });
};

export const deleteElderNote = (dataPayload) => (dispatch) => {
  dispatch({
    type: REMOVEELDERNOTE,
    payload: dataPayload,
  });
};

export const resetExistingNotes = () => (dispatch) => {
  dispatch({
    type: RESETELDERNOTES,
  });
};

export const medicalRecordsAction = (dataPayload = []) => (dispatch) => {
  dispatch({
    type: MEDICALRECORDS,
    payload: dataPayload,
  });
};

export const selectedMedicalRecordAction = (dataPayload = null) => (
  dispatch
) => {
  dispatch({
    type: SELECTMEDICALRECORD,
    payload: dataPayload,
  });
};

export const editMedicalRecordAction = () => (dispatch) => {
  dispatch({
    type: EDITMEDICALRECORD,
    payload: null,
  });
};

export const addMedicalRecordAction = () => (dispatch) => {
  dispatch({
    type: ADDMEDICALRECORD,
    payload: null,
  });
};

export const purgeMedicalRecords = () => (dispatch) => {
  dispatch({
    type: PURGEMEDICALRECORD,
    payload: null,
  });
};
