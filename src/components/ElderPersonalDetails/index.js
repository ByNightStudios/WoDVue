import React from 'react';
import { Button, Form } from 'react-bootstrap';
import { DatePicker } from 'antd';
import * as _ from 'lodash';
import moment from 'moment';
import { connect } from 'react-redux';
import ElderPersonalDetailsManager, { stateLableMapping } from './dataManager';
import { checkIsErmOrErmSuperVisor } from '../../utils/checkElderEditPermission';

class ElderPersonalDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: 'personal_details',
      formData: {
        spouseName: '',
        spouseDob: null,
        anniversary: null,
      },
    };
    this.ElderPersonalDetailsManager = new ElderPersonalDetailsManager();
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
    if (!_.isEqual(prevProps.formData, this.props.formData)) {
      this.setState({
        formData: this.props.formData,
      });
    }
  }

  setStateValues = (e, item) => {
    let value = '';
    if (item === 'spouseDob' || item === 'dob' || item === 'anniversary') {
      if (e !== null) {
        value = moment(e._d).format('YYYY-MM-DD 00:00:00');
      } else {
        value = moment().format('YYYY-MM-DD 00:00:00');
      }
    } else {
      value = e.currentTarget.value;
    }
    let formData = Object.assign({}, this.state.formData);
    formData[item] = value;
    this.setState((state) => ({
      ...state,
      formData: formData,
    }));
  };

  submitData = () => {
    const { formData } = this.state;
    const { validated, label } = this.ElderPersonalDetailsManager.validate(
      formData
    );

    if (!validated) {
      const value = this.stateLableMapping[label];
      this.props.openNotification('Error!', `Please fill the ${value}`, 0);
    } else {
      const finalPayload = {
        column: this.state.type,
        elder_id: this.props.currentElderIdentifier,
        data: formData,
      };

      this.props.startLoader();

      this.ElderPersonalDetailsManager.updateElderPersonalDetails(finalPayload)
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

  render() {
    const { formData } = this.state;

    return (
      <div className='elder-personal'>
        <h4>Personal Details</h4>

        <div className='elder-personal-form'>
          <div className='row'>
            <div className='col-12 col-sm-6'>
              <Form.Group controlId='elderSpouseName'>
                <Form.Label>Elder's Spouse Name</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Spouse Name'
                  value={_.get(formData, 'spouseName', '')}
                  onChange={(e) => this.setStateValues(e, 'spouseName')}
                  disabled={checkIsErmOrErmSuperVisor(this.props.user, this.props.elderData)}
                />
              </Form.Group>

              <Form.Group controlId='spouseDob'>
                <Form.Label>Elder's Spouse DOB</Form.Label>

                <DatePicker
                  value={
                    formData && formData.spouseDob
                      ? moment(formData.spouseDob, 'YYYY-MM-DD HH:mm A')
                      : null
                  }
                  onChange={(e) => this.setStateValues(e, 'spouseDob')}
                  disabledDate={(value) => value.isAfter(moment())}
                  disabled={checkIsErmOrErmSuperVisor(this.props.user, this.props.elderData)}
                />
              </Form.Group>
              <Form.Group controlId='anniversary'>
                <Form.Label>Anniversary</Form.Label>
                <DatePicker
                  value={
                    formData && formData.anniversary
                      ? moment(formData.anniversary, 'YYYY-MM-DD HH:mm A')
                      : null
                  }
                  onChange={(e) => this.setStateValues(e, 'anniversary')}
                  disabled={checkIsErmOrErmSuperVisor(this.props.user, this.props.elderData)}
                />
              </Form.Group>
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
        </div>
      </div>
    );
  }

  componentWillUnmount() {}
}

export default ElderPersonalDetails;
