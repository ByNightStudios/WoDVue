import React from "react";
import { map, uniqBy } from "lodash";
import moment from "moment";
import { Tag, Col, Row, Typography } from "antd";
import ServicePersonRow from "./ServicePersonRow";

const { Text } = Typography;

function ParentServicePersonRow({
  parentRow,
  parentKey,
  isCheckInShow,
  isShowText,
  parentDate,
  showDailyDocs,
}) {
  return (
    <Row>
      {map(parentRow, (item) => (
        <Row style={{ margin: 10 }}>
          {
            <ServicePersonRow
              checkInData={uniqBy(item.check_in_data, "carer_name")}
              itemKey={parentKey}
              isCheckInShow={isCheckInShow}
              isShowText={isShowText}
              showDailyDocs={showDailyDocs}
              responderData={item.responde_data}
              {...item}
            />
          }
        </Row>
      ))}
    </Row>
  );
}

export default ParentServicePersonRow;
