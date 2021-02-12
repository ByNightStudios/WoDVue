import React from "react";
import { Upload, Button, Icon } from "antd";
import { CloudUploadOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faPlus } from "@fortawesome/free-solid-svg-icons";
import { connect } from "react-redux";
import { imageUpload, iconUpload } from "../../actions/MediaActions";
import { checkIsErmOrErmSuperVisor } from '../../utils/checkElderEditPermission';
import styles from "./image-upload.scss";

class ImageUpload extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      imageUrl: this.props.image_url ? this.props.image_url : "",
      loading: false,
      file_type: this.props.file_type,
      type: this.props.type,
      owner_type: this.props.owner_type,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.imageUrl === "" &&
      this.props.image_url &&
      this.props.image_url.length
    )
      this.setState({ imageUrl: this.props.image_url });
  }

  getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      //message.error('You can only upload JPG/PNG file!');
      this.props.notification("Error", "You can only upload JPG/PNG file!", 0);
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 5;
    if (!isLt2M) {
      this.props.notification("Error", "Image must be smaller than 5MB!", 0);
      return false;
    }

    return this.state.type === "Media"
      ? this.uploadImage(file)
      : this.uploadIcon(file);
  };

  uploadImage = (file) => {
    this.setState({ loading: true });
    return this.props
      .imageUpload(file, this.state.file_type)
      .then((result) => {
        this.props.onImageUpload(result.data.id);
        this.setState({ imageUrl: result.data.web_route, loading: false });
        return true;
      })
      .catch((error) => {
        this.props.notification("Error", error.message, 0);
        this.setState({ loading: false });
        return false;
      });
  };

  uploadIcon = (file) => {
    this.setState({ loading: true });
    return this.props
      .iconUpload(file, this.state.owner_type, this.state.file_type)
      .then((result) => {
        this.props.onImageUpload(result.data.id);
        this.setState({ imageUrl: result.data.web_route, loading: true });
        return true;
      })
      .catch((error) => {
        this.props.notification("Error", error.message, 0);
        this.setState({ loading: false });
        return false;
      });
  };

  handleChange = (info) => {
    if (info.file.status === "uploading") {
      this.setState({ loading: true });
      return;
    }

    if (this.state.imageUrl) {
      this.setState({
        loading: false,
      });
    }

    if (info.file.status === "done") {
      // Get this url from response in real world.
      this.getBase64(info.file.originFileObj, (imageUrl) => {
        this.setState({
          imageUrl: imageUrl,
          loading: false,
        });
      });
    }
  };

  render() {
    const { imageUrl } = this.state;
    const uploadButton = (
      <div>
        <FontAwesomeIcon icon={this.state.loading ? faSpinner : faPlus} />
        <div className="ant-upload-text">
          {this.props.uploadTitle ? this.props.uploadTitle : "Upload"}
        </div>
      </div>
    );

    return (
      <React.Fragment>
        <div className="upload-wrapper" style={styles}>
          {/* REQUIRED PROPS - listType, action, onChange - https://ant.design/components/upload/#header */}
          <Upload
            listType="picture-card"
            showUploadList={false}
            beforeUpload={(file) => this.beforeUpload(file)}
            onChange={(info) => this.handleChange(info)}
 
          >
            {imageUrl ? (
              <img src={imageUrl} alt="avatar" style={{ width: "100%" }} />
            ) : (
              uploadButton
            )}
          </Upload>
        </div>
        {imageUrl !== "" || imageUrl ? (
          <div className="upload-wrapper" style={styles}>
            {/* REQUIRED PROPS - listType, action, onChange - https://ant.design/components/upload/#header */}
            <Upload
              showUploadList={false}
              beforeUpload={(file) => this.beforeUpload(file)}
              onChange={(info) => this.handleChange(info)}
   
            >
              <Button
                style={{
                  width: "175px",
                  color: "#780001",
                  border: "1px solid #780001",
                }}
              >
                <CloudUploadOutlined type="upload" style={{ verticalAlign: "0" }} />
                Upload
              </Button>
            </Upload>
          </div>
        ) : null}
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user.user,
});

export default connect(mapStateToProps, { imageUpload, iconUpload })(
  ImageUpload
);
