import React from "react";
import { Card, Descriptions } from "antd";
import { get, toString } from "lodash";
import PropTypes from "prop-types";

const propTypes = {
  nodeData: PropTypes.object.isRequired,
};

const MyNode = ({ nodeData }) => {
  return (
    <div>
      <Card
        title={get(nodeData, "name")}
        hoverable
      >
        <Descriptions size="small" bordered>
          <Descriptions.Item label="title" span={4}>
            {get(nodeData, "title", "n/a")}
          </Descriptions.Item>
          <Descriptions.Item label="relationship" span={4}>
            {get(nodeData, "relationship", "n/a")}
          </Descriptions.Item>
          <Descriptions.Item label="Phone No" span={4}>
            {get(nodeData, "phoneNo", "n/a")}
          </Descriptions.Item>
          <Descriptions.Item label="Is Nok" span={4}>
            {toString(get(nodeData, "is_nok", "n/a"))}
          </Descriptions.Item>
          <Descriptions.Item label="Is emrgency_contact" span={4}>
            {toString(get(nodeData, "is_emrgency_contact", "n/a"))}
          </Descriptions.Item>
          <Descriptions.Item label="City" span={4}>
            {get(nodeData, "city", "n/a")}
          </Descriptions.Item>
          <Descriptions.Item label="Gender" span={4}>
            {get(nodeData, "gender", "n/a")}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};

MyNode.propTypes = propTypes;

export default MyNode;
