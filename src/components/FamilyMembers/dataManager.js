import ElderService from "../../service/ElderService";
import AdminService from "../../service/AdminService";

export default class FamilyContactsManager {
  constructor() {
    this.elderService = new ElderService();
    this.adminService = new AdminService();
  }

  removeContact = (contactIdentifier) => {
    if (contactIdentifier) {
      return this.elderService
        .removeFamilyMemberService(contactIdentifier)
        .then((responseData) => {
          return responseData.data;
        })
        .catch((errorData) => {
          throw errorData;
        });
    }
  };

  addNokFamilyMember = (id, payload) => {
    if (payload) {
      return this.elderService
        .addNokFamilyMember(id, payload)
        .then((responseData) => {
          return responseData.data;
        })
        .catch((errorData) => {
          throw errorData;
        });
    }
  };

  addContact = (dataPayload) => {
    if (dataPayload) {
      return this.elderService
        .addFamilyMemberService(dataPayload)
        .then((responseData) => {
          return responseData.data;
        })
        .catch((errorData) => {
          throw errorData;
        });
    }
  };

  updateContact = (contactIdentifier, dataPayload) => {
    if (dataPayload) {
      return this.elderService
        .updateFamilyMemberService(contactIdentifier, dataPayload)
        .then((responseData) => {
          return responseData.data;
        })
        .catch((errorData) => {
          throw errorData;
        });
    }
  };

  prePopulateData = (mobile_number) => {
    return this.adminService.getElderDetailsUsingMobileNumber(mobile_number);
  };
}
