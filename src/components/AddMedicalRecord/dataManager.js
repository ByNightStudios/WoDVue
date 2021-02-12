import ElderService from '../../service/ElderService';

export default class ElderMedicalRecordFileManager {
  constructor() {
    this.elderService = new ElderService();
  }

  addMedicalRecord(dataPayload) {
    return this.elderService.addMedicalRecord(dataPayload);
  }
}
