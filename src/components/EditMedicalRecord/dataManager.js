import ElderService from '../../service/ElderService';

export default class ElderMedicalRecordFileManager {
  constructor() {
    this.elderService = new ElderService();
  }

  editMedicalRecord(dataPayload) {
    return this.elderService.editMedicalRecord(dataPayload);
  }
}
