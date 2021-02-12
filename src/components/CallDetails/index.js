import React from "react";
import PropTypes from "prop-types";
import { map } from "lodash";
import { Descriptions, Typography, Divider } from "antd";
import "./style.scss";

const { Title } = Typography;

const CallDetailsCard = ({ data }) => {
  const {
    id,
    request_id,
    requestId,
    monitorUCID,
    UUI,
    Did,
    CampaignName,
    Location,
    CallerID,
    PhoneName,
    Skill,
    StartTime,
    EndTime,
    TimeToAnswer,
    CallDuration,
    Duration,
    FallBackRule,
    DialedNumber,
    Type,
    AgentID,
    AgentPhoneNumber,
    AgentUniqueID,
    AgentName,
    Disposition,
    HangupBy,
    Status,
    AudioFile,
    TransferType,
    TransferredTo,
    Comments,
    DialStatus,
    Apikey,
    AgentStatus,
    CustomerStatus,
    UserName,
    CallerConfAudioFile,
    ConfDuration,
    CampaignStatus,
    created_at,
    updated_at,
  } = data;
  return (
    <Descriptions title={`${StartTime} - ${EndTime}`} bordered className="call_details">
      <Descriptions.Item label="Status" span={2}>{Status}</Descriptions.Item>
      <Descriptions.Item label="Caller Id" span={2}>{CallerID}</Descriptions.Item>
      <Descriptions.Item label="Phone Name" span={2}>{PhoneName}</Descriptions.Item>
      <Descriptions.Item label="Start Time" span={2}>{StartTime}</Descriptions.Item>
      <Descriptions.Item label="End Time" span={2}>
        {EndTime}
      </Descriptions.Item>
      <Descriptions.Item label="Time To Answer" span={2}>
        {TimeToAnswer}
      </Descriptions.Item>
      <Descriptions.Item label="Call Duration" span={2}>
        {CallDuration}
      </Descriptions.Item>
      <Descriptions.Item label="Agent Name" span={2}>
        {AgentName}
      </Descriptions.Item>
      <Descriptions.Item label="Audio" span={2}>
        <audio controls>
          <source src={AudioFile} type="audio/mpeg" />
        </audio>
      </Descriptions.Item>
    </Descriptions>
  );
};
function CallDetails({ callData }) {

  const renderCallDetails = () => {
    if (callData.length > 0) {
      return <div className="call-details-container">
        {callData &&
          map(callData, (item, index) => <CallDetailsCard key={index} data={item} />)}
      </div>
    }
    return <div><h6>No Call Logs found</h6> <Divider /></div>
  }
  return (
    <div className="d-flex flex-column">
      <Title level={4} className="title_call_log _pt20">Call Logs</Title>
      {renderCallDetails()}
    </div>
  );
}

CallDetails.PropType = {
  callData: PropTypes.array,
};

export default CallDetails;
