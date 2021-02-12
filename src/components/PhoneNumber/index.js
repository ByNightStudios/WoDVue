import React, { useState, useEffect } from 'react';
import { Input } from 'antd';
import { get, toLower, find, isNull, toNumber, isNaN, isNil } from 'lodash';
import phoneNumberCodeData from '../EmergencyContacts/phone.json';
import './style.scss';

const PhoneNumber = props => {
  const { phoneNo: elderNumber, disabled, code } = props;
  // const phoneNumberData = find(phoneNumberCodeData, { dial_code: `+${code}` });
  const [phoneNo, setPhoneNo] = useState('');

  useEffect(() => {
    setPhoneNo(elderNumber);
  }, [elderNumber]);

  function renderAddOnBefore() {
    if (!isNil(code) && !code) {
      return code;
    }
    return '91';
  }

  return (
    <Input
      className="phone-number"
      addonBefore={ renderAddOnBefore()}
      value={phoneNo}
      minLength="10"
      maxLength="10"
      onChange={e => {
        const convertedValue = toNumber(e.target.value);

        if (!isNaN(convertedValue)) {
          setPhoneNo(convertedValue);
          if (typeof props.onChange === 'function') {
            return props.onChange(convertedValue, renderAddOnBefore());
          }
        }
      }}
      disabled={disabled}
    />
  );
};

export default PhoneNumber;
