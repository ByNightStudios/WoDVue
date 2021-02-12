import React from "react";
import { Descriptions, Skeleton } from "antd";
import { get, isEmpty, filter } from "lodash";
import moment from 'moment';
import './style.scss'

function MemberShipPlanDetails({ loading, elderData }) {
  const planData = get(elderData, 'owner.plan[0]', '');

  function renderData(data) {
    if (loading) {
      return <Skeleton active loading paragraph={{ rows: 1, width: 200 }} />;
    }
    if (data) {
      return data;
    }
    return "No data found";
  }

  function renderStatus(data){
    if(data === 0 || data === '0'){
      return "Created"
    }
    if(data === 1 || data === '1'){
      return "Active"
    }
    if(data === 2 || data === '2'){
      return "Expired"
    }
    if(data === 3 || data === '3'){
      return "Failed"
    }
    if(data === 4 || data === '4'){
      return "On Hold"
    }
    return "InActive"
  }

  function renderDate(data){
    if(data){
      return data
    }
    return 'N/A';
  }

  return (
    <Descriptions
      title="MemberShip Plans"
      bordered
      column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
      className="elder-member-plan-details"
    >
      <Descriptions.Item label="Plan Name" span={4}>
        {renderData(get(planData, "name", "N/A"))}
      </Descriptions.Item>
      <Descriptions.Item label="Plan Status" span={4}>
        {renderStatus(get(planData, "status","N/A"))}
      </Descriptions.Item>
      <Descriptions.Item label="Date Of Start" span={4}>
        {renderDate(get(planData, "service_initiation_date", ""))}
      </Descriptions.Item>
      <Descriptions.Item label="Date of Expiry" span={4}>
        {renderDate(get(planData, "expiry_date", ""))}
      </Descriptions.Item>
      <Descriptions.Item label="Plan purhased by" span={4}>
        {renderData(get(elderData, "owner.plan_purchased_by"))}
      </Descriptions.Item>
      <Descriptions.Item label="Plan Duration" span={4}>
        {renderData(get(planData, "duration","0"))}
      </Descriptions.Item>
      <Descriptions.Item label="Plan Source" span={4}>
        {renderData(get(planData, "source"))}
      </Descriptions.Item>

      {/* +1 here indication along with elder */}
      <Descriptions.Item label="No of Members Enrolled" span={4}>
        {filter(get(elderData, 'user_relationships',[]), {relationship: 'Spouse'}).length + 1}
      </Descriptions.Item>
    </Descriptions>
  );
}

export default MemberShipPlanDetails;
