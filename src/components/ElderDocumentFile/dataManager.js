import ElderService from '../../service/ElderService';

export default class ElderDocumentFileDataManager {
  constructor() {
    this.elderService = new ElderService();
  }
  addDirectory(dataPayload) {
    return this.elderService.addDirectory(dataPayload);
  }
  getDirectory(dataPayload) {
    return this.elderService.getDirectory(dataPayload);
  }

  deleteDirectory(dataPayload) {
    return this.elderService.deleteDirectory(dataPayload);
  }

  editDirectory(dataPayload) {
    return this.elderService.editDirectory(dataPayload);
  }
}
