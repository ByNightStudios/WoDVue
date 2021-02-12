import ElderService from '../../../service/ElderService';
import AdminService from '../../../service/AdminService';

export default class ElderTeamMembersDataManager {
  constructor() {
    this.elderService = new ElderService();
    this.adminService = new AdminService();
  }

  getAssignedTeamMembers = (payload) => {
    return this.elderService.getAssignedTeamMembers(payload);
  };

  removeAssignedTeamMembers = (payload) => {
    return this.elderService.removeAssignedTeamMembers(payload);
  };

  assignTeamMembers = (payload) => {
    return this.elderService.assignTeamMembers(payload);
  };

  getUnassignedTeamMembers = (payload) => {
    return this.adminService.getUnassignedTeamMembers(payload);
  };
}
