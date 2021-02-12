import PlanService from '../../service/PlanService';

class UserPlanManager {
  constructor() {
    this.planService = new PlanService();
  }

  getPlans(inputs) {
    let payload = {
      page: inputs.page,
      search: inputs.search,
    };
    return this.planService.getPlansService(payload);
  }

  adduserPlan(inputs) {
    const payload = {
      user_ids: inputs.userIDs,
      plan_id: inputs.planID,
      service_initiation_date: inputs.serviceInitiationDate,
      amount: inputs.amount,
      currency: inputs.currency,
      start_date: inputs.startDate,
      duration: inputs.duration,
    };

    return this.planService.addUserPlan(payload);
  }
}

export default UserPlanManager;
