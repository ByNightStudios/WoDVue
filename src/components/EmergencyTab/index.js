import React from 'react';
import { get } from 'lodash';
import ElderService from '../../service/ElderService';
import EmergencyContacts from '../EmergencyContacts';
import ElderEmergencyRequests from '../ElderEmergencyRequests';
import ElderEmergencyCovid from '../ElderEmergencyCovid';
import styles from './emergency-tab.scss';

class EmergencyTab extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      elderEmergencyCovid: null,
      virtualHouseMapping: null,
    };
    this.elderService = new ElderService();
  }

  componentDidMount() {
    const id = this.props.currentElderIdentifier;
    this.props.startLoader();
    this.elderService
      .getElderFormData(id, 'af5')
      .then((response) => {
        if (response.data) {
          this.setState({
            elderEmergencyCovid: get(response, 'data.covid_assessment', null),
            virtualHouseMapping: get(
              response,
              'data.virtual_house_mapping',
              null
            ),
          });
        }

        this.props.stopLoader();
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

  render() {
    const { elderEmergencyCovid } = this.state;
    return (
      <div className='emergency-tab' style={styles}>
        <EmergencyContacts {...this.props} />
        <ElderEmergencyRequests {...this.props} />
        <ElderEmergencyCovid {...this.props} formData={elderEmergencyCovid} />
      </div>
    );
  }

  componentWillUnmount() { }
}

export default EmergencyTab;
