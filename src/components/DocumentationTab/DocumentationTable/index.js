import React from "react";
import moment from "moment";
import { map, get, isInteger, isEmpty } from "lodash";
import { Tag, Typography, Card, Result, Empty } from "antd";
import { StickyTable, Row, Cell } from "react-sticky-table";
import "./style.scss";

const { Title } = Typography;

function DocumentationTable(props) {
  const { columns, dataSource } = props;
  const renderResponderName = (text) => {
    if (text == 1) {
      return "Care Partner";
    }
    if (text == 2) {
      return "Care Angel";
    }
    if (text == 3) {
      return "Nursing Officer";
    }
    return 0;
  };

  const renderConditionalRendering = (text) => {
    if (text > 0 && isInteger(text)) {
      return <Tag color="green">Filled</Tag>;
    }
    if (text && text !== "Invalid date" && text !== "Date") {
      return text;
    }

    return <Tag color="red">Not Filled</Tag>;
  };

  const getRenderTable = () => {
    if (isEmpty(dataSource)) {
      return (
        <Empty
          image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
          imageStyle={{
            height: 60,
          }}
          style={{ width: "100%" }}
          description={<span>No Data Found</span>}
        ></Empty>
      );
    }
    return (
      <div style={{ width: "100%", height: "400px", zIndex: 9 }}>
        <StickyTable borderColor="#780001" borderWidth={1}>
          <Row key={Math.random()}>
            <Cell className="table-col-header table-col-header-date">Date</Cell>
            {map(dataSource, (item) => (
              <Cell className="table-col-header">
                {renderConditionalRendering(
                  moment(get(item, "date")).format("DD/MM/YYYY")
                )}
              </Cell>
            ))}
          </Row>
          <Row key={Math.random()}>
            <Cell className="table-col-header">Responder Name</Cell>
            {map(dataSource, (item) => (
              <Cell className="table-col-data">
                {renderConditionalRendering(get(item, "responseName", 0))}
              </Cell>
            ))}
          </Row>
          <Row key={Math.random()}>
            <Cell className="table-col-header">Responder Type</Cell>
            {map(dataSource, (item) => (
              <Cell className="table-col-data">
                {renderConditionalRendering(
                  renderResponderName(get(item, "responder_type", 0))
                )}
              </Cell>
            ))}
          </Row>{" "}
          <Row key={Math.random()}>
            <Cell className="table-col-header">Daily Documentation</Cell>
            {map(dataSource, (item) => (
              <Cell className="table-col-data">
                {renderConditionalRendering(
                  get(item, "form.dailyDocumentation", 0)
                )}
              </Cell>
            ))}
          </Row>{" "}
          <Row key={Math.random()}>
            <Cell className="table-col-header">Health status</Cell>
            {map(dataSource, (item) => (
              <Cell className="table-col-data">
                {renderConditionalRendering(get(item, "form.healthStatus", 0))}
              </Cell>
            ))}
          </Row>{" "}
          <Row key={Math.random()}>
            <Cell className="table-col-header">Medical Care Chart</Cell>
            {map(dataSource, (item) => (
              <Cell className="table-col-data">
                {renderConditionalRendering(get(item, "form.medicalChart", 0))}
              </Cell>
            ))}
          </Row>{" "}
          <Row key={Math.random()}>
            <Cell className="table-col-header">Intake Chart</Cell>
            {map(dataSource, (item) => (
              <Cell className="table-col-data">
                {renderConditionalRendering(get(item, "form.intekChart", 0))}
              </Cell>
            ))}
          </Row>{" "}
          <Row key={Math.random()}>
            <Cell className="table-col-header">Output Chart</Cell>
            {map(dataSource, (item) => (
              <Cell className="table-col-data">
                {renderConditionalRendering(get(item, "form.outputChart", 0))}
              </Cell>
            ))}
          </Row>{" "}
          <Row key={Math.random()}>
            <Cell className="table-col-header">Medical Consumables</Cell>
            {map(dataSource, (item) => (
              <Cell className="table-col-data">
                {renderConditionalRendering(
                  get(item, "form.medicalConsumables", 0)
                )}
              </Cell>
            ))}
          </Row>{" "}
          <Row key={Math.random()}>
            <Cell className="table-col-header">Vital Sign - Temperature</Cell>
            {map(dataSource, (item) => (
              <Cell className="table-col-data">
                {renderConditionalRendering(get(item, "form.temperature", 0))}
              </Cell>
            ))}
          </Row>{" "}
          <Row key={Math.random()}>
            <Cell className="table-col-header">Vital Sign - Respiration</Cell>
            {map(dataSource, (item) => (
              <Cell className="table-col-data">
                {renderConditionalRendering(get(item, "form.respiratory", 0))}
              </Cell>
            ))}
          </Row>{" "}
          <Row key={Math.random()}>
            <Cell className="table-col-header">Vital Sign - Pulse</Cell>
            {map(dataSource, (item) => (
              <Cell className="table-col-data">
                {renderConditionalRendering(get(item, "form.pulseRate", 0))}
              </Cell>
            ))}
          </Row>{" "}
          <Row key={Math.random()}>
            <Cell className="table-col-header">
              Vital Sign - Blood Pressure
            </Cell>
            {map(dataSource, (item) => (
              <Cell className="table-col-data">
                {renderConditionalRendering(get(item, "form.bloodPressure", 0))}
              </Cell>
            ))}
          </Row>{" "}
          <Row key={Math.random()}>
            <Cell className="table-col-header">Vital Sign - Pain</Cell>
            {map(dataSource, (item) => (
              <Cell className="table-col-data">
                {renderConditionalRendering(get(item, "form.bloodSugar", 0))}
              </Cell>
            ))}
          </Row>{" "}
          <Row key={Math.random()}>
            <Cell className="table-col-header">Blood Sugar</Cell>
            {map(dataSource, (item) => (
              <Cell className="table-col-data">
                {renderConditionalRendering(get(item, "form.painScore", 0))}
              </Cell>
            ))}
          </Row>{" "}
          <Row key={Math.random()}>
            <Cell className="table-col-header">Oxygen Saturation</Cell>
            {map(dataSource, (item) => (
              <Cell className="table-col-data">
                {renderConditionalRendering(
                  get(item, "form.oxygenSaturation", 0)
                )}
              </Cell>
            ))}
          </Row>{" "}
          <Row key={Math.random()}>
            <Cell className="table-col-header">Morse Fall Scale</Cell>
            {map(dataSource, (item) => (
              <Cell className="table-col-data">
                {renderConditionalRendering(
                  get(item, "form.morsefallScale", 0)
                )}
              </Cell>
            ))}
          </Row>{" "}
          <Row key={Math.random()}>
            <Cell className="table-col-header">Braden Score</Cell>
            {map(dataSource, (item) => (
              <Cell className="table-col-data">
                {renderConditionalRendering(get(item, "form.pressureRiskMgmt", 0))}
              </Cell>
            ))}
          </Row>{" "}
          <Row key={Math.random()}>
            <Cell className="table-col-header">Check In (Time)</Cell>
            {map(dataSource, (item) => (
              <Cell className="table-col-data">
                {renderConditionalRendering(
                  moment(get(item, "checkin_time", "")).format(
                    "DD/MM/YYYY hh:mm a"
                  )
                )}
              </Cell>
            ))}
          </Row>{" "}
          <Row key={Math.random()}>
            <Cell className="table-col-header">Check Out (Time)</Cell>
            {map(dataSource, (item) => (
              <Cell className="table-col-data">
                {renderConditionalRendering(
                  moment(get(item, "checkout_time", "")).format(
                    "DD/MM/YYYY hh:mm a"
                  )
                )}
              </Cell>
            ))}
          </Row>{" "}
        </StickyTable>
      </div>
    );
  };
  return (
    <Card
      bordered
      title="Documentation Status Dashboard"
      className="d-flex flex-column"
      style={{ marginTop: 40, marginBottom: 40 }}
    >
      {getRenderTable()}
    </Card>
  );
}

export default DocumentationTable;
