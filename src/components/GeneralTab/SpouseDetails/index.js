import React from "react";
import { Descriptions, Skeleton } from "antd";
import moment from 'moment';
import { Link } from "react-router-dom";
import { get, find } from "lodash";
import './style.scss'

function SpouseDetails({ loading, elderData }) {
  const spouseData = find(get(elderData, 'user_relationships',[]), {relationship: 'Spouse'});
  function renderData(data) {
    if (loading) {
      return <Skeleton active loading paragraph={{ rows: 1, width: 200 }} />;
    }
    if (data) {
      return data;
    }
    return "No data found";
  }

  
  function renderAge(birthDate, otherDate) {
    if (loading) {
      return <Skeleton active loading paragraph={{ rows: 1, width: 200 }} />;
    }
    birthDate = new Date(birthDate);
    otherDate = new Date(otherDate);

    var years = otherDate.getFullYear() - birthDate.getFullYear();

    if (
      otherDate.getMonth() < birthDate.getMonth() ||
      (otherDate.getMonth() == birthDate.getMonth() &&
        otherDate.getDate() < birthDate.getDate())
    ) {
      years--;
    }

    if(years) {
      return `${years} years`;
    }
    return "No data found";
  }

  return (
    <Descriptions
      title="Spouse Details"
      bordered
      column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
      className="elder-member-plan-details"
    >
      <Descriptions.Item label="Marital Details" span={4}>
        {renderData(get(elderData, "owner.marital_details"))}
      </Descriptions.Item>
      <Descriptions.Item label="Name of spouse" span={4}>
      {renderData(get(spouseData, "details.full_name"))}
      </Descriptions.Item>
      <Descriptions.Item label="Passed away date" span={4}>
        {moment(get(elderData, "date_of_away",'')).format("MM/DD/YYYY")}
      </Descriptions.Item>
      <Descriptions.Item label="Age of spouse" span={4}>
      {renderAge(
          moment(get(spouseData, "details.userableConsumer.dob_object",'')).format("MM/DD/YYYY"),
          moment().format("MM/DD/YYYY")
        )}
      </Descriptions.Item>
      <Descriptions.Item label="Date of Birth" span={4}>
        {renderData(moment(get(spouseData, "details.userableConsumer.dob_object",'')).format("DD/MM/YYYY"))}
      </Descriptions.Item>
      <Descriptions.Item label="Spouse phone number" span={4}>
        {renderData(get(spouseData, "details.mobile_number"))}
      </Descriptions.Item>
    </Descriptions>
  );
}

export default SpouseDetails;
