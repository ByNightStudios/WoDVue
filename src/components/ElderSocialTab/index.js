import React from 'react';
import styles from './elder-social-tab.scss';
import ElderPersonalDetails from '../ElderPersonalDetails';
import ElderFamilyDetails from '../ElderFamilyDetails';
import KnowYourElderInfo from '../KnowYourElderInfo';
import ElderService from '../../service/ElderService';

class ElderSocialTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      elderId: this.props.currentElderIdentifier,
      personalDetails: null,
      familyDetails: null,
      elderInfo: null,
    };
    this.elderService = new ElderService();
  }

  componentDidMount() {
    this.props.startLoader();
    this.elderService
      .getElderFormData(this.props.currentElderIdentifier, 'af3')
      .then((response) => {
        if (response.data) {
          const { data } = response;
          this.setState({
            personalDetails: data.personal_details,
            familyDetails: data.family_details,
            elderInfo: data.elder_info,
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
      <div className='social-tab' style={styles}>
        <ElderPersonalDetails
          {...this.props}
          formData={this.state.personalDetails}
        />
        <ElderFamilyDetails
          {...this.props}
          formData={this.state.familyDetails}
        />
        <KnowYourElderInfo {...this.props} formData={this.state.elderInfo} />
      </div>
    );
  }

  componentWillUnmount() {}
}

export default ElderSocialTab;
