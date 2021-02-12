import React, { useState, useEffect } from "react";
import { Descriptions, Skeleton, Input, Row, Button, message } from "antd";
import { get, toString, find, isNull } from "lodash";
import { CloseCircleOutlined, CheckCircleTwoTone, } from '@ant-design/icons';
import ElderDetailsDataManager from "../../ElderDetails/dataManager";
import PhoneNumber from "../../../components/PhoneNumber";

import {
  checkIsErmOrErmSuperVisor,
} from 'utils/checkElderEditPermission';

import "./style.scss";

const elderManager = new ElderDetailsDataManager();

function ContactDetail(props) {
  const { loading, elderData, zohoElderData } = props;
  const [disabled, setDisabled] = useState(true);
  const [whatsAppNumber, setWhatsAppNumber] = useState('');
  const [whatsAppNumberCountryCode, setWhatsAppNumberCountryCode] = useState('');
  const [email, setEmail] = useState('');
  const [alternateNumber, setAlternateNumber] = useState('');
  const [countryCode, setcountryCode] = useState('false');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [emergencyContactCode, setEmergencyContactCode] = useState('');
  const [nokContact, setNokContact] = useState('');
  const [nokCode, setNokCode] = useState('');

  useEffect(() => {
    setWhatsAppNumber(get(elderData, `owner.whatsapp_mobile_number`));
    setAlternateNumber(get(
      zohoElderData,
      "Elder_s_Phone1",
      get(elderData, "owner.alternate_mobile_number")
    ))
    setEmail(get(elderData, "email", ""));
  }, [zohoElderData, elderData]);

  function renderData(data,countryCode,  isDisabled) {
    if (loading) {
      return <Skeleton active loading paragraph={{ rows: 1, width: 200 }} />;
    }

    if (data) {
      return <PhoneNumber phoneNo={`${data}`} disabled={isDisabled} code={countryCode} />;

    }
    return <PhoneNumber phoneNo={null} disabled={isDisabled} code={'91'} />;;
  }

  function renderEmail(data) {
    if (loading) {
      return <Skeleton active loading paragraph={{ rows: 1, width: 200 }} />;
    }

    return <Input placeholder="Please enter elder email" value={email} disabled={disabled} onChange={(e) => setEmail(e.target.value)} />;
  }

  function getNokDataRelationShip(relationships) {
    const NokData = find(relationships, { is_nok: true });
    if (NokData) {
      return get(NokData, "details.mobile_number");
    }

    return "";
  }

  function getNokDataName(relationships) {
    const NokData = find(relationships, { is_nok: true });

    if (NokData) {
      return get(NokData, "details.full_name", "");
    }

    return "No data found";
  }

  function renderAlternateData(data, countryCode) {
    if (loading) {
      return <Skeleton active loading paragraph={{ rows: 1, width: 200 }} />;
    }
    if(!isNull(data)){
      return  <PhoneNumber phoneNo={`${data}`} disabled={disabled} onChange={handleAlternateChange} code={countryCode} />;
    }
    if(isNull(data)){
      return  <PhoneNumber phoneNo={null} disabled={disabled} onChange={handleAlternateChange} code={'91'} />;
    }

  }


  const handleOnChange = (data,country_code) => {
    setWhatsAppNumber(data)
    setWhatsAppNumberCountryCode(country_code)
  }

  const handleAlternateChange = (data,country_code) => {
    setAlternateNumber(data);
    setcountryCode(country_code)
  }

  const handleOnEmergencyChange = (data, country_code) => {
    setEmergencyContact(data);
    setEmergencyContactCode(country_code);
  }

  const handleOnNokChange = (data, country_code) => {
    setNokContact(data);
    setNokCode(country_code);
  }

  function renderWhatsAppData(data, countryCode, isWhatsAppNoDisabled, onChangeWhatsAppNumber) {
    if (loading) {
      return <Skeleton active loading paragraph={{ rows: 1, width: 200 }} />;
    }
    if(!isNull(data)){
      return <PhoneNumber phoneNo={`${data}`} disabled={isWhatsAppNoDisabled} onChange={onChangeWhatsAppNumber} code={countryCode} />;
    }
    if(isNull(data)){
      return <PhoneNumber  phoneNo={null} disabled={isWhatsAppNoDisabled} onChange={onChangeWhatsAppNumber} />;
    }
  }

  function renderEmergencyContactNoData(data, countryCode, isWhatsAppNoDisabled, onChangeWhatsAppNumber) {
    if (loading) {
      return <Skeleton active loading paragraph={{ rows: 1, width: 200 }} />;
    }
    if(!isNull(data)){
      return <PhoneNumber phoneNo={`${data}`} disabled={isWhatsAppNoDisabled} onChange={onChangeWhatsAppNumber} code={countryCode} />;
    }
    if(isNull(data)){
      return <PhoneNumber  phoneNo={null} disabled={isWhatsAppNoDisabled} onChange={onChangeWhatsAppNumber} />;
    }
  }

  function renderNokData(data, countryCode, isWhatsAppNoDisabled, onChangeWhatsAppNumber) {
    if (loading) {
      return <Skeleton active loading paragraph={{ rows: 1, width: 200 }} />;
    }
    if(!isNull(data)){
      return <PhoneNumber phoneNo={`${data}`} disabled={isWhatsAppNoDisabled} onChange={onChangeWhatsAppNumber} code={countryCode} />;
    }
    if(isNull(data)){
      return <PhoneNumber  phoneNo={null} disabled={isWhatsAppNoDisabled} onChange={onChangeWhatsAppNumber} />;
    }
  }

  const handleSubmit = () => {
    const payload = {
      country_code:countryCode,
      user_id: get(elderData, "id"),
      first_name: get(elderData, "first_name", ""),
      last_name: get(elderData, "last_name", ""),
      user_type: get(elderData, "user_type", ""),
      whatsapp_country_code: whatsAppNumberCountryCode,
      whatsapp_mobile_number: whatsAppNumber,
      email: email,
      alternate_mobile_number: alternateNumber,
      primary_emergency_contact_number: emergencyContact,
      primary_emergency_country_code: emergencyContactCode,
      nok_country_code: nokCode,
      nok_phone: nokContact,
    }
    elderManager.elderService
      .editElderProfile(payload)
      .then((response) => {
        if (response) {
          message.success(`details has been updated`);
          setDisabled(true);
        }
      })
      .catch((err) => {
        if (err) {
          message.error(`Something went wrong`);
        }
      });
  }

  const renderVerifiedTick = () => {
    if (get(elderData, `owner.is_whatsapp_verify`)) {
      return <CheckCircleTwoTone twoToneColor="#52c41a" />
    }
    return <CloseCircleOutlined />
  }

  return (
    <Descriptions
      title="Contact Details"
      bordered
      column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
      className="elder-contact-details"
    >
      <Descriptions.Item label="Contact Number" span={4}>
        {renderData(
          get(zohoElderData, "Elder_s_Phone", get(elderData, "mobile_number", null)),
          get(elderData, 'country_code'),
          true
        )}
      </Descriptions.Item>
      <Descriptions.Item label={<span>WhatsApp Number  {renderVerifiedTick()}</span>} span={4}>
        <Row type="flex">
          {renderWhatsAppData(get(elderData, `owner.whatsapp_mobile_number`),get(elderData, 'owner.whatsapp_country_code') ,disabled, handleOnChange)}
        </Row>

      </Descriptions.Item>
      <Descriptions.Item label="Emergency Contact Number" span={4}>
        {renderEmergencyContactNoData(
          get(elderData, "owner.primary_emergency_contact_number", null),
          get(elderData, 'primary_emergency_country_code'),
          disabled,
          handleOnEmergencyChange,
        )}
      </Descriptions.Item>
      <Descriptions.Item label="NOK contact number" span={4}>
        {renderNokData(
          get(elderData, "owner.nok_phone", null),
          get(elderData, "owner.nok_country_code", null),
          disabled,
          handleOnNokChange
        )}
      </Descriptions.Item>
      <Descriptions.Item label="NOK name" span={4}>
        {getNokDataName(get(elderData, "user_relationships", []))}
      </Descriptions.Item>
      <Descriptions.Item label="Alternate number" span={4}>
        {renderAlternateData(
          get(
            zohoElderData,
            "Elder_s_Phone1",
            get(elderData, "owner.alternate_mobile_number", null)
          ),
          get(elderData, 'country_code'),
          true,
        )}
      </Descriptions.Item>
      <Descriptions.Item label="Email Address" span={4}>
        {renderEmail(get(elderData, "email", ""), disabled)}
      </Descriptions.Item>
      <Descriptions.Item span={4}>
        <Row type="flex" justify="space-around" align="middle">
          <Button
            onClick={() => setDisabled(false)}
            disabled={checkIsErmOrErmSuperVisor(
              props.user,
              props.elderData,
            )}
          >Edit</Button>
          <Button onClick={handleSubmit} type="primary" disabled={disabled}>Save</Button>
        </Row>
      </Descriptions.Item>

    </Descriptions>
  );
}

export default ContactDetail;
