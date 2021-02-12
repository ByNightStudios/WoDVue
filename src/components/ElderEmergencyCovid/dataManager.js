import ElderService from '../../service/ElderService';

export default class ElderEmergencyCovidManager {
  constructor() {
    this.elderService = new ElderService();
  }
  getElderFormData = (id, form) => {
    return this.elderService.getElderFormData(id, form);
  };
  updateElderFormData = (payload) => {
    return this.elderService.updateElderFormData(payload);
  };
}
