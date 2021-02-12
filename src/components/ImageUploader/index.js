import React from 'react';
import * as _ from 'lodash';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { faFileUpload, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { imageUpload, iconUpload } from '../../actions/MediaActions';
import { checkIsErmOrErmSuperVisor } from '../../utils/checkElderEditPermission';
import styles from './image-uploader.scss';

class ImageUploader extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      displayEmpty: true,
      displayPrefilled: false,
      displaySelection: false,
      uploadedFileURI: null,
      existingFileURI: null,
    };

    this.randomComponentID = Math.floor(100000 + Math.random() * 900000);
  }

  componentDidMount() {
    const { image_url } = this.props;
    const { existingFileURI } = this.state;

    if (
      image_url !== undefined &&
      typeof image_url === 'string' &&
      existingFileURI !== image_url
    ) {
      this.setState({ existingFileURI: image_url }, () => {
        this.handleSingleSelection('EXTERNAL_PREFILL');
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { image_url } = this.props;
    const { existingFileURI } = this.state;

    if (
      prevProps.image_url !== image_url &&
      typeof image_url === 'string' &&
      existingFileURI !== image_url
    ) {
      this.setState({ existingFileURI: this.props.image_url }, () => {
        this.handleSingleSelection('EXTERNAL_PREFILL');
      });
    }
  }

  handleSingleSelection = (uploadSource) => {
    switch (uploadSource) {
      case 'INTERNAL_SELECTION':
        this.setState({
          existingFileURI: null,
          displaySelection: true,
          displayPrefilled: false,
          displayEmpty: false,
        });
        return;

      case 'EXTERNAL_PREFILL':
        this.setState({
          uploadedFileURI: null,
          displaySelection: false,
          displayPrefilled: true,
          displayEmpty: false,
        });
        return;

      default:
        this.setState({
          uploadedFileURI: null,
          existingFileURI: null,
          displaySelection: false,
          displayPrefilled: true,
          displayEmpty: false,
        });
        return;
    }
  };

  validateUploadedFile = (fileObject) => {
    let isUploadValid = true;
    const { openNotification } = this.props;

    if (fileObject) {
      const { size, type } = fileObject;

      if (Math.round(size / 1000) > 5000) {
        console.log('Size of Uploaded File was', size);

        openNotification(
          'Error',
          'The file you selected is too large. Select a smaller file and try again.',
          0
        );
        isUploadValid = false;
      }

      if (
        type !== 'image/jpeg' &&
        type !== 'image/png' &&
        type !== 'image/jpg'
      ) {
        console.log('Type of Uploaded File was', type);

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
    const {
      openNotification,
      onImageUpload,
      startLoader,
      stopLoader,
      type,
    } = this.props;

    if (_.get(event, 'target.files', []).length !== 0) {
      startLoader();

      const fileObject = _.get(event, 'target.files', [])[0];
      const { file_type, owner_type } = this.props;

      const isUploadValid = this.validateUploadedFile(fileObject);

      if (isUploadValid) {
        console.log('Valid File Uploaded', fileObject);

        if (type === 'Media') {
          this.props
            .imageUpload(fileObject, file_type)
            .then((responseData) => {
              const { id, web_route } = responseData.data;

              onImageUpload(id);

              this.setState({ uploadedFileURI: web_route }, () => {
                stopLoader();

                this.handleSingleSelection('INTERNAL_SELECTION');
              });
            })
            .catch((errorData) => {
              console.log('ERROR WAS', errorData);

              stopLoader();

              openNotification('Error', errorData.message, 0);
            });
        } else {
          this.props
            .iconUpload(fileObject, owner_type, file_type)
            .then((responseData) => {
              const { id, web_route } = responseData.data;

              onImageUpload(id);

              this.setState({ uploadedFileURI: web_route }, () => {
                stopLoader();

                this.handleSingleSelection('INTERNAL_SELECTION');
              });
            })
            .catch((errorData) => {
              console.log('ERROR WAS', errorData);

              stopLoader();

              openNotification('Error', errorData.message, 0);
            });
        }
      } else {
        stopLoader();
      }
    } else {
      openNotification(
        'Error',
        'Invalid file was selected. Please try again.',
        0
      );
    }
  };

  render() {
    const {
      displayEmpty,
      displayPrefilled,
      displaySelection,
      uploadedFileURI,
      existingFileURI,
    } = this.state;

    const { uploadTitle } = this.props;

    return (
      <div
        className='image-uploader d-flex align-items-start justify-content-center flex-column'
        style={styles}
      >
        {displayEmpty && (
          <div className='uploader-state-empty'>
            <FontAwesomeIcon icon={faPlus} />
            <span className='uploader-state-text'>{uploadTitle}</span>
          </div>
        )}

        {displayPrefilled && (
          <div className='uploader-state-prefilled'>
            <img
              src={existingFileURI}
              className='uploader-image'
              alt='Existing'
            />
          </div>
        )}

        {displaySelection && (
          <div className='uploader-state-selected'>
            <img
              src={uploadedFileURI}
              className='uploader-image'
              alt='Uploaded'
            />
          </div>
        )}

        <label
          className='upload-cta'
          htmlFor={`uploadButton-${this.randomComponentID}`}
        >
          <input
            type='file'
            accept='jpg,jpeg,png'
            className='upload-cta-field'
            id={`uploadButton-${this.randomComponentID}`}
            onChange={(event) => this.handleFileSelection(event)}
            disabled={checkIsErmOrErmSuperVisor(this.props.user, this.props.elderData)}
            style={{ maxWidth: 400 }}
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

const mapDispatchToProps = {
  imageUpload,
  iconUpload,
};

export default connect(mapStateToProps, mapDispatchToProps)(ImageUploader);

ImageUploader.propTypes = {
  type: PropTypes.string.isRequired,
  stopLoader: PropTypes.func.isRequired,
  startLoader: PropTypes.func.isRequired,
  file_type: PropTypes.string.isRequired,
  owner_type: PropTypes.string.isRequired,
  uploadTitle: PropTypes.string.isRequired,
  openNotification: PropTypes.func.isRequired,
  onImageUpload: PropTypes.func.isRequired,
};
