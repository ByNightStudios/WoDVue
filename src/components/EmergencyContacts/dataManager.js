import ElderService from "../../service/ElderService";

export default class EmergencyContactsManager {
  constructor() {
    this.elderService = new ElderService();
  }

  removeContact = (emergencyContacts, contactIdentifier) => {
    if (contactIdentifier) {
      return this.elderService
        .removeEmergencyContactService(contactIdentifier)
        .then(responseData => {
          return responseData.data;
        })
        .catch(errorData => {
          throw errorData;
        });
    }
  };

  addContact = dataPayload => {
    if (dataPayload) {
      return this.elderService
        .addEmergencyContactService(dataPayload)
        .then(responseData => {
          return responseData.data;
        })
        .catch(errorData => {
          throw errorData;
        });
    }
  };

  updateContact = (contactIdentifier, dataPayload) => {
    if (dataPayload) {
      return this.elderService
        .updateEmergencyContactService(contactIdentifier, dataPayload)
        .then(responseData => {
          return responseData.data;
        })
        .catch(errorData => {
          throw errorData;
        });
    }
  };
}
