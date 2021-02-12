import React, { useState, useEffect } from "react";
import {
  Descriptions,
  Skeleton,
  Input,
  AutoComplete,
  Button,
  Tooltip,
  message,
  Select,
  Row
} from "antd";
import { get, map } from "lodash";
import ElderTeamMembersDataManager from "./dataManager";
import {
  faSave,
  faTrashAlt,
  faPhone,
  faUser,
  faSms,
  faComment,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { checkIsErmOrErmSuperVisor } from '../../../utils/checkElderEditPermission';
import "./style.scss";

const { Option } = AutoComplete;

message.config({
  top: 70,
  maxCount: 1,
});

function EmohaTeamDetails(props) {
  const [options, setOptions] = useState([]);
  const [memberId, setMemberId] = useState([]);
  const [assignedTeam, setAssignedTeam] = useState([]);
  const elderTeamMemberData = new ElderTeamMembersDataManager();
  const { loading, elderData, currentElderIdentifier } = props;

  function getTeamMembers() {
    const payload = {
      elderIdentifier: currentElderIdentifier,
    };

    elderTeamMemberData
      .getAssignedTeamMembers(payload)
      .then((responseData) => {
        if (responseData.data) {
          setAssignedTeam(responseData.data);
        }
      })
      .catch((errorData) => {
        if (errorData) {
          message.error("Something went wrong");
        }
      });
  }

  useEffect(() => {
    getTeamMembers();
  }, []);

  const onSelect = (value) => {
    setMemberId(value);
  };

  function renderData(teamMember) {
    const assignedTeam = {
      community: [],
      dietitian: [],
      doctor: [],
      erm: [],
      physio: [],
    };

    assignedTeam[`${teamMember}`] = [memberId];

    const handleAssignMember = () => {
      const dataPayload = {
        user_id: currentElderIdentifier,
        ...assignedTeam,
      };

      elderTeamMemberData
        .assignTeamMembers(dataPayload)
        .then((responseData) => {
          if (responseData) {
            message.success("Team member has been assigned to the elder");
            setMemberId([]);
          }
        })
        .catch((errorData) => {
          if (errorData) {
            message.error("Something went wrong");
          }
        });

      setTimeout(() => {
        getTeamMembers();
      }, 1000);
    };
    const handleSearch = (value) => {
      searchResult(value);
    };

    const searchResult = (query) => {
      const dataPayload = {
        role: teamMember,
        user_id: currentElderIdentifier,
      };

      elderTeamMemberData
        .getUnassignedTeamMembers(dataPayload)
        .then((responseData) => {
          if (responseData.data) {
            setOptions(responseData.data);
          }
        })
        .catch((errorData) => {
          if (errorData) {
            setOptions([]);
            message.error("Something went wrong");
          }
        });

      return [];
    };

    const renderOptions = (item) => (
      <Option value={item.id} title={item.full_name} key={item.id}>
        {item.full_name}
      </Option>
    );

    if (loading) {
      return <Skeleton active loading paragraph={{ rows: 1, width: 200 }} />;
    }

    console.log( assignedTeam[`${teamMember}`] );

    return (
      <Row type="flex">
        <Select
          mode="multiple"
          dropdownMatchSelectWidth={252}
          style={{
            width: 300,
          }}
          onChange={onSelect}
          optionLabelProp="title"
          disabled={checkIsErmOrErmSuperVisor(
            props.user,
            props.elderData,
          )}
          value={memberId}
          onFocus={(e) => handleSearch(teamMember)}
        >
          {options.map(item => (
            <Option value={item.id} title={item.full_name} key={item.id}>
              {item.full_name}
            </Option>
          ))}
        </Select>
        <Tooltip title={`Assign ${teamMember} Member`}>
          <Button type="dashed" shape="cirlce" onClick={handleAssignMember} style={{ marginLeft: 10 }} disabled={checkIsErmOrErmSuperVisor(
            props.user,
            props.elderData,
          )}>
            <FontAwesomeIcon icon={faSave} />
          </Button>
        </Tooltip>
      </Row>
    );
  }

  function handleDeleteMember(member, role) {
    const dataPayload = {
      role,
      admin_id: member.id,
      user_id: currentElderIdentifier,
    };

    elderTeamMemberData
      .removeAssignedTeamMembers(dataPayload)
      .then((responseData) => {
        if (responseData.data) {
          setAssignedTeam(responseData.data);
          message.success("Member has been removed");
        }
      })
      .catch((errorData) => {
        if (errorData) {
          message.error("Something went wrong");
        }
      });
  }

  function renderTeamDetails(data) {
    if (assignedTeam[`${data}`] && assignedTeam[`${data}`].length !== 0) {
      return (
        <Descriptions bordered>
          {map(assignedTeam[`${data}`], (item) => (
            <Descriptions.Item label={get(item, "full_name")} span={8}>
              <Tooltip title="delete">
                <Button
                  type="dashed"
                  shape="circle"
                  style={{ margin: 5 }}
                  onClick={() => handleDeleteMember(item, data)}
                  disabled={checkIsErmOrErmSuperVisor(
                    props.user,
                    props.elderData,
                  )}
                >
                  <FontAwesomeIcon icon={faTrashAlt} />
                </Button>
              </Tooltip>
              <Tooltip title="Call">
                <Button
                  type="dashed"
                  shape="circle"
                  disabled
                  style={{ margin: 5 }}
                >
                  <FontAwesomeIcon icon={faPhone} />
                </Button>
              </Tooltip>
              <Tooltip title="View Profile">
                <Button
                  type="dashed"
                  shape="circle"
                  disabled
                  style={{ margin: 5 }}
                >
                  <FontAwesomeIcon icon={faUser} />
                </Button>
              </Tooltip>
              <Tooltip title="Chat">
                <Button
                  type="dashed"
                  shape="circle"
                  disabled
                  style={{ margin: 5 }}
                >
                  <FontAwesomeIcon icon={faSms} />
                </Button>
              </Tooltip>
              <Tooltip title="LeaveMessage">
                <Button
                  type="dashed"
                  shape="circle"
                  disabled
                  style={{ margin: 5 }}
                >
                  <FontAwesomeIcon icon={faComment} />
                </Button>
              </Tooltip>
            </Descriptions.Item>
          ))}
        </Descriptions>
      );
    }
    return "No Team Members found";
  }

  return (
    <Descriptions
      title="Emoha Team Allocated"
      bordered
      column={{ sm: 2, xs: 1 }}
      className="elder-member-plan-details"
      style={{ width: '100vw' }}
    >
      <Descriptions.Item label="Doctor" span={8}>
        {renderData("doctor")}
      </Descriptions.Item>
      <Descriptions.Item label="Team Details" span={8}>
        {renderTeamDetails("doctor")}
      </Descriptions.Item>
      <Descriptions.Item label="Community Manager" span={8}>
        {renderData("community")}
      </Descriptions.Item>
      <Descriptions.Item label="Team Details" span={8}>
        {renderTeamDetails("community")}
      </Descriptions.Item>
      <Descriptions.Item label="Physio" span={8}>
        {renderData("physio")}
      </Descriptions.Item>
      <Descriptions.Item label="Team Details" span={8}>
        {renderTeamDetails("physio")}
      </Descriptions.Item>
      <Descriptions.Item label="Dietitian" span={8}>
        {renderData("dietitian")}
      </Descriptions.Item>
      <Descriptions.Item label="Team Details" span={8}>
        {renderTeamDetails("dietitian")}
      </Descriptions.Item>
    </Descriptions>
  );
}

export default EmohaTeamDetails;
