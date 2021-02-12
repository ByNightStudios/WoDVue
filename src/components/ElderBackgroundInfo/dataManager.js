import ElderService from '../../service/ElderService';

export default class ElderBackGroundInfoManager {
  constructor() {
    this.elderService = new ElderService();
  }

  updateBackGroundInfo = (payload) => {
    return this.elderService.updateElderFormData(payload);
  };

  validate = (formData) => {
    const fields = Object.keys(formData);
    let validated = true;
    let label = '';
    const requiredFields = [
      'heightFt',
      'heightIn',
      'weight',
    ];
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
  heightFt: 'Height in Feet',
  heightIn: ' Height in Inches',
  weight: 'Weight',
};
