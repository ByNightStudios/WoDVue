import React, { useState } from 'react';
import * as _ from 'lodash';

import { Button } from 'antd';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEye,
  faHands,
  faComments,
  faBell,
} from '@fortawesome/free-solid-svg-icons';
import AlertLight from '../../assets/images/icons/alert-light.svg';

export const columns = [
  {
    title: 'S.No.',
    key: 'indexCount',
    dataIndex: 'index',
    minWidth: 75,
  },
  {
    title: 'Cust. ID',
    key: 'elderName',
    minWidth: 125,
    render: (text, row) =>
      (row.zoho_object && row.zoho_object.Customer_ID) || 'N/A',
  },
  {
    title: 'User',
    width: 175,
    render: (text, row) => (
      <div className="user-details">
        <div className="user-details-value">
          Name:{' '}
          {row.full_name
            ? row.full_name.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '')
            : 'N/A'}
        </div>
        <div className="user-details-value">
          Phone:{' '}
          {row.country_code
            ? `+${row.country_code}-${row.mobile_number}`
            : _.get(row, 'mobile_number')}
        </div>
      </div>
    ),
  },
  {
    title: 'Address',
    key: 'elderAddress',
    render: (text, row) => {
      let address = _.get(row, 'full_address');

      if (!address || address === '') {
        const zohoAddress = (function (elder) {
          if (!elder) {
            return null;
          }

          let str = elder.Street;
          if (!str) str = '';
          else str += ',';
          if (elder.City) {
            if (str.length) str += ` ${elder.City},`;
            else str += `${elder.City},`;
          }
          if (elder.State) {
            if (str.length) str += ` ${elder.State},`;
            else str += `${elder.State},`;
          }
          if (elder.Country) {
            if (str.length) str += ` ${elder.Country},`;
            else str += `${elder.Country},`;
          }
          if (elder.Pin_Code) {
            if (str.length) str += ` ${elder.Pin_Code}`;
            else str += `${elder.Pin_Code}`;
          }
          return str;
        })(row.zoho_object);

        if (zohoAddress) {
          address = zohoAddress;
        }
      }

      return address || 'N/A';
    },
  },
  {
    title: 'Loc. Code',
    key: 'elderLocCode',
    render: (text, row) => row.location_code || 'N/A',
  },
  {
    title: 'Plan Details',
    key: 'elderPlanDetails',
    render: (text, row) => (
      <div className="user-details">
        <div className="user-details-value">
          Status: {_.get(row, 'plan.status', 'N/A')}
        </div>
        <div className="user-details-value">
          Name: {_.get(row, 'plan.name', 'N/A')}
        </div>
      </div>
    ),
  },
  {
    title: 'Actions',
    key: 'actions',
    render: (text, row) => (
      <div className="record-actions d-flex align-items-center justify-content-start">
        <Link to={`elder/details/${row.id}`} title="View Details">
          <FontAwesomeIcon icon={faEye} />
        </Link>
        <EmergencyButton row={row} />
        <Link to={`concierge/create/${row.id}`} title="Create Concierge">
          <FontAwesomeIcon icon={faHands} />
        </Link>
        <Link
          to={`support?id=${row.id}&name=${_.get(
            row,
            'full_name',
            'Unnamed',
          )}&mobile=${_.get(row, 'mobile_number', '')}`}
          title="Start Chat"
        >
          <FontAwesomeIcon icon={faComments} />
        </Link>
      </div>
    ),
  },
];

const EmergencyButton = function ({ row }) {
  const [popupActive, setPopUpActive] = useState(false);
  const openPopUp = () => {
    setPopUpActive(true);
    closePopUp1();
  };
  const closePopUp = () => {
    setPopUpActive(false);
  };
  const createEmergency = isSimulation => {
    row.createEmergency(isSimulation);
  };

  const [popupActive1, setPopUpActive1] = useState(false);
  const openPopUp1 = () => {
    setPopUpActive1(true);
    closePopUp();
  };
  const closePopUp1 = () => {
    setPopUpActive1(false);
  };
  const createEmergency1 = isFalseAlarm => {
    row.createEmergency1(isFalseAlarm);
  };

  return (
    <div style={{ position: 'relative' }}>
      {popupActive && (
        <div
          style={{
            position: 'absolute',
            width: '100px',
            top: '-60px',
            background: '#9da2a7',
            paddingLeft: '10px',
          }}
        >
          <p>Is simulation</p>
          <button
            className="btn "
            title="Yes"
            onClick={() => {
              createEmergency(true);
              closePopUp();
            }}
          >
            Yes
          </button>
          <button
            className="btn "
            title="No"
            onClick={() => {
              createEmergency(false);
              closePopUp();
            }}
          >
            No
          </button>
        </div>
      )}
      {popupActive1 && (
        <div
          style={{
            position: 'absolute',
            width: '100px',
            top: '-60px',
            background: '#9da2a7',
            paddingLeft: '10px',
            transform: 'translateY(-15px)',
          }}
        >
          <p>Is False Alarm</p>
          <button
            className="btn "
            title="Yes"
            onClick={() => {
              createEmergency1(true);
              closePopUp1();
            }}
          >
            Yes
          </button>
          <button
            className="btn "
            title="No"
            onClick={() => {
              createEmergency1(false);
              closePopUp1();
            }}
          >
            No
          </button>
        </div>
      )}
      <div className="d-flex flex-row">
        <button
          key="simulaton_alarm"
          id="simulaton_alarm"
          className="btn btn-record-action"
          title="Create Emergency(Simulation)"
          onClick={openPopUp}
        >
          <img src={AlertLight} className="alert-lamp" alt="Emergency" />
        </button>
        <Button
          key="false_alarm"
          id="false_alarm"
          className="btn-record-action"
          title="Create Emergency (false alarm)"
          onClick={openPopUp1}
        >
          <FontAwesomeIcon icon={faBell} />
        </Button>
      </div>
    </div>
  );
};
