import { axiosInstance } from '../store/store';
import axios from 'axios';

export default class S3UploadService {
  /**
   *
   * @param {String} API_URL
   */
  constructor(API_URL) {
    this.s3uploadAPIUrl = API_URL;    
  }

  uploadFileToS3 = (preSignedUrl, file,options) => {      
    return axios.put(preSignedUrl, file, options);    
  };

  getS3PresignedUrl = (payload) => {
    return axiosInstance.post(this.s3uploadAPIUrl,payload);
  }
}
