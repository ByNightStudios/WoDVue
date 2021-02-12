import DashboardService from "../../service/DashboardService";

class SHCManager {
  constructor() {
    this.dashboardService = new DashboardService();
  }

  shcActiveEldersList() {
    return this.dashboardService.mergeElders();
  }
}

export default SHCManager;
