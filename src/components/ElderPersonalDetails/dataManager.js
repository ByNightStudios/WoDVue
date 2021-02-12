import ElderService from '../../service/ElderService';

export default class ElderPersonalDetailsManager {
  constructor() {
    this.elderService = new ElderService();
  }

  updateElderPersonalDetails = (payload) => {
    return this.elderService.updateElderFormData(payload);
  };

  validate = (formData) => {
    const fields = Object.keys(formData);
    let validated = true;
    let label = '';
    const requiredFields = [];
    for (let index = 0; index < fields.length; index++) {
      if (requiredFields.includes(fields[index])) {
        if (
          formData[fields[index]] === null ||
          formData[fields[index]] === ''
        ) {
          validated = false;
          label = fields[index];
          break;
        }
      }
    }
    return { validated, label };
  };
}

export const stateLableMapping = {
  firstName : `Elder's First Name`,
  lastName : `Elder's Last Name`,
  dob : `Elder's DOB`,
}