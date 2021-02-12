import ElderService from '../../service/ElderService';

export default class PlansTabDataManager {
  constructor() {
    this.elderService = new ElderService();
  }

  getElderPlans(payload) {
    return this.elderService.getElderPlans(payload);
  }
}
