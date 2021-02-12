import React, { useEffect, useState } from "react";
import { Row, Typography, InputNumber, Button, message } from "antd";
import { capitalize, split, join } from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";

import ElderService from "../dataManager";

const ElderServiceInstance = new ElderService();

message.config({
  top: 80,
  maxCount: 1,
});

function RowUpdateSensorData({ item, disabled }) {
  const { name, quantity, uuid } = item;
  const [quantityData, setQuantityData] = useState(0);
  useEffect(() => {
    setQuantityData(quantity);
  }, []);

  function handleUpdateSensorData() {
    const payload = { name, quantity: quantityData };
    ElderServiceInstance.updateElderSensorData(uuid, payload).then((res) => {
      if (res.data) {
        message.success(
          ` ${getSensorName(name)} has been updated successfully`
        );
      }
    });
  }

  const getSensorName = (text) => {
    return capitalize(join(split(text, "_"), " "));
  };
  return (
    <Row justify="space-between" type="flex">
      <Typography.Text strong key="whole_set_of_sensor_box">
        {getSensorName(name)}
      </Typography.Text>
      <span>
        <InputNumber
          type="number"
          min={0}
          max={99}
          placeholder="Quantity"
          value={quantityData}
          onChange={(e) => setQuantityData(e)}
        />
        <Button type="dashed" shape="circle" onClick={handleUpdateSensorData} disabled={disabled}>
          <FontAwesomeIcon icon={faSave} />
        </Button>
      </span>
    </Row>
  );
}

export default RowUpdateSensorData;
