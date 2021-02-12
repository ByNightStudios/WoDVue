import ElderService from '../../service/ElderService';

export default class VirtualHouseMappingManager {
  constructor() {
    this.elderService = new ElderService();
  }

  validateVirtualMappingData = (formData) => {
    let payload = formData;
    let validate = true;
    let label = 'Success';
    Object.keys(payload).map((items) => {
      if (payload[items].length > 1) {
        for (let index = 0; index < payload[items].length; index++) {
          let item = payload[items][index];
          if (
            item.phoneNumber === null ||
            item.phoneNumber === '' ||
            item.address === '' ||
            item.address === null
            // (item.verified && item.verifyDate === null)
          ) {
            validate = false;
            label = items;
            break;
          }
        }
      }
      return true;
    });
    return { validate, label };
  };

  getElderFormData = (id, form) => {
    return this.elderService.getElderFormData(id, form);
  };

  updateElderFormData = (payload) => {
    return this.elderService.updateElderFormData(payload);
  };
}

export const selectionOptions = {
  verified: ['Verified'],
};

export const itemLabelMapping = {
  police: 'Police',
  fireDepartment: 'Fire Department',
  nearestHospitals: 'Nearest Hospitals',
  covidCenters: 'Covid Centers',
  ambulanceProvider: 'Ambulance Providers',
  chemist: 'Chemist',
  groceryStore: 'Grocery Store',
};
