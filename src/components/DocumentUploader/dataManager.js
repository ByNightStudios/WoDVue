import UploadService from '../../service/UploadService';

export default class DocumentUploaderDataManager {
  /**
   *
   * @param {String} API_URL
   */
  constructor(API_URL) {
    this.uploadService = new UploadService(API_URL);
  }

  uploadDocument = (uploadedFileData) => {
    const formData = new FormData();
    formData.append('file_type', uploadedFileData.fileType);
    formData.set('file', uploadedFileData.file);

    return this.uploadService
      .uploadDocument(formData)
      .then((responseData) => {
        return responseData.data;
      })
      .catch((errorData) => {
        throw errorData;
      });
  };
}
