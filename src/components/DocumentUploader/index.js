import React from 'react';
import * as _ from 'lodash';

import DocumentUploaderDataManager from './dataManager';

import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileUpload, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

import styles from './document-uploader.scss';

class DocumentUploader extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedFileName: '',
      isFileSelected: false,
      notesInputkey: Date.now(),
    };

    this.dataManager = null;
  }

  componentDidMount() {
    this.dataManager = new DocumentUploaderDataManager(
      this.props.uploadDocumentAPI
    );
  }

  validateUploadedFile = (fileObject) => {
    let isUploadValid = true;
    const {
      openNotification,
      acceptedFileSize,
      acceptedTypesString,
    } = this.props;

    if (fileObject) {
      const { size, type } = fileObject;

      if (Math.round(size / 1000) > acceptedFileSize) {

        openNotification(
          'Error',
          `Invalid file size! Select a file under ${`${Math.round(
            acceptedFileSize / 1000
          )} MB`} and try again.`,
          0
        );

        isUploadValid = false;
      }

      if (!this.props.acceptedTypes.includes(type)) {

        openNotification(
          'Error',
          `Invalid file format! Choose a file of type ${acceptedTypesString} and try again.`,
          0
        );

        isUploadValid = false;
      }
    }

    return isUploadValid;
  };

  handleFileSelection = (event) => {
    this.props.startLoader();

    if (_.get(event, 'target.files', []).length !== 0) {
      const fileObject = _.get(event, 'target.files', [])[0];

      const isUploadValid = this.validateUploadedFile(fileObject);

      if (isUploadValid) {
        const { name } = fileObject;
        const { uploadedFileType, openNotification } = this.props;

        this.setState({ selectedFileName: name, isFileSelected: true });

        const dataPayload = {
          fileType: uploadedFileType,
          file: fileObject,
        };

        this.dataManager
          .uploadDocument(dataPayload)
          .then((responseData) => {
            if (responseData) {
              this.props.stopLoader();

              this.props.uploadSuccessCallback(responseData);

              this.resetFileInput();
            }
          })
          .catch((errorData) => {
            this.props.stopLoader();


            openNotification(
              'Error',
              _.get(
                errorData,
                'response.data.message',
                'Unable to save uploaded file due to a server error. Please try again.'
              ),
              0
            );

            this.resetFileInput();
          });
      } else {
        this.props.stopLoader();

        this.resetFileInput();
      }
    }
  };

  handleRemoveFileSelection = (event) => {
    this.resetFileInput();
  };

  resetFileInput = () => {
    this.setState({
      selectedFileName: '',
      isFileSelected: false,
      notesInputkey: Date.now(),
    });
  };

  render() {
    const { isFileSelected, selectedFileName } = this.state;
    const { acceptedTypesString, acceptedFileSize } = this.props;

    return (
      <div
        className='document-uploader d-flex align-items-start justify-content-center flex-column'
        style={styles}
      >
        {isFileSelected && selectedFileName !== '' && (
          <div className='document-uploader-selection d-flex align-items-center justify-content-between'>
            <p className='document-uploader-text'>{selectedFileName}</p>

            <button
              type='button'
              title='Remove'
              className='document-uploader-remove'
              onClick={(event) => this.handleRemoveFileSelection(event)}
            >
              <FontAwesomeIcon icon={faTrashAlt} />
            </button>
          </div>
        )}

        <div className='document-uploader-advisory'>
          <p>
            Attach files like {acceptedTypesString} of up to{' '}
            {`${Math.round(acceptedFileSize / 1000)} MB`} size.
          </p>
        </div>

        <label className='document-action'>
          <input
            type='file'
            key={this.state.notesInputkey}
            className='document-action-field'
            accept='jpg,jpeg,png,pdf,doc,docx,xls,xlsx,ppt,pptx'
            onChange={(event) => this.handleFileSelection(event)}
            disabled={this.props.disabled}
          />

          <span className='document-action-text'>
            <FontAwesomeIcon icon={faFileUpload} /> Attach a Document
          </span>
        </label>
      </div>
    );
  }

  componentWillUnmount() {}
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(DocumentUploader);
