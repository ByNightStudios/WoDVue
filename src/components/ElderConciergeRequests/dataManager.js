import React from "react";
import ElderService from "../../service/ElderService";

export default class ElderConciergeRequestsDataManager {
  constructor() {
    this.elderService = new ElderService();
  }

  getElderConciergeRequests(payload) {
    return this.elderService.getElderConciergeRequests(payload);
  }
}

export const tableColumns = [
  {
    title: "S.No.",
    key: "indexCount",
    dataIndex: "index",
  },
  {
    title: "Request No.",
    key: "requestIdentifier",
    dataIndex: "service_request_id",
  },
  {
    title: "Service",
    key: "service",
    render: (text, row) => {
      return (
        <p>{row.other_service_name ? row.other_service_name : row.service}</p>
      );
    },
  },
  {
    title: "Time",
    key: "serviceTime",
    render: (text, row) => {
      return <p>{row.service_time ? row.service_time : "N/A"}</p>;
    },
  },
  {
    title: "End date",
    key: "service_end_date",
    render: (text, row) => {
      return <p>{row.service_end_date ? row.service_end_date : "N/A"}</p>;
    },
  },
  {
    title: "Address",
    key: "serviceAddress",
    render: (text, row) => {
      return <p>{row.full_address ? row.full_address : "N/A"}</p>;
    },
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

      return <p>{fullName}</p>;
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
      } else if (row.status === 4) {
        status = "Feedback Required";
        classToggle = "-param--black";
      }

      return (
        <div className="status-details">
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
    title: "Actions",
    key: "actions",
    render: (text, row) => {
      return (
        <a
          href={`/concierge/view/${row.id}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Details
        </a>
      );
    },
  },
];
