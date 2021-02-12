import React from 'react';
import ElderService from '../../service/ElderService';
import ElderBackgroundInfo from '../ElderBackgroundInfo';
import ElderMedicalDetails from '../ElderMedicalDetails';
import ElderOtherInfo from '../ElderOtherInfo';
import styles from './elder-medical-tab.scss';

class MedicalTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      elderId: this.props.currentElderIdentifier,
      elderBackGroundInfo: null,
      elderMedicalDetails: null,
      elderOtherInfo: null,
    };
    this.elderService = new ElderService();
  }

  componentDidMount() {
    this.props.startLoader();
    this.elderService
      .getElderFormData(this.props.currentElderIdentifier, 'af2')
      .then((response) => {
        if (response.data) {
          const { data } = response;
          this.setState({
            elderBackGroundInfo: data.background_info,
            elderMedicalDetails: data.medical_conditions,
            elderOtherInfo: data.other_info,
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
    return (
      <div className='medical-tab' style={styles}>
        <ElderBackgroundInfo
          {...this.props}
          formData={this.state.elderBackGroundInfo}
        />

        <ElderMedicalDetails
          {...this.props}
          formData={this.state.elderMedicalDetails}
        />

        <ElderOtherInfo {...this.props} formData={this.state.elderOtherInfo} />
      </div>
    );
  }

  componentWillUnmount() {}
}

export default MedicalTab;
