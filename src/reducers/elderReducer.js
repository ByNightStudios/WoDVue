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

const initialState = {
  elderNotes: [],
  records: {
    medicalRecords: [],
    selectedRecord: null,
    editRecord: false,
    addRecord: false,
  },
  UserMedicalRecord: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case ELDERDATA:
      return {
        ...state,
        elderData: action.payload,
      };

    case ELDERNOTES:
      return {
        ...state,
        elderNotes: [...state.elderNotes, ...action.payload],
      };

    case ADDELDERNOTE:
      let updatedNotesArr1 = state.elderNotes;
      updatedNotesArr1.unshift(action.payload);

      return {
        ...state,
        elderNotes: [...updatedNotesArr1],
      };

    case EDITELDERNOTE:
      let updatedNotesArr2 = state.elderNotes;

      for (let index = 0; index < updatedNotesArr2.length; index++) {
        if (updatedNotesArr2[index].id === action.payload.id) {
          updatedNotesArr2[index] = action.payload;
        }
      }

      return {
        ...state,
        elderNotes: [...updatedNotesArr2],
      };

    case REMOVEELDERNOTE:
      let updatedNotesArr = state.elderNotes;
      updatedNotesArr = updatedNotesArr.filter(
        (note) => note.id !== action.payload.noteIdentifier
      );

      return {
        ...state,
        elderNotes: [...updatedNotesArr],
      };

    case RESETELDERNOTES:
      return {
        ...state,
        elderNotes: [],
      };

    case EMERGENCY_CONTACT:
      return {
        ...state,
        elderData: {
          ...state.elderData,
          owner: {
            ...state.elderData.owner,
            emergencyContact: action.payload,
          },
        },
      };

    case FAMILY_MEMBER:
      return {
        ...state,
        elderData: {
          ...state.elderData,
          user_relationships: action.payload,
        },
      };

    case REMOVEADDRESS:
      let updatedElderData = Object.assign({}, state.elderData);
      updatedElderData.owner.consumer_addresses = action.payload;

      return {
        ...state,
        elderData: updatedElderData,
      };

    case ADDADDRESS:
      let newElderData = Object.assign({}, state.elderData);
      newElderData.owner.consumer_addresses = action.payload;

      return {
        ...state,
        elderData: newElderData,
      };

      case UPDATEADDRESS:
        let newElderAddressData = Object.assign({}, state.elderData);
        newElderAddressData.owner.consumer_addresses = action.payload;
        return {
          ...state,
          elderData: newElderAddressData,
        };
  
    case MEDICALRECORDS:
      return {
        ...state,
        records: {
          ...state.records,
          medicalRecords: action.payload,
        },
      };

    case SELECTMEDICALRECORD:
      return {
        ...state,
        records: {
          ...state.records,
          selectedRecord: action.payload,
        },
      };

    case EDITMEDICALRECORD:
      return {
        ...state,
        records: {
          ...state.records,
          editRecord: !state.records.editRecord,
        },
      };

    case ADDMEDICALRECORD:
      return {
        ...state,
        records: {
          ...state.records,
          addRecord: !state.records.addRecord,
        },
      };

    case PURGEMEDICALRECORD:
      return {
        ...state,
        records: {},
      };

    default:
      return state;
  }
}
