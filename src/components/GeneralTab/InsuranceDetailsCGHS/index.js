import React, { useState, useEffect } from "react";
import { Descriptions, Select, Input, Button, Tooltip, message, toString } from "antd";
import ElderDetailsDataManager from "../../ElderDetails/dataManager";
import { checkIsErmOrErmSuperVisor } from '../../../utils/checkElderEditPermission';
import { get } from "lodash";

import './style.scss';

const { Option } = Select;
const elderManager = new ElderDetailsDataManager();

function InsuranceCGHS(props) {
  const { loading, elderData } = props;
  const [isCGHSMember, setIsCGHSMember] = useState("1");
  const [number, setNumber] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
   const cghs_or_echs_member = get(elderData, 'owner.cghs_or_echs_member', '');
   const cghs_or_echs_number = get(elderData, 'owner.cghs_or_echs_number', '');
   const name_of_cghs_card = get(elderData, 'owner.name_of_cghs_card');
    if(cghs_or_echs_member) {
      setIsCGHSMember("1");
    } else {
      setIsCGHSMember("0");
    }

   setNumber(cghs_or_echs_number);
   setName(name_of_cghs_card);

  }, [elderData]);

  function handleChange(value) {
    setIsCGHSMember(value);
  }

  const handleSubmit = () => {
    const payload = {
      user_id: get(elderData, "id"),
      first_name: get(elderData, "first_name", ""),
      last_name: get(elderData, "last_name", ""),
      user_type: get(elderData, "user_type", ""),
      cghs_or_echs_member: isCGHSMember,
      cghs_or_echs_number: number,
      name_of_cghs_card: name,
    };

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
      title="Insurance Details CGHS"
      bordered
      column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
      className="elder-member-insurance-details-cghs"
    >
      <Descriptions.Item label="Is CGHS or ECHS Member ?" span={4}>
        <Select
          style={{ width: 120 }}
          onChange={handleChange}
          value={isCGHSMember}
          placeholder="Please choose the option"
          disabled={checkIsErmOrErmSuperVisor(
            props.user,
            props.elderData,
          )}
        >
          <Option value="1">Yes</Option>
          <Option value="0">No</Option>
        </Select>
      </Descriptions.Item>
      {isCGHSMember === "1" && (
        <>
          <Descriptions.Item label="CGHS or ECHS Number" span={4}>
            <Input value={number} onChange={e => setNumber(e.target.value)}/>
          </Descriptions.Item>
          <Descriptions.Item label="Name on CGHS Card" span={4}>
            <Input value={name} onChange={e => setName(e.target.value)}/>
          </Descriptions.Item>
        </>
      )}
      <Tooltip title="Save Changes">
          <Button type="primary" style={{ marginLeft: 10 }} onClick={handleSubmit}
          disabled={checkIsErmOrErmSuperVisor(
            props.user,
            props.elderData,
          )}
          >
            Save 
          </Button>
        </Tooltip>
    </Descriptions>
  );
}

export default InsuranceCGHS;
