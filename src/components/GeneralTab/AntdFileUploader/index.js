import React from 'react';
import { Upload, Button, message, Card } from 'antd';
import { get } from 'lodash';
import { UploadOutlined } from '@ant-design/icons';

import { connect } from 'react-redux';
import { checkIsErmOrErmSuperVisor } from 'utils/checkElderEditPermission';
import { imageUpload, iconUpload } from '../../../actions/MediaActions';
import ElderDetailsDataManager from '../../ElderDetails/dataManager';
import { axiosInstance } from '../../../store/store';

const { Meta } = Card;

export class Demo extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      fileList: [],
      uploading: false,
      editLoading: false,
      deleteLoading: false,
      user_image: 'https://testing.api.emoha.com/media/default/preview',
    };
    this.handleDeleteUpload = this.handleDeleteUpload.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.getBase64 = this.getBase64.bind(this);
    this.elderManager = new ElderDetailsDataManager();
  }

  componentDidMount() {
    const payload = {
      id: get(this.props, 'elderData.id'),
    };
    this.elderManager.elderService.getElderData(payload);
    const userImage = get(this.props, 'elderData.image_url');
    this.setState({
      user_image: userImage,
    });
  }

  componentWillReceiveProps() {
    const userImage = get(this.props, 'elderData.image_url');
    this.setState({
      user_image: userImage,
    });
  }

  handleDeleteUpload = () => {
    this.setState({
      user_image: 'https://testing.api.emoha.com/media/default/preview',
    });
    const payload = {
      user_id: get(this.props, 'elderData.id'),
      first_name: get(this.props, 'elderData.first_name', ''),
      last_name: get(this.props, 'elderData.last_name', ''),
      user_type: get(this.props, 'elderData.user_type', ''),
      image_uuid: '',
    };

    this.elderManager.elderService
      .editElderProfile(payload)
      .then(response => {
        if (response) {
        }
      })
      .catch(err => {
        if (err) {
          message.error(`file remove fail`);
        }
      });
    setTimeout(() => {
      const payload = {
        id: get(this.props, 'elderData.id'),
      };
      this.elderManager.elderService.getElderData(payload);
      message.success(`file remove`);
    }, 1000);
  };

  getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  handleChange(info) {
    if (info.file.status === 'done') {
      const payload = {
        user_id: get(this.props, 'elderData.id'),
        first_name: get(this.props, 'elderData.first_name', ''),
        last_name: get(this.props, 'elderData.last_name', ''),
        user_type: get(this.props, 'elderData.user_type', ''),
        image_uuid: get(info, 'file.response.data.id'),
      };

      this.elderManager.elderService
        .editElderProfile(payload)
        .then(response => {
          if (response) {
            this.getBase64(info.file.originFileObj, imageUrl => {
              this.setState({
                user_image: imageUrl,
              });
            });
            // hack BE send old file. Not the updated file. squareboat done that flow
          }
        })
        .catch(err => {
          if (err) {
            message.error(`${info.file.name} file upload fail`);
          }
        });

      setTimeout(() => {
        const payload = {
          id: get(this.props, 'elderData.id'),
        };
        this.elderManager.elderService.getElderData(payload);
        message.success(`${info.file.name} file uploaded successfully`);
      }, 1000);
    }
  }

  render() {
    return (
      <Card
        style={{ width: '35vw' }}
        cover={
          <img
            alt="example"
            src={get(
              this.state,
              'user_image',
              'https://testing.api.emoha.com/media/default/preview',
            )}
            style={{ height: '300px', objectFit: 'cover' }}
          />
        }
        actions={[
          <Upload
            action={`${config.BASEURL}uploads`}
            method="POST"
            data={{
              file_type: 3,
            }}
            headers={{
              authorization:
                axiosInstance.defaults.headers.common.Authorization,
            }}
            showUploadList={false}
            onChange={file => this.handleChange(file)}
          >
            <Button
              icon={<UploadOutlined />}
              disabled={checkIsErmOrErmSuperVisor(
                this.props.user,
                this.props.elderData,
              )}
            >
              Edit
            </Button>
          </Upload>,
        ]}
      />
    );
  }
}

const mapStateToProps = state => ({
  user: state.user.user,
});

export default connect(
  mapStateToProps,
  { imageUpload, iconUpload },
)(Demo);
