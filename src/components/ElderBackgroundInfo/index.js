import React from 'react';
import * as _ from 'lodash';

import { Button, Form } from 'react-bootstrap';
import { Select } from 'antd';
import { connect } from 'react-redux';

import ElderBackGroundInfoManager, { stateLableMapping } from './dataManager';

import styles from './elder-background-info.scss';
import { checkForMedicalTab } from '../../utils/checkElderEditPermission';

class ElderBackgroundInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: 'background_info',
      formData: {
        heightFt: '',
        heightIn: '',
        weight: '',
      },
    };

    this.elderBackGroundInfoManager = new ElderBackGroundInfoManager();

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
    let formData = Object.assign({}, this.state.formData);
    let value = '';
    switch (item) {
      case 'bloodGroup':
        value = e;
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

  submitData = () => {
    const { formData, type } = this.state;
    const { validated, label } = this.elderBackGroundInfoManager.validate(
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
      this.elderBackGroundInfoManager
        .updateBackGroundInfo(finalPayload)
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
    const { Option } = Select;
    const { elderData} = this.props;
    return (
      <div className='elder-background' style={styles}>
        <h4>Elder Background Info</h4>
        <div className='row'>
          <div className='col-12 col-sm-6'>
            <Form.Group controlId='weight'>
              <Form.Label>Blood Group</Form.Label>
              <Form.Control
                type='text'
                placeholder='Choose a Blood Group in General Tab'
                disabled
                value={_.get(this.props.elderData, 'owner.blood_group', '')}
              />
            </Form.Group>
            <Form.Group controlId='height'>
              <Form.Label>Height (ft/in)</Form.Label>
              <div className='field-row'>
                <Form.Control
                  type='text'
                  placeholder='Feet'
                  value={_.get(formData, 'heightFt', '')}
                  onChange={(e) => this.setStateValues(e, 'heightFt')}
                  disabled={checkForMedicalTab(this.props.user, elderData)}
                />
                <Form.Control
                  type='text'
                  placeholder='Inches'
                  value={_.get(formData, 'heightIn', '')}
                  onChange={(e) => this.setStateValues(e, 'heightIn')}
                  disabled={checkForMedicalTab(this.props.user, elderData)}
                />
              </div>
            </Form.Group>
            <Form.Group controlId='weight'>
              <Form.Label>Weight (KG)</Form.Label>
              <Form.Control
                type='text'
                placeholder='Weight'
                value={_.get(formData, 'weight', '')}
                onChange={(e) => this.setStateValues(e, 'weight')}
                disabled={checkForMedicalTab(this.props.user, elderData)}
              />
            </Form.Group>
            <Button
              type='button'
              className='btn btn-primary'
              onClick={(event) => this.submitData()}
              disabled={checkForMedicalTab(this.props.user, elderData)}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    );
  }

  componentWillUnmount() {}
}

const mapStateToProps = (state) => ({
  elderData: state.elder.elderData,
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ElderBackgroundInfo);
