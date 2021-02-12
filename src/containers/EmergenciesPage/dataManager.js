import React from "react";
import { get, capitalize, toString } from "lodash";
import { Switch } from "antd";
import { emergencyAssigner } from "../../actions/EmergencyActions";

function renderYesOrNo(data) {
  if (data) {
    return "Yes";
  }
  return "No";
}

function getAgentName(data) {
  if (data) {
    return get(data, "agentName", "N/A");
  }
  return "N/A";
}

function getCustomerStatus(data) {
  if (data) {
    return get(data, "CustomerStatus", "N/A");
  }
  return "N/A";
}

function renderSwitch(data) {
  if (data.status === 0) {
    return (
      <Switch
        checkedChildren="accepted"
        unCheckedChildren="not_accepted"
        onChange={() => data.handleNavigationEmergencyAssign({ ...data })}
      />
    );
  }
  return null;
}

function renderCancelledStatusTime(data) {
  if (data.status === 3) {
    return get(data, "updated_at_formatted", "n/a");
  }
  return null;
}

export const tableColumns = [
  {
    title: "Request No.",
    key: "requestIdentifier",
    dataIndex: "request_id",
  },
  {
    title: "User",
    dataIndex: "request_consumer",
    key: "userDetails",
    render: (text, row) => {
      return (
        <div className="user-details">
          <div className="user-details-value">
            Name:{" "}
            {row.request_consumer.full_name
              ? row.request_consumer.full_name.replace(
                  /[&\/\\#,+()$~%.'":*?<div>{}]/g,
                  ""
                )
              : "N/A"}
          </div>
          {row.request_consumer.mobile_number && (
            <div className="user-details-value">
              +
              {row.request_consumer.country_code +
                row.request_consumer.mobile_number}
            </div>
          )}
        </div>
      );
    },
  },
  {
    title: "Plan Details",
    key: "elderPlanDetails",
    render: (text, row) => {
      return (
        <div className="user-details">
          <div className="user-details-value">
            Status: {get(row, "plan.status", "N/A")}
          </div>
          <div className="user-details-value">
            Name: {get(row, "plan.name", "N/A")}
          </div>
        </div>
      );
    },
  },
  {
    title: "Status",
    key: "status",
    render: (text, row) => {
      let status = null;
      let classToggle = "";

      if (row.status === 0) {
        status = "New";
        classToggle = "-param--red";
      } else if (row.status === 1) {
        status = "Ongoing";
        classToggle = "-param--orange";
      } else if (row.status === 2) {
        status = "Completed";
        classToggle = "-param--green";
      } else if (row.status === 3) {
        status = "Cancelled";
      }

      return (
        <div className="status-details">
          {row.status !== 2 && row.status !== 3 && (
            <div className="user-status-details">
              <span>Agent:</span> {getAgentName(row.agent_name)}
            </div>
          )}
          <div
            className={`status-details-param status-details${classToggle} d-flex align-items-center justify-content-start`}
          >
            <span className="status-details-light"></span>
            <span className="status-details-description">{status}</span>
          </div>
        </div>
      );
    },
  },
  // {
  //   title: "Customer Status",
  //   key: "CustomerStatus",
  //   render: (text, row) => getCustomerStatus(row.agent_name) || "N/A",
  // },
  {
    title: "Req. Source",
    key: "req_source",
    dataIndex: "source",
  },
  {
    title: "Adm. Name",
    key: "adm_name",
    render: (text, row) => {
      return (
        <div className="d-flex flex-column">
          <span>{get(row, "admin_name", "n/a")}</span>
          <span>{renderCancelledStatusTime(row)}</span>
        </div>
      );
    },
  },
  {
    title: "Actions",
    key: "actions",
    render: (text, row) => {
      return (
        <div className="record-actions d-flex flex-column align-items-center justify-content-start">
          <a href={`emergencies/view/${row.id}`}>Details</a>
          {renderSwitch(row)}
        </div>
      );
    },
  },
  {
    title: "Simulation",
    key: "is_simulated",
    render: (text, row) => {
      return (
        <span>
          {row.is_alarm || row.is_simulated === null
            ? "N/A"
            : renderYesOrNo(get(row, "is_simulated", "N/A"))}
        </span>
      );
    },
  },
  {
    title: "False Alarm",
    key: "is_alarm",
    render: (text, row) => {
      return (
        <span>
          {row.is_simulated || row.is_alarm === null
            ? "N/A"
            : renderYesOrNo(get(row, "is_alarm", "N/A"))}
        </span>
      );
    },
  },
];
