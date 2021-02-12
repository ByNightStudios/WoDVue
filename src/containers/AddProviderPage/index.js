import React from 'react';

import { Button, Form } from 'react-bootstrap';

import PageLoader from '../../components/PageLoader';
import SideNavigation from '../../components/SideNavigation';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { getRenderingHeader } from '../../common/helpers';
import { addResponder } from '../../actions/ResponderActions';
import { addProvider, providerTypeList } from '../../actions/ProviderActions';
import styles from './add-provider-page.scss';
import { notification, Select } from 'antd';
import { connect } from 'react-redux';
import requireAuth from '../../hoc/requireAuth';
import ImageUpload from '../../components/ImageUpload';
import { getCountryCodesList } from '../../actions/ConfigActions';
const { Option } = Select;
class AddProviderPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      navigationDeployed: true,
      name: null,
      mobile_number: null,
      type: null,
      location: null,
      loader: false,
      image_uuid: null,
      country_code: '91',
      countryCodesList: [],
      formatted_mobile_number: null,
      providerTypeListData: []
    };
  }

  componentDidMount() {
    document.title = 'Emoha Admin | Add a provider';
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

  uploadedImageData = image_uuid => {
    this.setState({ image_uuid });
  };

  handleNavigationToggle = () => {
    this.setState({ navigationDeployed: !this.state.navigationDeployed });
  };

  setStateValues = (e, field) => {
    let value = e.currentTarget.value;
    let state = this.state;
    state[`${field}`] = value;
    this.setState(state);
  };

  addProviderHandler = async e => {
    let { name, mobile_number, country_code } = this.state;

    if (name === null || name === '')
      return this.openNotification('Error', 'First name is required.', 0);
    if (mobile_number === null || mobile_number === '')
      return this.openNotification('Error', 'Mobile Number is required.', 0);

    mobile_number = mobile_number.replace(/-/g, '');

    let formatted_mobile_number = `+${country_code.replace(
      /-/g,
      ''
    )}${mobile_number}`;
    let regex = /^\+(?:[0-9] ?){6,14}[0-9]$/;

    if (!regex.test(formatted_mobile_number))
      return this.openNotification('Error', 'Mobile Number is invalid.', 0);

    await this.setState({
      loader: true,
      formatted_mobile_number,
      mobile_number
    });
    console.log(this.state);
    this.props
      .addProvider(this.state)
      .then(result => {
        this.openNotification('Success', 'Provider Added Successfully.', 1);
        this.props.history.push('/providers');
        this.setState({ loader: false });
      })
      .catch(error => {
        this.setState({ loader: false });
        this.openNotification('Error', error.message, 0);
      });
  };

  openNotification = (message, description, status) => {
    let style = { color: 'green' };
    if (!status)
      style = {
        color: 'red'
      };
    const args = {
      message,
      description,
      duration: 3,
      style
    };
    notification.open(args);
  };

  render() {
    const { navigationDeployed } = this.state;

    return (
      <React.Fragment>
        {getRenderingHeader(this.props.user)}
        <div
          className={
            navigationDeployed
              ? 'addelders-page sidebar-page sidebar-page--open position-relative'
              : 'addelders-page sidebar-page sidebar-page--closed position-relative'
          }
          style={styles}
        >
          {navigationDeployed ? (
            <SideNavigation handleClose={this.handleNavigationToggle} />
          ) : (
            <Button
              type='button'
              className='btn btn-trigger'
              onClick={this.handleNavigationToggle}
            >
              <FontAwesomeIcon icon={faCaretRight} size="2x" color="#780001"  />
            </Button>
          )}

          <main className='sidebar-page-wrapper position-relative'>
            <div className='internal-header'>
              <div className='internal-header-left'>
                <h2>Add a Provider</h2>
              </div>
            </div>
            <div className='internal-content'>
              <div className='row'>
                <div className='col-12 col-sm-8'>
                  <div className='form-container'>
                    <Form className='map-provider-form'>
                      <div className='row'>
                        <div className='col-12'>
                          <Form.Group controlId='providerFirstName'>
                            <Form.Label>Display Picture</Form.Label>
                            <ImageUpload
                              uploadTitle='Photo'
                              onImageUpload={this.uploadedImageData}
                              notification={this.openNotification}
                            />
                          </Form.Group>
                        </div>
                      </div>

                      <div className='row'>
                        <div className='col-12 col-sm-6'>
                          <Form.Group controlId='providerFirstName'>
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                              type='text'
                              placeholder='Vikram'
                              onChange={e => this.setStateValues(e, 'name')}
                            />
                          </Form.Group>
                        </div>
                      </div>
                      <div className='row'>
                        <div className='col-12 col-sm-6'>
                          <Form.Group controlId='providerFirstName'>
                            <Form.Label>Contact Number</Form.Label>
                            <div className='d-flex justify-content-start'>
                              {/* <Form.Control as='select' value={this.state.country_code} onChange={(e) => this.setStateValues(e, 'country_code')} style={{width : '60px', marginRight : '5px'}}>
                                {this.state.countryCodesList.map(code => {
                                  return <option value={code}>+{code}</option>
                                })}
                              </Form.Control> */}
                              <Form.Control
                                type='text'
                                placeholder='9876543210'
                                onChange={e =>
                                  this.setStateValues(e, 'mobile_number')
                                }
                              />
                            </div>
                          </Form.Group>
                        </div>
                      </div>
                      <div className='row'>
                        <div className='col-12 col-sm-6'>
                          <Form.Group controlId='providerType'>
                            <Form.Label>Type</Form.Label>
                            <Select
                              mode='tags'
                              placeholder='select one'
                              onChange={value => this.setState({ type: value })}
                              style={{ minWidth: 300 }}
                            >
                              {this.state.providerTypeListData
                                ? this.state.providerTypeListData.map(t => {
                                    return (
                                      <Option value={t.type}>{t.type}</Option>
                                    );
                                  })
                                : null}
                            </Select>
                          </Form.Group>
                        </div>
                      </div>

                      <Button
                        className='btn btn-primary'
                        onClick={e => this.addProviderHandler(e)}
                      >
                        Save
                      </Button>
                    </Form>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
        {/* ENABLE THIS PAGE LOADER CONDITIONALLY */}
        {this.state.loader ? <PageLoader /> : null}
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user.user
});

export default requireAuth(
  connect(mapStateToProps, {
    providerTypeList,
    addProvider,
    addResponder,
    getCountryCodesList
  })(AddProviderPage)
);
