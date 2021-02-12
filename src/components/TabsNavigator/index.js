import React from 'react';
import { Tabs } from 'antd';
import { StickyContainer, Sticky } from 'react-sticky';

import GeneralTab from '../GeneralTab';
import ElderTeamMembers from '../ElderTeamMembers';
import EmergencyTab from '../EmergencyTab';
import RequestsTab from '../RequestsTab';
import PlansTab from '../PlansTab';
import ElderSocialTab from '../ElderSocialTab';
import MedicalTab from '../MedicalTab';
import NotesTab from '../NotesTab';
import DocumentationTab from '../DocumentationTab';
import ElderRecords from '../ElderRecord/index';
import FriendsTab from '../FriendsTab';
import VirtualHouseMapping from '../VirtualHouseMapping';
import Sensor from '../ElderDetails/Sensor';
import ElderService from '../../service/ElderService';
import SocialTab from '../../containers/SocialTab';
import OpsTab from '../../containers/OpsContainer';
import './tabs-navigator.scss';

const { TabPane } = Tabs;

const renderTabBar = (props, DefaultTabBar) => (
  <Sticky bottomOffset={80}>
    {({ style }) => (
      <DefaultTabBar
        {...props}
        className="site-custom-tab-bar"
        style={{ ...style }}
      />
    )}
  </Sticky>
);

export default class TabsNavigator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 1,
      virtualHouseMapping: null,
    };
    this.elderService = new ElderService();
  }

  componentDidMount() {
    const id = this.props.currentElderIdentifier;
    this.elderService
      .getElderFormData(id, 'af5')
      .then(response => {
        if (response.data) {
          this.setState({
            virtualHouseMapping: response.data.virtual_house_mapping
          });
        }
      })
      .catch(errorData => {
        this.props.openNotification(
          'Error!',
          errorData.response.data.message,
          0,
        );
      });
  }

  render() {
    return (
      <StickyContainer>
        <Tabs
          defaultActiveKey={this.state.activeTab}
          renderTabBar={renderTabBar}
          type="card"
        >
          <TabPane
            tab="General"
            key="1"
            style={{ height: 600, overflow: 'auto', padding: 20 }}
          >
            <GeneralTab {...this.props} />
          </TabPane>
          <TabPane
            tab="Team Allocation"
            key="13"
            style={{ height: 600, overflow: 'auto', padding: 20 }}
          >
            <ElderTeamMembers {...this.props} />
          </TabPane>
          <TabPane
            tab="Emergency"
            key="2"
            style={{ height: 600, overflow: 'auto', padding: 20 }}
          >
            <EmergencyTab {...this.props} />
          </TabPane>
          <TabPane
            tab="Virtual House Mapping"
            key="12"
            style={{ height: 600, overflow: 'auto', padding: 20 }}
          >
            <VirtualHouseMapping
              {...this.props}
              formData={this.state.virtualHouseMapping}
            />
          </TabPane>
          <TabPane
            tab="Medical"
            key="3"
            style={{ height: 600, overflow: 'auto', padding: 20 }}
          >
            <MedicalTab {...this.props} />
          </TabPane>
          <TabPane
            tab="Requests"
            key="4"
            style={{ height: 600, overflow: 'auto', padding: 20 }}
          >
            <RequestsTab {...this.props} />
          </TabPane>
          <TabPane
            tab="Plans"
            key="5"
            style={{ height: 600, overflow: 'auto', padding: 20 }}
          >
            <PlansTab {...this.props} />
          </TabPane>
          <TabPane
            tab="Social"
            key="6"
            style={{ height: 600, overflow: 'auto', padding: 20 }}
          >
            <ElderSocialTab {...this.props} />
          </TabPane>
          <TabPane
            tab="SocialNEW"
            key="16"
            style={{ height: 600, overflow: 'auto', padding: 20 }}
          >
            <SocialTab {...this.props} />
          </TabPane>
          <TabPane
            tab="Notes"
            key="7"
            style={{ height: 600, overflow: 'auto', padding: 20 }}
          >
            <NotesTab {...this.props} />
          </TabPane>
          <TabPane
            tab="Documents"
            key="8"
            style={{ height: 600, overflow: 'auto', padding: 20 }}
          >
            <ElderRecords {...this.props} />
          </TabPane>
          <TabPane
            tab="Documentation"
            key="9"
            style={{ height: 500, overflow: 'auto', padding: 20 }}
          >
            <DocumentationTab {...this.props} />
          </TabPane>
          <TabPane tab="Friends" key="10" style={{ padding: 20 }}>
            <FriendsTab {...this.props} />
          </TabPane>
          <TabPane
            tab="Sensor"
            key="11"
            style={{ height: 500, overflow: 'auto', padding: 20 }}
          >
            <Sensor {...this.props} />
          </TabPane>
          <TabPane
            tab="Operations"
            key="14"
            style={{ height: 600, overflow: 'auto', padding: 20 }}
          >
            <OpsTab {...this.props} />
          </TabPane>
        </Tabs>
      </StickyContainer>
    );
  }

  componentWillUnmount() { }
}
