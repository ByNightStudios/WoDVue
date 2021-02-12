import React, { Component } from 'react';
import * as _ from 'lodash';
import { Button, Form } from 'react-bootstrap';
import { Checkbox, Radio } from 'antd';
import { connect } from 'react-redux';
import ElderEmergencyCovidManager from './dataManager';
import { checkIsErmOrErmSuperVisor } from '../../utils/checkElderEditPermission';
import Styles from './styles.scss';

class ElderEmergencyCovid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: 'covid_assessment',
      formData: {
        covidPatientContact: 'No',
        severeBreathingDifficulty: 'No',
        severeChestPain: 'No',
        hardTimeWaking: 'No',
        feelingConfused: 'No',
        lostConsciousness: 'No',
      },
    };
    this.elderEmergencyCovidManager = new ElderEmergencyCovidManager();
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
    const formData = Object.assign({}, this.state.formData);
    let value = '';
    if (item) {
      value = e.target.value;
    }
    formData[item] = value;
    this.setState(state => ({
      ...state,
      formData,
    }));
  };

  submitCovidData = () => {
    const { formData, type } = this.state;

    const Payload = {
      elder_id: this.props.currentElderIdentifier,
      column: type,
      data: formData,
    };

    this.props.startLoader();

    this.elderEmergencyCovidManager
      .updateElderFormData(Payload)
      .then(response => {
        this.props.stopLoader();
        this.props.openNotification(
          'Success!',
          `Form Fields Updated Successfully`,
          1,
        );
      })
      .catch(errorData => {
        this.props.stopLoader();
        this.props.openNotification(
          'Error!',
          errorData.response.data.message,
          0,
        );
      });
  };

  render() {
    const { formData } = this.state;
    return (
      <div className="elder-covid">
        <h4>Elder Covid Assessment</h4>
        <Form.Group controlId="PatientContact">
          <Form.Label>Have you come in contact with Covid Patient?</Form.Label>
          <div>
            <Radio.Group
              onChange={e => this.setStateValues(e, 'covidPatientContact')}
              value={_.get(formData, 'covidPatientContact', 'No')}
              disabled={checkIsErmOrErmSuperVisor(
                this.props.user,
                this.props.elderData,
              )}
            >
              <Radio value="Yes">Yes</Radio>
              <Radio value="No">No</Radio>
            </Radio.Group>
          </div>
        </Form.Group>
        <Form.Group controlId="StruggleBreathe">
          <Form.Label>
            Severe difficulty breathing? (for example:- struggling for each
            breath, speaking in single words etc.)
          </Form.Label>
          <div>
            <Radio.Group
              onChange={e =>
                this.setStateValues(e, 'severeBreathingDifficulty')
              }
              value={_.get(formData, 'severeBreathingDifficulty', 'No')}
              disabled={checkIsErmOrErmSuperVisor(
                this.props.user,
                this.props.elderData,
              )}
            >
              <Radio value="Yes">Yes</Radio>
              <Radio value="No">No</Radio>
            </Radio.Group>
          </div>
        </Form.Group>
        <Form.Group controlId="ChestPain">
          <Form.Label>Severe chest pain?</Form.Label>
          <div>
            <Radio.Group
              onChange={e => this.setStateValues(e, 'severeChestPain')}
              value={_.get(formData, 'severeChestPain', 'No')}
              disabled={checkIsErmOrErmSuperVisor(
                this.props.user,
                this.props.elderData,
              )}
            >
              <Radio value="Yes">Yes</Radio>
              <Radio value="No">No</Radio>
            </Radio.Group>
          </div>
        </Form.Group>{' '}
        <Form.Group controlId="WakingUp">
          <Form.Label>Having a very hard time waking up?</Form.Label>
          <div>
            <Radio.Group
              onChange={e => this.setStateValues(e, 'hardTimeWaking')}
              value={_.get(formData, 'hardTimeWaking', 'No')}
              disabled={checkIsErmOrErmSuperVisor(
                this.props.user,
                this.props.elderData,
              )}
            >
              <Radio value="Yes">Yes</Radio>
              <Radio value="No">No</Radio>
            </Radio.Group>
          </div>
        </Form.Group>{' '}
        <Form.Group controlId="FeelingConfused">
          <Form.Label>Feeling confused ?</Form.Label>
          <div>
            <Radio.Group
              onChange={e => this.setStateValues(e, 'feelingConfused')}
              value={_.get(formData, 'feelingConfused', 'No')}
              disabled={checkIsErmOrErmSuperVisor(
                this.props.user,
                this.props.elderData,
              )}
            >
              <Radio value="Yes">Yes</Radio>
              <Radio value="No">No</Radio>
            </Radio.Group>
          </div>
        </Form.Group>{' '}
        <Form.Group controlId="Consciousness">
          <Form.Label>Loss of consciousness?</Form.Label>
          <div>
            <Radio.Group
              onChange={e => this.setStateValues(e, 'lostConsciousness')}
              value={_.get(formData, 'lostConsciousness', 'No')}
              disabled={checkIsErmOrErmSuperVisor(
                this.props.user,
                this.props.elderData,
              )}
            >
              <Radio value="Yes">Yes</Radio>
              <Radio value="No">No</Radio>
            </Radio.Group>
          </div>
        </Form.Group>
        <Button
          type="button"
          className="btn btn-primary"
          onClick={event => this.submitCovidData()}
          disabled={checkIsErmOrErmSuperVisor(
            this.props.user,
            this.props.elderData,
          )}
        >
          Save
        </Button>
      </div>
    );
  }

  componentWillUnmount() {}
}

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ElderEmergencyCovid);
