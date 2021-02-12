import React from 'react';
import * as _ from 'lodash';

import { connect } from 'react-redux';
import { faFileUpload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styles from './file-selector.scss';

class FileSelector extends React.Component {
  validateUploadedFile = (fileObject) => {
    let isUploadValid = true;
    const { openNotification } = this.props;

    if (fileObject) {
      const { size, type } = fileObject;

      if (Math.round(size / 1000) > this.props.maxFileSize) {
        openNotification(
          'Error',
          'The file you selected is too large. Select a smaller file and try again.',
          0
        );
        isUploadValid = false;
      }

      if (
        this.props.fileType === 'image' &&
        type !== 'image/jpeg' &&
        type !== 'image/png' &&
        type !== 'image/jpg'
      ) {
        openNotification(
          'Error',
          'This file format is not supported. Choose a JPG or PNG image and try again.',
          0
        );
        isUploadValid = false;
      }
    }

    return isUploadValid;
  };

  handleFileSelection = (event) => {
    const { onSelection } = this.props;

    if (_.get(event, 'target.files', []).length !== 0) {
      const fileObject = _.get(event, 'target.files', [])[0];

      const isUploadValid = this.validateUploadedFile(fileObject);

      if (isUploadValid) {
        onSelection(fileObject);
      }
    }
  };

  render() {
    return (
      <div style={styles}>
        <label htmlFor='fileSelectoruploadButton' className='upload-cta'>
          <input
            type='file'
            id='fileSelectoruploadButton'
            className='upload-cta-field'
            onChange={(event) => this.handleFileSelection(event)}
          />

          <span className='upload-cta-text'>
            <FontAwesomeIcon icon={faFileUpload} /> Upload Photo
          </span>
        </label>
      </div>
    );
  }

  componentWillUnmount() {}
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(FileSelector);
