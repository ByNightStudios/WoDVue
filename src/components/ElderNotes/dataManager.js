import ElderService from '../../service/ElderService';

export default class ElderNotesDataManager {
  constructor() {
    this.elderService = new ElderService();
  }

  getElderNotes(dataPayload) {
    return this.elderService.getElderNotes(dataPayload);
  }

  deleteElderNote(dataPayload) {
    return this.elderService.deleteElderNote(dataPayload);
  }

  addElderNote(dataPayload) {
    return this.elderService.addElderNote(dataPayload);
  }

  editElderNote(dataPayload) {
    return this.elderService.editElderNote(dataPayload);
  }
}
