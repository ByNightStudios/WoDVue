import React from "react";
import { map, get, uniqBy, isNull, isUndefined, isNaN } from "lodash";
import moment from "moment";
import { Tag, Col, Row, Typography } from "antd";

const { Text } = Typography;

function ServicePersonRow(props) {
  const {
    checkInData,
    key,
    isCheckInShow,
    isShowText,
    showDailyDocs,
    itemKey,
    responderData,
  } = props;

  function getTagColor(text) {
    switch (text) {
      case "CA":
        return "geekblue";
      case "CP":
        return "blue";
      case "NO":
        return "cyan";
      default:
        return "red";
    }
  }

  function getRenderTime(item, itemKey) {
    if (item[itemKey]) {
      return moment(item[itemKey]).format("DD/MM/YYYY hh:mm:ss a");
    }
    if (isNull(item[itemKey])) {
      return (
        <Tag
          color="red"
          style={{
            width: 120,
            whiteSpace: "pre-wrap",
            margin: 2,
          }}
        >{`Check Out pending`}</Tag>
      );
    }
  }

  function getRenderDoc(itemData) {
    if (get(itemData, "daily_doc", "").length > 0) {
      return (
        <Tag
          color="red"
          style={{
            width: 120,
            whiteSpace: "pre-wrap",
            margin: 2,
          }}
        >
          {get(itemData, "daily_doc", "No Data Found")}
        </Tag>
      );
    }
    return <Tag color="green">All forms are filled</Tag>;
  }

  function getRenderWorkingHrs(item) {
    const { checkin_time, checkout_time } = item;
    const a = moment(checkout_time);
    const b = moment(checkin_time);

    if (itemKey === "working_hrs" && !isNaN(a.diff(b, "hours"))) {
      return `${(a.diff(b, "hours")/ 60).toFixed(2)} hrs`;
    }
    if (itemKey === "working_hrs") {
      return (
        <Tag
          color="red"
          style={{
            width: 120,
            whiteSpace: "pre-wrap",
            margin: 2,
          }}
        >{`CheckOut Time is pending`}</Tag>
      );
    }
  }

  function renderData() {
    const uniqData = checkInData;
    if (uniqData.length > 0) {
      return map(uniqData, (item) => (
        <Row>
          <Tag
            color={getTagColor(`${item.responder_type}`)}
            style={{
              width: 150,
              whiteSpace: "pre-wrap",
              margin: 2,
            }}
          >
            <Tag
              style={{
                width: 120,
                whiteSpace: "pre-wrap",
                margin: 2,
              }}
            >
              {isShowText &&
                get(
                  item,
                  "responder_type",
                  get(responderData, "responder_type")
                )}
              ,
              {isShowText &&
                get(
                  item,
                  "carer_name",
                  get(responderData, "carer_name", "No Responder Assigned")
                )}
            </Tag>
            <br />
            {getRenderWorkingHrs(item)}
            {showDailyDocs && getRenderDoc(item)}
            {isCheckInShow && getRenderTime(item, itemKey)}
          </Tag>
        </Row>
      ));
    }
    return (
      <Tag
        color="red"
        style={{
          width: 120,
          whiteSpace: "pre-wrap",
          margin: 2,
        }}
      >
        No Responder Assigned
      </Tag>
    );
  }

  return <Row>{renderData()}</Row>;
}

export default ServicePersonRow;
