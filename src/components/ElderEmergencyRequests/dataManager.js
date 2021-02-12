import React from "react";
import { get } from "lodash";
import ElderService from "../../service/ElderService";

export default class ElderEmergencyRequestsDataManager {
  constructor() {
    this.elderService = new ElderService();
  }

  getElderEmergencies(payload) {
    return this.elderService.getElderEmergencies(payload);
  }
}

function getAgentName(data) {
  if (data) {
    return get(data, "agentName", "N/A");
  }
  return "N/A";
}

export const tableColumns = [
  {
    title: "S.No.",
    key: "indexCount",
    dataIndex: "index",
  },
  {
    title: "Req. No.",
    key: "requestIdentifier",
    dataIndex: "request_id",
  },
  {
    title: "Responder",
    key: "responder",
    render: (text, row) => {
      let fullName = "";

      if ((!row.first_name && !row.last_name) || !row.status) {
        fullName = "N/A";
      } else {
        fullName = `${row.first_name ? row.first_name : ""} ${
          row.last_name ? row.last_name : ""
        }`;
      }

      return (
        <b>
          <i>{fullName}</i>
        </b>
      );
    },
  },
  {
    title: "Timeline",
    key: "timeline",
    dataIndex: "created_at",
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
              <span>Agent:</span>
              {getAgentName(row.agent_name)}
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
  {
    title: "Req. Source",
    key: "req_source",
    render: (text, row) => {
      return row.source || "N/A";
    },
  },
  {
    title: "Adm. Name",
    key: "adm_name",
    render: (text, row) => {
      return row.admin_name || "N/A";
    },
  },
  {
    title: "Simulation",
    key: "is_simulation",
    render: (text, row) => {
      return row.is_simulation ? "Yes" : "No";
    },
  },
  {
    title: "False Alarm",
    key: "is_alarm",
    render: (text, row) => {
      return row.is_alarm ? "Yes" : "No";
    },
  },
  {
    title: "Actions",
    key: "actions",
    render: (text, row) => {
      return (
        <a
          href={`/emergencies/view/${row.id}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Details
        </a>
      );
    },
  },
];
