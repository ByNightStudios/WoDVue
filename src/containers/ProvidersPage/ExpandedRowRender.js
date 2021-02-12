import React from "react";
import { Button, Form } from "react-bootstrap";
import { connect } from "react-redux";
import {
  updateResponder,
  updateResponderAvailibilty
} from "../../actions/ResponderActions";
import {
  updateProvider,
  providerTypeList
} from "../../actions/ProviderActions";
import { Select } from "antd";
import { getCountryCodesList } from "../../actions/ConfigActions";

import PageLoader from "../../components/PageLoader";
import ImageUpload from "../../components/ImageUpload";
const { Option } = Select;

class ExpandedRowRender extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.record.name,
      mobile_number: this.props.record.mobile_number,
      country_code: this.props.record.country_code,
      loader: false,
      is_available: this.props.record.is_available,
      image_url: this.props.record.image_url
        ? this.props.record.image_url
        : null,
      image_uuid: null,
      type: this.props.record.type,
      countryCodesList: [],
      formatted_mobile_number: null,
      providerTypeListData: []
    };
  }

  componentDidMount() {
    this.getCountryCodesList();
    this.getProvidersTypesList();
  }

  getCountryCodesList() {
    this.props
      .getCountryCodesList()
      .then(result => {
        this.setState({ countryCodesList: result.country_codes });
      })
      .catch(error => {
        console.log(error);
      });
  }
  getProvidersTypesList = () => {
    this.props
      .providerTypeList()
      .then(result => {
        let types = [];
        result.data.map((Types, index) => {
          return types.push(Types);
        });
        this.setState({
          providerTypeListData: types
        });
      })
      .catch(error => {
        return error;
      });
  };
  setStateValues = (e, field) => {
    let value = e.currentTarget.value;
    let state = this.state;
    state[`${field}`] = value;
    this.setState(state);
  };

  updateProviderHandler = async e => {
    e.preventDefault();

    let { name, mobile_number, type, image_uuid } = this.state;

    let details = {
      name,
      mobile_number,
      type
    };

    if (image_uuid) details = { ...details, image_uuid };

    if (name === null || name === "")
      return this.props.onClick("Error", "Name is required.", 0);
    if (mobile_number === null || mobile_number === "")
      return this.props.onClick("Error", "Mobile Number is required.", 0);

    let regex = /^[0-9]{10}$/;

    if (!regex.test(mobile_number))
      return this.props.onClick("Error", "Mobile Number is invalid.", 0);

    await this.setState({
      loader: true,
      mobile_number
    });
    details.type = JSON.stringify(this.state.type);

    this.props
      .updateProvider(this.props.record.id, this.state)
      .then(result => {
        this.props.onClick("Success", "Details Updated Successfully.", 1);
        this.setState({ loader: false });
      })
      .catch(error => {
        this.setState({ loader: false });
        this.props.onClick("Error", error.message, 0);
      });
  };

  uploadedImageData = image_uuid => {
    this.setState({ image_uuid });
  };

  openNotification = (message, description, status) => {
    this.props.onClick(message, description, status);
  };

  render() {
    return (
      <div className="provider-information">
        <div className="row">
          <div className="provider-information-column col-12 col-sm-6">
            <div className="provider-information-wrapper">
              <h5>Edit provider Information</h5>

              <Form className="map-provider-form">
                <hr />
                <div className="row">
                  <div className="col-12">
                    <Form.Group>
                      <Form.Label>Display Picture</Form.Label>
                      <ImageUpload
                        uploadTitle="Photo"
                        onImageUpload={this.uploadedImageData}
                        image_url={this.state.image_url}
                        notification={this.openNotification}
                      />
                    </Form.Group>
                  </div>
                </div>

                <div className="row">
                  <div className="col-12 col-sm-6">
                    <Form.Group controlId="providerFirstName">
                      <Form.Label>Name</Form.Label>
                      <Form.Control
                        type="text"
                        value={this.state.name}
                        placeholder="Vikram"
                        onChange={e => this.setStateValues(e, "name")}
                      />
                    </Form.Group>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 col-sm-6">
                    <Form.Group controlId="providerFirstName">
                      <Form.Label>Contact Number</Form.Label>
                      <div className="d-flex justify-content-start">
                        {/* <Form.Control as='select' value={this.state.country_code} onChange={(e) => this.setStateValues(e, 'country_code')} style={{width : '60px', marginRight : '5px'}}>
                                {this.state.countryCodesList.map(code => {
                                  return <option value={code}>+{code}</option>
                                })}
                              </Form.Control> */}
                        <Form.Control
                          type="text"
                          value={this.state.mobile_number}
                          placeholder="9876543210"
                          onChange={e =>
                            this.setStateValues(e, "mobile_number")
                          }
                        />
                      </div>
                    </Form.Group>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 col-sm-6">
                    <Form.Group controlId="providerType">
                      <Form.Label>Type</Form.Label>
                      <Select
                        mode="tags"
                        placeholder="select one"
                        value={this.state.type}
                        onChange={value => this.setState({ type: value })}
                        style={{ minWidth: 300 }}
                      >
                        {this.state.providerTypeListData
                          ? this.state.providerTypeListData.map(t => {
                              return <Option value={t.type}>{t.type}</Option>;
                            })
                          : null}
                      </Select>
                    </Form.Group>
                  </div>
                </div>
                <Button
                  className="btn btn-primary"
                  onClick={e => this.updateProviderHandler(e)}
                >
                  Save Changes
                </Button>
              </Form>
            </div>
          </div>
        </div>
        {this.state.loader ? <PageLoader /> : null}
      </div>
    );
  }
}

const mapsStateToProps = state => ({
  user: state.user.user
});

export default connect(mapsStateToProps, {
  providerTypeList,
  updateProvider,
  updateResponder,
  updateResponderAvailibilty,
  getCountryCodesList
})(ExpandedRowRender);
