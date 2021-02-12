/*
 *
 * SocialTab reducer
 *
 */
import produce from 'immer';
import { concat } from 'lodash';
import {
  DEFAULT_ACTION,

  GET_SOCIAL_DATA_START,
  GET_SOCIAL_DATA_SUCCESS,
  GET_SOCIAL_DATA_FAILURE,

  POST_ELDER_PERSONA_START,
  POST_ELDER_PERSONA_SUCCESS,
  POST_ELDER_PERSONA_FAILURE,

  POST_EDU_QUAL_START,
  POST_EDU_QUAL_SUCCESS,
  POST_EDU_QUAL_FAILURE,

  POST_EMPLOYMENT_START,
  POST_EMPLOYMENT_SUCCESS,
  POST_EMPLOYMENT_FAILURE,

  POST_LOCATION_START,
  POST_LOCATION_SUCCESS,
  POST_LOCATION_FAILURE,

  POST_PREFERENCES_START,
  POST_PREFERENCES_SUCCESS,
  POST_PREFERENCES_FAILURE
} from './constants';

export const initialState = {
  data: {
    elderPersona: null,
    elderEducationalQualification: [],
    consumerEmploymentOrganisation: [],
    consumerLocationInformation: null,
    consumerPreference: null
  },
  isLoading: false,
  isElderPersonaUpdating: false,
  isEduQualUpdating: false,
  isEmploymentUpdating: false,
  isLocationUpdating: false,
  isPreferencesUpdating: false
};

/* eslint-disable default-case, no-param-reassign */
const socialTabReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    const { type, payload } = action;

    switch (type) {
      case DEFAULT_ACTION:
        break;

      case GET_SOCIAL_DATA_START:
        draft.isLoading = true;
        break;

      case GET_SOCIAL_DATA_SUCCESS:
        draft.isLoading = false;
        draft.data = payload;
        break;

      case GET_SOCIAL_DATA_FAILURE:
        draft.isLoading = false;
        break;

      case POST_ELDER_PERSONA_START:
        draft.isElderPersonaUpdating = true;
        break;

      case POST_ELDER_PERSONA_SUCCESS:
        draft.isElderPersonaUpdating = false;
        draft.data.elderPersona = payload;
        break;

      case POST_ELDER_PERSONA_FAILURE:
        draft.isElderPersonaUpdating = false;
        break;

      case POST_EDU_QUAL_START:
        draft.isEduQualUpdating = true;
        break;

      case POST_EDU_QUAL_SUCCESS:
        draft.data.elderEducationalQualification = concat(state.data.elderEducationalQualification, payload);
        draft.isEduQualUpdating = false;
        break;

      case POST_EDU_QUAL_FAILURE:
        draft.isEduQualUpdating = false;
        break;

      case POST_EMPLOYMENT_START:
        draft.isEmploymentUpdating = true;
        break;

      case POST_EMPLOYMENT_SUCCESS:
        draft.data.consumerEmploymentOrganisation = concat(state.data.consumerEmploymentOrganisation, payload);
        draft.isEmploymentUpdating = false;
        break;

      case POST_EMPLOYMENT_FAILURE:
        draft.isEmploymentUpdating = false;
        break;

      case POST_LOCATION_START:
        draft.isLocationUpdating = true;
        break;

      case POST_LOCATION_SUCCESS:
        draft.data.consumerLocationInformation = payload;
        draft.isLocationUpdating = false;
        break;

      case POST_LOCATION_FAILURE:
        draft.isLocationUpdating = false;
        break;

      case POST_PREFERENCES_START:
        draft.isPreferencesUpdating = true;
        break;

      case POST_PREFERENCES_SUCCESS:
        draft.data.consumerPreference = payload;
        draft.isPreferencesUpdating = false;
        break;

      case POST_PREFERENCES_FAILURE:
        draft.isPreferencesUpdating = false;
        break;
    }
  });

export default socialTabReducer;
