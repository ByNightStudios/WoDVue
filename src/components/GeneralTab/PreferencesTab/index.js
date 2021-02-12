import React, { useState, useEffect } from "react";
import {
  Descriptions,
  Skeleton,
  TimePicker,
  Button,
  Select,
  DatePicker,
  message
} from "antd";
import moment from "moment";
import { get, isEmpty } from "lodash";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ElderDetailsDataManager from "../../ElderDetails/dataManager";
import { checkIsErmOrErmSuperVisor } from '../../../utils/checkElderEditPermission';
import "./style.scss";

const { Option } = Select;
const elderManager = new ElderDetailsDataManager();


function PreferencesSection(props) {
  const [preferencedTime, setPreferencesTime] = useState('');
  const [rhHub, setRHHub] = useState("");
  const { loading, elderData } = props;
  useEffect(() => {
    setRHHub(get(elderData, "owner.prefrence_hub", ""));
    if (!isEmpty(get(elderData, "owner.prefrence_time"))){
      const preferenceElderTime = get(elderData, "owner.prefrence_time");
      setPreferencesTime(moment(preferenceElderTime));
    } else {
      setPreferencesTime('');
    }
  }, [elderData]);

  const handleSubmit = () => {
    const payload = {
      user_id: get(elderData, "id"),
      first_name: get(elderData, "first_name", ""),
      last_name: get(elderData, "last_name", ""),
      user_type: get(elderData, "user_type", ""),
      prefrence_time: preferencedTime,
      prefrence_hub: rhHub,
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
    
  };

  function renderRhHubData(data) {
    if (loading) {
      return <Skeleton active loading paragraph={{ rows: 1, width: 200 }} />;
    }
    return (
      <div>
        <Select
          style={{ width: 200 }}
          value={rhHub}
          onChange={handleChange}
          placeholder="Please choose hub from the below"
          disabled={checkIsErmOrErmSuperVisor(
            props.user,
            props.elderData,
          )}
        >
          <Option value="Gurgaon Sector 55">Gurgaon Sector 55</Option>
          <Option value="Gurgaon Sector 39">Gurgaon Sector 39</Option>
          <Option value="Noida Sector 46">Noida Sector 46</Option>
          <Option value="Green Park">Green Park</Option>
          <Option value="Dwarka">Dwarka</Option>
        </Select>
        <Button type="dashed" shape="circle" style={{ marginLeft: 10 }} onClick={handleSubmit} disabled={checkIsErmOrErmSuperVisor(
            props.user,
            props.elderData,
          )}>
          <FontAwesomeIcon icon={faSave} />
        </Button>
      </div>
    );
  }

  function renderPrefernceTime(data) {
    if (loading) {
      return <Skeleton active loading paragraph={{ rows: 1, width: 200 }} />;
    }
    
    return (
      <div className="d-flex flex-row" id="time">
        <DatePicker
          format="YYYY-MM-DD HH:mm:ss"
          onChange={onChange}
          showTime={{ defaultValue: moment() }}
          value={!isEmpty(preferencedTime) ? moment(preferencedTime) : null}
          getCalendarContainer={() => document.getElementById("time")}
          getPopupContainer={() => document.getElementById("time")}
          disabled={checkIsErmOrErmSuperVisor(
            props.user,
            props.elderData,
          )}
        />
        <Button
          type="dashed"
          shape="circle"
          style={{ marginLeft: 10 }}
          onClick={handleSubmit}
          disabled={checkIsErmOrErmSuperVisor(
            props.user,
            props.elderData,
          )}
        >
          <FontAwesomeIcon icon={faSave} />
        </Button>
      </div>
    );
  }

  function onChange(time, timeString) {
    setPreferencesTime(timeString);
  }

  function handleChange(value) {
    setRHHub(value);
  }

  return (
    <Descriptions
      title="Preferences"
      bordered
      column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
      className="elder-preferences-plan-details"
    >
      <Descriptions.Item label="Preferred Call time" span={4}>
        <div>{renderPrefernceTime(get(elderData, "time"))}</div>
      </Descriptions.Item>
      <Descriptions.Item label="Responder Hub Assigned" span={4}>
        {renderRhHubData(get(elderData, "owner.rh_hub"))}
      </Descriptions.Item>
    </Descriptions>
  );
}

export default PreferencesSection;
