import ElderService from '../../service/ElderService';

export default class AddConciergeDataManager {
  constructor() {
    this.elderService = new ElderService();
  }

  getElderData(payload) {
    return this.elderService.getElderData(payload);
  }
}
