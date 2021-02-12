import AdminService from "../../service/AdminService";

class MergeElderManager {
  constructor() {
    this.adminService = new AdminService();
  }

  mergeElders(payload) {
    return this.adminService.mergeElders(payload);
  }
}

export default MergeElderManager;
