import React from 'react';
import { get } from 'lodash';
import { Row, Col } from 'antd';
import ZohoTabular from '../ZohoTabular';
import ElderDetails from '../ElderDetails';
import FamilyMembers from '../FamilyMembers';
import ManageAddresses from '../ManageAddresses';
import ElderData from './ElderData';
import styles from './general-tab.scss';
import ContactDetails from './ContactDetail';
import MemberShipPlanDetails from './MemberShipPlanDetails';
import SpouseDetails from './SpouseDetails';
import PreferencesSection from './PreferencesTab';
import InsuranceDetailsCGHS from './InsuranceDetailsCGHS';
import InsuranceDetailsPrivate from './InsuranceDetailsPrivate';

class GeneralTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() { }

  render() {
    return (
      <div className="general-tab" style={styles}>
        <Row gutter={[16, 16]}>
          <Col xs={24}
            sm={24}
            md={24}
            lg={12}
            xl={12}
          >
            <ElderData
              {...this.props}
              elderApiData={this.props.elderData}
              loading={this.props.link}
              zohoElderData={get(this.props, 'elderData.zoho_object')}
            />
          </Col>

          <Col xs={24}
            sm={24}
            md={24}
            lg={12}
            xl={12}
          >
            <ElderDetails {...this.props} />
          </Col>
        </Row>

        <div className="d-flex flex-row flex-wrap align-items-start justify-content-between w-100 h-100">
          <ContactDetails
            {...this.props}
            elderData={this.props.elderData}
            zohoElderData={get(this.props, 'elderData.zoho_object')}
          />
          <MemberShipPlanDetails {...this.props} />
        </div>
        <div className="d-flex flex-row flex-wrap align-items-start justify-content-between w-100 h-100">
          <SpouseDetails {...this.props} />
        </div>
        <div
          className="d-flex flex-row flex-wrap align-items-start justify-content-between w-100 h-100"
          style={{ marginTop: 30 }}
        >
          <PreferencesSection {...this.props}
            elderData={this.props.elderData}
            zohoElderData1={get(this.props, 'elderData.zoho_object')} />
          <InsuranceDetailsCGHS {...this.props}
            elderData={this.props.elderData}
            zohoElderData={get(this.props, 'elderData.zoho_object')} />
        </div>
        <div
          className="d-flex flex-row align-items-start justify-content-between w-100 h-100"
          style={{ marginTop: 30 }}
        >
          <InsuranceDetailsPrivate {...this.props}
            elderData1={this.props.elderData}
            zohoElderData={get(this.props, 'elderData.zoho_object')} />
        </div>
        <FamilyMembers {...this.props} />
        <ManageAddresses {...this.props} />
        <ZohoTabular {...this.props} />
      </div >
    );
  }

  componentWillUnmount() { }
}

export default GeneralTab;
