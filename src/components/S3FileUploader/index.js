import React from 'react';
import * as _ from 'lodash';

import S3FileUploaderDataManager from './dataManager';
import { notification } from 'antd';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileUpload } from '@fortawesome/free-solid-svg-icons';

import styles from './s3-file-uploader.scss';

class S3FileUploader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFileName: '',
      isFileSelected: false,
      notesInputkey: Date.now(),
    };

    this.dataManager = new S3FileUploaderDataManager(this.props.uploadS3API);

    this.mimeTypeMapping = {
      video: [
        'video/x-flv',
        'video/webm',
        'video/mp4',
        'video/3gpp',
        'video/x-msvideo',
        'video/quicktime',
        'video/x-matroska',
        'video/x-ms-wmv',
        '',
      ],
      doc: [
        'image/jpeg',
        'image/png',
        'image/jpg',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'text/csv',
      ],
      ehr: ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'],
    };
  }

  componentDidMount() {
    this.dataManager = new S3FileUploaderDataManager(this.props.uploadS3API);
  }

  openNotification = (message, description, status) => {
    let style = { color: 'green' };
    if (!status)
      style = {
        color: 'red',
      };
    const args = {
      message,
      description,
      duration: 3,
      style,
    };
    notification.open(args);
  };

  getS3PresignedUrl = (payload) => {
    return new Promise((resolve, reject) => {
      this.dataManager
        .getPreSignedUrl(payload)
        .then((result) => {
          resolve(result);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  validateUploadedFile = (payload) => {
    let isUploadValid = true;
    const { mime_type, obj_type } = payload;
    const mapping = this.mimeTypeMapping[obj_type];
    if (!mapping.includes(mime_type)) {
      return false;
    }
    return isUploadValid;
  };

  uploadFileToS3 = (url, fileObject, options) => {
    return this.dataManager.uploadFileToS3(url, fileObject, options);
  };

  handleFileSelection = (event) => {
    let fileObject = null;
    const { file_type, obj_type } = this.props;
    if (_.get(event, 'target.files', []).length !== 0) {
      fileObject = _.get(event, 'target.files', [])[0];
    }
    if (fileObject !== null) {
      const { type, name } = fileObject;

      const payload = {
        file_type,
        obj_type,
        mime_type: type,
      };

      const isUploadValid = this.validateUploadedFile(payload);

      if (payload['mime_type'] === '') {
        payload['mime_type'] = 'video/x-matroska';
      }

      if (isUploadValid) {
        this.props.loader(true);

        this.getS3PresignedUrl(payload)
          .then((result) => {
            const { id, url } = result.data;
            const options = {
              headers: {
                'Content-Type': file_type,
              },
            };
            this.uploadFileToS3(url, fileObject, options)
              .then((result) => {
                if (result.status === 200) {
                  this.props.loader(false);
                  this.openNotification('Success', `Uploaded Successfully`, 1);
                  this.props.uploadSuccessCallback(id, name);
                } else {
                  this.props.loader(false);
                  this.openNotification('Error', `Please upload again`, 0);
                }
              })
              .catch((error) => {
                this.props.loader(false);
                //this.openNotification('Error', `An Error occured while uploading.Please check you network connection`, 0);
              });
          })
          .catch((error) => {
            this.props.loader(false);
            this.openNotification(
              'Error',
              `Please select correct configuation.`,
              0
            );
          });
      } else {
        this.openNotification(
          'Error',
          `Invalid File Type. Please select ${this.props.allowedStrings.toUpperCase()}`,
          0
        );
      }
    } else {
      this.openNotification(
        'Error',
        `Please select a ${obj_type} file to upload`,
        0
      );
    }
  };

  render() {
    const { allowedStrings } = this.props;

    return (
      <div
        className='document-uploader d-flex align-items-start justify-content-center flex-column'
        style={styles}
      >
        <div className='document-uploader-advisory'>
          <p>Upload files in formats like {allowedStrings.toUpperCase()}</p>
        </div>

        <label className='document-action'>
          <input
            type='file'
            className='document-action-field'
            accept={allowedStrings}
            onChange={(event) => this.handleFileSelection(event)}
          />
          <span className='document-action-text'>
            <FontAwesomeIcon icon={faFileUpload} /> Upload a File
          </span>
        </label>
      </div>
    );
  }

  componentWillUnmount() {}
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(S3FileUploader);
