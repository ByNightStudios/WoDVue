import React from 'react';
import moment from 'moment';
import { get, isEqual } from 'lodash';
import { Button, Form } from 'react-bootstrap';
import { TimePicker , Radio } from 'antd';
import { connect } from 'react-redux';
import KnowYourElderInfoManager, { stateLableMapping } from './dataManager';
import styles from './know-elder.scss';
import { checkIsErmOrErmSuperVisor } from '../../utils/checkElderEditPermission';

class KnowYourElderInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: 'elder_info',
      formData: {
        previousJob: '',
        preferredCallTime: moment().format('YYYY-MM-DD 00:00 A'),
        favouriteFood: '',
        hobbies: '',
        music: '',
        tv: '',
        facebook: '',
        twitter: '',
        instagram: '',
        others_social: '',
        adminName: '',
        adminId : '',
        dateOfFilling: moment().format('YYYY-MM-DD hh:mm A'),
        mohTvInstalled : ''
      },
    };
    this.KnowYourElderInfoManager = new KnowYourElderInfoManager();
    this.stateLableMapping = stateLableMapping;
  }

  componentDidMount() {
    if (this.props.formData !== null) {
      this.setState({
        formData: this.props.formData,
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (!isEqual(prevProps.formData, this.props.formData)) {
      this.setState({
        formData: this.props.formData,
      });
    }
  }

  submitData = () => {
    const { type } = this.state;
    const formData = Object.assign({}, this.state.formData);
    formData.adminId = this.props.user.id;
    formData.adminName = this.props.user.full_name;
    const { validated, label } = this.KnowYourElderInfoManager.validate(
      formData
    );
    if (!validated) {
      const value = this.stateLableMapping[label];
      this.props.openNotification('Error!', `Please fill the ${value}`, 0);
    } else {
      this.props.startLoader();
      const finalPayload = {
        column: type,
        elder_id: this.props.currentElderIdentifier,
        data: formData,
      };
      this.KnowYourElderInfoManager.updateElderInfo(finalPayload)
        .then((response) => {
          this.props.stopLoader();
          this.props.openNotification(
            'Success!',
            `Form Fields Updated Successfully`,
            1
          );
        })
        .catch((errorData) => {
          this.props.stopLoader();
          this.props.openNotification(
            'Error!',
            errorData.response.data.message,
            0
          );
        });
    }
  };

  setStateValues = (e, item) => {
    let formData = Object.assign({}, this.state.formData);
    let value = '';
    switch (item) {
      case 'dob':
      case 'preferredCallTime':
        if (e !== null) {
          value = moment(e._d).format('YYYY-MM-DD hh:mm A');
        } else {
          value = moment().format('YYYY-MM-DD 00:00 A');
        }
        break;
      case 'mohTvInstalled':
        value = e.target.value;
        break;
      default:
        value = e.currentTarget.value;
    }
    formData[item] = value;
    this.setState((state) => ({
      ...state,
      formData: formData,
    }));
  };

  render() {
    const { formData } = this.state;
    return (
      <div className='elder-kye' style={styles}>
        <h4>Know Your Elder</h4>
        <div className='elder-kye-form'>
          <div className='form-wrapper'>
            <div className='row'>
              <div className='col-12 col-sm-6'>
                <Form.Group controlId='previousJob'>
                  <Form.Label>Previous Job</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Previous Job'
                    value={get(formData, 'previousJob', '')}
                    onChange={(e) => this.setStateValues(e, 'previousJob')}
                    disabled={checkIsErmOrErmSuperVisor(this.props.user, this.props.elderData)}
                  />
                </Form.Group>
                <Form.Group controlId='morningCallTime'>
                  <Form.Label>Preferred call time</Form.Label>
                  <div className='form-timepicker'>
                    <TimePicker
                      use12Hours
                      format='HH:mm A'
                      value={
                        formData && formData.preferredCallTime
                          ? moment(
                              formData.preferredCallTime,
                              'YYYY-MM-DD HH:mm A'
                            )
                          : null
                      }
                      onChange={(e) =>
                        this.setStateValues(e, 'preferredCallTime')
                      }
                      disabled={checkIsErmOrErmSuperVisor(this.props.user, this.props.elderData)}
                    />
                  </div>
                </Form.Group>
                <Form.Group controlId='favouriteFood'>
                  <Form.Label>Favourite Food</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Favourite Food'
                    value={get(formData, 'favouriteFood', '')}
                    onChange={(e) => this.setStateValues(e, 'favouriteFood')}
                    disabled={checkIsErmOrErmSuperVisor(this.props.user, this.props.elderData)}
                  />
                </Form.Group>
                <Form.Group controlId='hobbies'>
                  <Form.Label>Hobbies</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Hobbies'
                    value={get(formData, 'hobbies', '')}
                    onChange={(e) => this.setStateValues(e, 'hobbies')}
                    disabled={checkIsErmOrErmSuperVisor(this.props.user, this.props.elderData)}
                  />
                </Form.Group>
                <Form.Group controlId='music'>
                  <Form.Label>Favourite Music</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Favourite Music'
                    value={get(formData, 'music', '')}
                    onChange={(e) => this.setStateValues(e, 'music')}
                    disabled={checkIsErmOrErmSuperVisor(this.props.user, this.props.elderData)}
                  />
                </Form.Group>
                <Form.Group controlId='tv'>
                  <Form.Label>Favourite TV Shows</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Favourite TV Shows'
                    value={get(formData, 'tv', '')}
                    onChange={(e) => this.setStateValues(e, 'tv')}
                    disabled={checkIsErmOrErmSuperVisor(this.props.user, this.props.elderData)}
                  />
                </Form.Group>
              </div>
            </div>
          </div>
          <div className='form-wrapper'>
            <h6>Social Media</h6>
            <div className='row'>
              <div className='col-12 col-sm-6'>
                <Form.Group controlId='facebook'>
                  <Form.Label>Facebook</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Facebook Username'
                    value={get(formData, 'facebook', '')}
                    onChange={(e) => this.setStateValues(e, 'facebook')}
                    disabled={checkIsErmOrErmSuperVisor(this.props.user, this.props.elderData)}
                  />
                </Form.Group>

                <Form.Group controlId='instagram'>
                  <Form.Label>Instagram</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Instagram'
                    value={get(formData, 'instagram', '')}
                    onChange={(e) => this.setStateValues(e, 'instagram')}
                    disabled={checkIsErmOrErmSuperVisor(this.props.user, this.props.elderData)}
                  />
                </Form.Group>

                <Form.Group controlId='twitter'>
                  <Form.Label>Twitter</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Twitter'
                    value={get(formData, 'twitter', '')}
                    onChange={(e) => this.setStateValues(e, 'twitter')}
                    disabled={checkIsErmOrErmSuperVisor(this.props.user, this.props.elderData)}
                  />
                </Form.Group>

                <Form.Group controlId='others'>
                  <Form.Label>Others Social Profile</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Others'
                    value={get(formData, 'others_social', '')}
                    onChange={(e) => this.setStateValues(e, 'others_social')}
                    disabled={checkIsErmOrErmSuperVisor(this.props.user, this.props.elderData)}
                  />
                </Form.Group>

                <Form.Group controlId='mohTvInstalled'>
                <Form.Label>Moh Tv Installed</Form.Label>
                <div className='form-multicheck form-multicheck-spaced'>
                <Radio.Group
                  onChange={(e) => this.setStateValues(e, 'mohTvInstalled')}
                  value={get(formData, 'mohTvInstalled', '')}
                  disabled={checkIsErmOrErmSuperVisor(this.props.user, this.props.elderData)}
                >
                  <Radio value={'yes'}>Yes</Radio>
                  <Radio value={'no'}>No</Radio>
                </Radio.Group>
                </div>
                </Form.Group>
              </div>
            </div>
          </div>
          <Button
            type='button'
            className='btn btn-primary'
            onClick={(event) => this.submitData()}
            disabled={checkIsErmOrErmSuperVisor(this.props.user, this.props.elderData)}
          >
            Save
          </Button>
        </div>
      </div>
    );
  }

  componentWillUnmount() {}
}

const mapStateToProps = (state) => ({
  user: state.user.user,
  elderData: state.elder.elderData,
});

export default connect(mapStateToProps, {})(KnowYourElderInfo);
