import React from "react";
import { map, uniqBy, get } from "lodash";
import moment from "moment";
import { Tag, Row } from "antd";

function ParentServicePersonRowService({
  parentRow,
  parentKey,
  isCheckInShow,
  isShowText,
  parentDate,
  showDailyDocs,
}) {
  const getKeyValue = (text) => {
    if (text && parentKey === "type_of_service") {
      return <div>{text}</div>;
    }
    return <div>{moment(text).format("DD/MM/YYYY hh:mm:ss a")}</div>;
  };

  const getKeyValue2 = (text1, text2) => {
    if (parentKey === "type_of_service") {
      return <div>{text1}</div>;
    }
    return <div>{moment(text2).format("DD/MM/YYYY hh:mm:ss a")}</div>;
  };

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

  function renderData(checkInData, item2) {
    const { type_of_service, service_start_date, responde_data } = item2;

    if (uniqBy(checkInData, "responder_name").length > 0) {
      return map(uniqBy(checkInData, "responder_name"), (item) => (
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
              {isShowText && item.responder_type}
              {isShowText && ` ${item.carer_name} `}
            </Tag>
            {getKeyValue(item2[parentKey])}
          </Tag>
        </Row>
      ));
    }

    if (type_of_service) {
      return (
        <Row>
          <Tag
            color={getTagColor(`${get(responde_data, "responder_type")}`)}
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
              {isShowText && get(responde_data, "responder_type")}
              {isShowText &&
                ` ${get(
                  responde_data,
                  "carer_name",
                  "No Responder Assigned"
                )} `}
            </Tag>
            {getKeyValue2(type_of_service, service_start_date)}
          </Tag>
        </Row>
      );
    }
    return (
      <Tag
        style={{
          width: 120,
          whiteSpace: "pre-wrap",
          margin: 2,
        }}
        color="red"
      >
        "No Services happen"
      </Tag>
    );
  }

  return (
    <Row>
      {map(parentRow, (item) => (
        <Row style={{ margin: 10 }}>{renderData(item.check_in_data, item)}</Row>
      ))}
    </Row>
  );
}

export default ParentServicePersonRowService;
