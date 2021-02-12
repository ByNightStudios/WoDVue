import { axiosInstance } from '../store/store';

export default class UploadService {
  /**
   *
   * @param {String} API_URL
   */
  constructor(API_URL) {
    this.uploadAPIUrl = API_URL;
  }

  uploadDocument = (dataPayload) => {
    return axiosInstance.post(this.uploadAPIUrl, dataPayload);
  };
}
