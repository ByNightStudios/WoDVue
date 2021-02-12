import S3UploadService from '../../service/S3UploadService';

export default class S3FileUploaderDataManager {
  /**
   *
   * @param {String} API_URL
   */
  constructor(API_URL) {
    this.s3uploadService = new S3UploadService(API_URL);
  }

  uploadFileToS3 = (url,payload,options) =>{
    return this.s3uploadService.uploadFileToS3(url,payload,options)
  }

  getPreSignedUrl = (payload) => {
    return this.s3uploadService.getS3PresignedUrl(payload)
  }
}
