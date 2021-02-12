import React, { useState, useEffect } from 'react';
import { Card, Typography, Row, InputNumber, Button, message } from 'antd';
import { get, isEmpty, map } from 'lodash';
import RowUpdateSensorData from './RowUpdateSensorData';
import ElderService from '../dataManager';
import { checkForSensorAndDocumentationTab } from '../../../utils/checkElderEditPermission';

const ElderServiceInstance = new ElderService();

message.config({
  top: 80,
  maxCount: 1,
});

function Sensor(props) {
  const [sensorData, setSensorData] = useState([]);
  useEffect(() => {
    ElderServiceInstance.getElderSensorData(get(props, 'elderData.id')).then(
      res => setSensorData(get(res, 'data', [])),
    );
  }, []);

  const [wholeSetOfSensorBox, setWholeSetOfSensor] = useState(0);
  const [homeAlertController, setHomeAlertController] = useState(0);
  const [wirelessPirMotionSensorAlarm, setWirelessPirMotionSensor] = useState(
    0,
  );
  const [wirelessDoorOpenSensor, setWirelessDoorOpenSensor] = useState(0);
  const [wirelessFireSmokeSensor, setWirelessFireSmokeSensor] = useState(0);
  const [wirelessGasleekAlert, setWirelessGasleekAlert] = useState(0);
  const [
    wirelessPanicButtonWithRope,
    setWirelessPanicButtonWithRope,
  ] = useState(0);
  const [wirelessSensorRemote, setWirelessSensorRemote] = useState(0);

  const handleAddSensor = () => {
    const {
      elderData: { id },
    } = props;
    if (id) {
      const payload = {
        user_id: id,
        sensor_data: [
          {
            name: 'whole_set_of_sensor_box',
            quantity: wholeSetOfSensorBox,
          },
          {
            name: 'home_alert_controller',
            quantity: homeAlertController,
          },
          {
            name: 'wireless_Pir_Motion_Sensor_Alarm',
            quantity: wirelessPirMotionSensorAlarm,
          },
          {
            name: 'wireless_Door_Open_Sensor',
            quantity: wirelessDoorOpenSensor,
          },
          {
            name: 'wireless_Fire_Smoke_Sensor',
            quantity: wirelessFireSmokeSensor,
          },
          {
            name: 'wireless_Gas_leek_Alert',
            quantity: wirelessGasleekAlert,
          },
          {
            name: 'wireless_Panic_Button_With_Rope',
            quantity: wirelessPanicButtonWithRope,
          },
          {
            name: 'wireless_Sensor_Remote',
            quantity: wirelessSensorRemote,
          },
        ],
      };
      ElderServiceInstance.addElderSensorData(payload).then(res => {
        if (res.data) {
          setSensorData(res.data);
          message.success('Sensor Data has been added successfully');
        }
      });
    }
  };

  function renderData() {
    if (isEmpty(sensorData)) {
      return (
        <Card bordered hoverable title="Sensor Details" style={{ width: 500 }}>
          <Row justify="space-between" type="flex">
            <Typography.Text strong key="whole_set_of_sensor_box">
              Whole Set of Sensor Box
            </Typography.Text>
            <InputNumber
              type="number"
              min={0}
              max={99}
              placeholder="Quantity"
              value={wholeSetOfSensorBox}
              onChange={e => setWholeSetOfSensor(e)}
            />
          </Row>
          <Row justify="space-between" type="flex">
            <Typography.Text key="home_alert_controller">
              HOME ALERT CONTROLLER
            </Typography.Text>
            <InputNumber
              type="number"
              min={0}
              max={99}
              placeholder="Quantity"
              value={homeAlertController}
              onChange={e => setHomeAlertController(e)}
            />
          </Row>
          <Row justify="space-between" type="flex">
            <Typography.Text>WIRELESS PIR MOTION SENSOR ALARM</Typography.Text>
            <InputNumber
              type="number"
              min={0}
              max={99}
              placeholder="Quantity"
              value={wirelessPirMotionSensorAlarm}
              onChange={e => setWirelessPirMotionSensor(e)}
            />
          </Row>
          <Row justify="space-between" type="flex">
            <Typography.Text>WIRELESS DOOR/WINDOW OPEN SENSOR</Typography.Text>
            <InputNumber
              type="number"
              min={0}
              max={99}
              placeholder="Quantity"
              value={wirelessDoorOpenSensor}
              onChange={e => setWirelessDoorOpenSensor(e)}
            />
          </Row>
          <Row justify="space-between" type="flex">
            <Typography.Text>WIRELESS FIRE AND SMOKE SENSOR</Typography.Text>
            <InputNumber
              type="number"
              min={0}
              max={99}
              placeholder="Quantity"
              value={wirelessFireSmokeSensor}
              onChange={e => setWirelessFireSmokeSensor(e)}
            />
          </Row>
          <Row justify="space-between" type="flex">
            <Typography.Text>WIRELESS GAS LEAKAGE ALERT</Typography.Text>
            <InputNumber
              type="number"
              min={0}
              max={99}
              placeholder="Quantity"
              value={wirelessGasleekAlert}
              onChange={e => setWirelessGasleekAlert(e)}
            />
          </Row>
          <Row justify="space-between" type="flex">
            <Typography.Text>WIRELESS PANIC BUTTON WITH ROPE</Typography.Text>
            <InputNumber
              type="number"
              min={0}
              max={99}
              placeholder="Quantity"
              value={wirelessPanicButtonWithRope}
              onChange={e => setWirelessPanicButtonWithRope(e)}
            />
          </Row>
          <Row justify="space-between" type="flex">
            <Typography.Text>WIRELESS SENSOR REMOTE</Typography.Text>
            <InputNumber
              type="number"
              min={0}
              max={99}
              placeholder="Quantity"
              value={wirelessSensorRemote}
              onChange={e => setWirelessSensorRemote(e)}
            />
          </Row>
          <Row type="flex" align="middle" justify="center">
            <Button
              onClick={handleAddSensor}
              disabled={checkForSensorAndDocumentationTab(
                props.user,
                props.elderData,
              )}
            >
              Add Sensor Data
            </Button>
          </Row>
        </Card>
      );
    }

    return (
      <Card
        bordered
        hoverable
        title="Update Sensor Details"
        style={{ width: 400 }}
      >
        {map(sensorData, item => (
          <RowUpdateSensorData
            item={item}
            disabled={checkForSensorAndDocumentationTab(
              props.user,
              props.elderData,
            )}
          />
        ))}
      </Card>
    );
  }
  return renderData();
}

export default Sensor;
