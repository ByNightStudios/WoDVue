import ElderService from '../../service/ElderService';

export default class ElderFamilyDetailsManager {
  constructor() {
    this.elderService = new ElderService();
  }

  updateElderFamilyDetailsData = (payload) => {
    return this.elderService.updateElderFormData(payload);
  };

  validate = (formData) => {
    let validate = true;
    let label = '';
    let formFields = Object.keys(formData);
    for (let index = 0; index < formFields.length; index++) {
      let values = formData[formFields[index]];
      if (values.length > 1) {
        for (let inner_index = 0; inner_index < values.length; inner_index++) {
          let value = values[inner_index];
          if (
            value.name === '' ||
            value.birthday === '' ||
            value.email_id === ''
          ) {
            validate = false;
            label = formFields[index];
            break;
          }
        }
      }
      if (!validate) {
        break;
      }
    }
    return { validate, label };
  };
}

export const itemLabelMapping = {
  elder_kids_details : 'Elder Kids Details',
  elder_grand_kids_details : 'Elder Grand Kids Details'
}