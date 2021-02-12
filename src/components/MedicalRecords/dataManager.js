import ElderService from '../../service/ElderService';

export default class MedicalRecordsDataManager {
  constructor() {
    this.elderService = new ElderService();
  }

  deleteRecord = (payload) => {
    return this.elderService.deleteMedicalRecord(payload);
  };
}
