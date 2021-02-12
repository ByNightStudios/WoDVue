import React, { useState, useEffect } from 'react';
import { Descriptions, Skeleton, Tag, Badge, Card, Typography, DatePicker, Button, message } from 'antd';
import {
  faMale,
  faFemale,
} from '@fortawesome/free-solid-svg-icons';
import ElderDetailsDataManager from "../../ElderDetails/dataManager";
import {
  checkIsErmOrErmSuperVisor,
} from 'utils/checkElderEditPermission';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
import { get, isEmpty, map } from 'lodash';
import './style.scss';

const elderManager = new ElderDetailsDataManager();
function ElderData(props) {
  const { loading, elderApiData, zohoElderData } = props;
  const [elderData, setElderData] = useState('');
  const [date, setDate] = useState();

  useEffect(() => {
    if (isEmpty(zohoElderData)) {
      setElderData(elderApiData);
    } else {
      setElderData(zohoElderData);
    }
    if (elderApiData) {
      setDate(elderApiData.owner.dob);
    }
  }, [elderApiData, zohoElderData]);

  function renderData(data) {
    if (loading) {
      return <Skeleton active loading paragraph={{ rows: 1, width: 200 }} />;
    }
    if (data && data !== 'Invalid date') {
      return data;
    }
    return 'N/A';
  }

  function renderAge(birthDate, otherDate) {
    if (loading) {
      return <Skeleton active loading paragraph={{ rows: 1, width: 200 }} />;
    }
    birthDate = new Date(birthDate);
    otherDate = new Date(otherDate);

    let years = otherDate.getFullYear() - birthDate.getFullYear();

    if (
      otherDate.getMonth() < birthDate.getMonth() ||
      (otherDate.getMonth() == birthDate.getMonth() &&
        otherDate.getDate() < birthDate.getDate())
    ) {
      years--;
    }
    if (years) {
      return `${years} years`;
    }
    return `N/A`;
  }

  function renderGender(data) {
    if (loading) {
      return <Skeleton active loading paragraph={{ rows: 1, width: 200 }} />;
    }
    if (data === 1 || data === 'Male') {
      return (
        <div>
          <FontAwesomeIcon icon={faMale} /> Male
        </div>
      );
    }
    if (data === 2) {
      return (
        <div>
          <FontAwesomeIcon icon={faFemale} />
          FeMale
        </div>
      );
    }
    return 'N/A';
  }

  function renderLanguages(data) {
    if (loading) {
      return <Skeleton active loading paragraph={{ rows: 1, width: 200 }} />;
    }
    if (data) {
      return (
        <div className="d-flex flex-row align-items-center justify-content-center flex-wrap w-100 h-100">
          {map(data, item => (
            <Tag color="#780001" style={{ margin: 2 }} key={item}>
              {`${item}`}
            </Tag>
          ))}
        </div>
      );
    }
    return 'User does not set language preferances';
  }

  function renderText() {
    if (!isEmpty(zohoElderData)) {
      return 'Syc with Zoho CRM';
    }
    return 'Syc with Emoha Server';
  }

  function renderName(firstName) {
    if (firstName) {
      return firstName
    }
    return 'No Erm Assigned'
  }

  function renderLastName(firstName) {
    if (firstName) {
      return firstName
    }
    return ''
  }

  function handleDateChange(date, dateString) {
    setDate(dateString);
  }

  function handleSubmitDate() {
    const payload = {
      user_id: get(elderApiData, "id"),
      first_name: get(elderApiData, "first_name", ""),
      last_name: get(elderApiData, "last_name", ""),
      user_type: get(elderApiData, "user_type", ""),
      dob: date,
    }
    elderManager.elderService
      .editElderProfile(payload)
      .then((response) => {
        if (response) {
          message.success(`details has been updated`);
        }
      })
      .catch((err) => {
        if (err) {
          message.error(`Something went wrong`);
        }
      });
  }

  return (
    <Descriptions
      title={
        <Badge.Ribbon text={renderText()} offset={100} color="#780001">
          <Card bordered>
            Elder Details
            <Card.Meta
              description={` ERM : ${renderName(get(elderApiData, 'erm_data[0]', '-')[
                'admin_user.first_name'
              ])
                }${'  '}${renderLastName(get(elderApiData, 'erm_data[0]', '-')[
                  'admin_user.last_name'
                ])
                }, Supervisor: ${get(
                  elderApiData,
                  'erm_data[0].ermSupervisorData.manager_assignments.first_name', 'No Erm Supervisor Assigned'
                )}`}
            />
          </Card>
        </Badge.Ribbon>
      }
      bordered
    >
      <Descriptions.Item label="First Name" span={4}>
        {renderData(get(elderData, 'First_Name', get(elderData, 'first_name')))}
      </Descriptions.Item>
      <Descriptions.Item label="Last Name" span={4}>
        {renderData(get(elderData, 'Last_Name', get(elderData, 'last_name')))}
      </Descriptions.Item>
      <Descriptions.Item label="Customer ID" span={4}>
        {renderData(get(zohoElderData, 'Customer_ID'))}
      </Descriptions.Item>
      <Descriptions.Item label="Date Of Birth" span={4}>
        <DatePicker onChange={handleDateChange} format="YYYY-MM-DD" value={!isEmpty(date) && date !== undefined ? moment(date) : ''} /> <Button onClick={handleSubmitDate} disabled={checkIsErmOrErmSuperVisor(
          props.user,
          props.elderData,
        )}>Save</Button>
      </Descriptions.Item>
      <Descriptions.Item label="Age" span={4}>
        {renderAge(
          moment(
            get(elderData, 'DOB', get(elderData, 'owner.dob_formatted')),
          ).format('MM/DD/YYYY'),
          moment().format('MM/DD/YYYY'),
        )}
      </Descriptions.Item>
      <Descriptions.Item label="Gender" span={4}>
        {renderGender(get(elderData, 'Gender', get(elderData, 'gender')))}
      </Descriptions.Item>
      <Descriptions.Item label="Language Preferences" span={4}>
        {renderLanguages(
          get(
            elderData,
            'Elder_Language_Preferences',
            get(elderData, 'owner.languages'),
          ),
        )}
      </Descriptions.Item>
    </Descriptions>
  );
}

export default ElderData;
