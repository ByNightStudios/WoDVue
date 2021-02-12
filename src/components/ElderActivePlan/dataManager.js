import PlanService from '../../service/PlanService';
import ElderService from '../../service/ElderService';

export default class ElderActivePlanDataManager {
  constructor() {
    this.planService = new PlanService();
    this.elderService = new ElderService();
  }

  getPlans(inputs) {
    let payload = {
      page: inputs.page,
      search: inputs.search,
    };
    return this.planService.getPlansService(payload);
  }

  addElderPlan(inputs) {
    const payload = {
      user_id: inputs.userID,
      plan_id: inputs.planID,
      service_initiation_date: inputs.serviceInitiationDate,
      start_date: inputs.startDate,
      amount: inputs.amount,
      currency: inputs.currency,
      duration: inputs.duration,
    };

    return this.elderService.addElderPlan(payload);
  }

  initiateUserService(inputs) {
    const payload = {
      user_plan_id: inputs.userPlanID,
      service_initiation_date: inputs.serviceInitiationDate,
      amount: inputs.amount,
      duration: inputs.duration,
    };

    return this.elderService.initiateUserService(payload);
  }
}
