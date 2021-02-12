import React from "react";
import moment from "moment";
import { Tag } from "antd";
import { round, get } from "lodash";
import { StickyTable, Row, Cell } from "react-sticky-table";

function getDocTable(item, title, labelNotRender, tableLabel, typeName) {
  const objFilter = (val) => {
    let updatedArr;
    if (typeof val === "string") {
      let arr = val.split(",");
      if (arr.length >= 1) {
        updatedArr = arr.filter((a) => {
          return (
            a !== "elderOther" &&
            a !== "meal_type_lunch_other" &&
            a !== "elderOther" &&
            a !== "meal_type_snack_other" &&
            a !== "meal_type_breakfast_other" &&
            a !== "meal_type_dinner_other" &&
            a !== "did_elder_eat_other" &&
            a !== "Physiotherapist_other"
          );
        });
      }
    }
    return updatedArr ? updatedArr.join(", ") : "";
  };

  const getValueInMandKM = (value) => {
    if (value < 1000) {
      return `${value} m`;
    }
    return `${round(value / 1000, 2)} km`;
  };

  const getFancingRadiusValue = (val) => {
    if (val > 500 || val < 0 || val === null) {
      return <Tag color="volcano">{getValueInMandKM(val)}</Tag>;
    }
    return <Tag color="lime">{getValueInMandKM(val)}</Tag>;
  };

  const fieldValue = (label, val, title, items) => {
    if (label === "date") {
      return moment(val).format("DD/MM/YYYY");
    }
    if (
      label === "eldersWakeUpTime" ||
      label === "eldersSleepTime" ||
      label === "time"
    ) {
      if (val === "red_col") {
        return <Tag color="red"> Not Filled</Tag>;
      }
      return moment(val).format("DD/MM/YYYY hh:mm a");
    }

    if (label === "totalScore") {
      if (val === "red_col") {
        return <Tag color="red"> Not Filled</Tag>;
      }
      return <strong>{val}</strong>;
    }
    if (val === "red_col") {
      return <Tag color="red"> Not Filled</Tag>;
    }

    if (typeof val === "string") {
      let arr = val.split(",");
      if (arr.length > 1) {
        const updatedArr = arr.filter((a) => {
          return (
            a !== "elderOther" &&
            a !== "meal_type_lunch_other" &&
            a !== "elderOther" &&
            a !== "meal_type_snack_other" &&
            a !== "meal_type_breakfast_other" &&
            a !== "meal_type_dinner_other" &&
            a !== "did_elder_eat_other" &&
            a !== "Physiotherapist_other"
          );
        });
        val = updatedArr.join(", ");
      }
    }
    if (title === "NO - Case Handover") {
      if (label === "type") {
        return <>{typeName[val]}</>;
      }
      if (
        label === "eldersWakeUpTime" ||
        label === "eldersSleepTime" ||
        label === "time"
      ) {
        return <>{val ? moment(val).format("DD/MM/YYYY hh:mm a") : ""}</>;
      }
    }
    if (title === "INTAKE CHART") {
      let mealtype = "";
      if (label === "whatdideldereat") {
        if (items.mealTypeBreakfast !== "") {
          mealtype = mealtype + objFilter(items.mealTypeBreakfast) + ", ";
        }
        if (items.mealTypeBreakfastOther !== "") {
          mealtype = mealtype + objFilter(items.mealTypeBreakfastOther) + ", ";
        }
        if (items.mealTypeDinner !== "") {
          mealtype = mealtype + objFilter(items.mealTypeDinner) + ", ";
        }
        if (
          typeof items.mealTypeDinnerOther !== "undefined" &&
          items.mealTypeDinnerOther !== ""
        ) {
          mealtype = mealtype + items.mealTypeDinnerOther + ",";
        }
        if (items.mealTypeLunch !== "") {
          mealtype = mealtype + objFilter(items.mealTypeLunch) + ", ";
        }
        if (items.mealTypeLunchOther !== "") {
          mealtype = mealtype + objFilter(items.mealTypeLunchOther) + ", ";
        }
        if (items.mealTypeSnackOther !== "") {
          mealtype = mealtype + objFilter(items.mealTypeSnackOther) + ", ";
        }
        if (items.meal_typeSnack !== "") {
          mealtype = mealtype + objFilter(items.meal_typeSnack) + ", ";
        }
        val = mealtype.replace(/,\s*$/, "");
      }
      if (
        label === "mealTypeBreakfast" ||
        label === "mealTypeBreakfastOther" ||
        label === "mealTypeDinner" ||
        label === "mealTypeLunch" ||
        label === "mealTypeLunchOther" ||
        label === "mealTypeSnackOther" ||
        label === "meal_typeSnack" ||
        label === "mealTypeDinnerOther"
      ) {
        return null;
      }
    }
    if (
      label === "geolocationActive" ||
      label === "geolocationActiveCheckIn" ||
      label === "geolocationActiveCheckOut" ||
      label === "isexplained" ||
      label === "shiftTiming"
    ) {
      return null;
    } else if (
      label === "responderFancingRadius" ||
      label === "responderFancingRadiusCheckIn" ||
      label === "responderFancingRadiusCheckOut"
    ) {
      return getFancingRadiusValue(val);
    } else if (label === "workingHrs") {
      if ((val / 60).toFixed(2) > 24) {
        return (
          <Tag color="red">
            <span class="text-lowercase">
              {val ? (val / 60).toFixed(2) + " hrs." : "-"}
            </span>
          </Tag>
        );
      }
      return (
        <Tag color="green">
          <span class="text-lowercase">
            {val ? (val / 60).toFixed(2) + " hrs." : "-"}
          </span>
        </Tag>
      );
    } else if (label === "measurement") {
      return <div className="text-lowercase">{val}</div>;
    } else if (val) {
      if (
        title === "NF2 - Daily Documentation" ||
        title === "NF1 - Daily Documentation"
      ) {
        switch (val) {
          case "given":
            return <Tag color="#006400">Given</Tag>;
          case "notgiven":
            return <Tag color="#f50">Not Given</Tag>;
          case "notGiven":
            return <Tag color="#f50">Not Given</Tag>;
          case "no":
            return <Tag color="#f50">No</Tag>;
          case "yes":
            return <Tag color="green">Yes</Tag>;
          case "null":
            return <Tag color="red"> Not Filled</Tag>;
          default:
            return <>{tableLabel[val] ? tableLabel[val] : val}</>;
        }
      } else {
        if (val === null || val === "null") {
          return <Tag color="red"> Not Filled</Tag>;
        } else {
          return <>{tableLabel[val] ? tableLabel[val] : val}</>;
        }
      }
    } else {
      return <Tag color="red"> Not Filled</Tag>;
    }
  };

  if (title === "NF1 - Daily Documentation") {
    return (
      <>
        <div
          style={{
            width: "100%",
            height: "400px",
            border: "1px solid #780001",
            marginTop: 20,
            marginBottom: 20,
            backgound: "#dedede",
          }}
        >
          <StickyTable borderColor="#780001">
            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Date</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "date",
                          subsubitem["date"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Time</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "time",
                          subsubitem["time"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Responder Name</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "responseName",
                          subsubitem["responseName"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Responder Type</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "respondertype",
                          subsubitem["respondertype"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">
                Hygiene 1. Oral Care
              </Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "oralcare",
                          subsubitem["oralcare"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">2. Bath</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "bath",
                          subsubitem["bath"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">3. Eye Care</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "eyecare",
                          subsubitem["eyecare"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">4. Hair Care</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "haircare",
                          subsubitem["haircare"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">5. Nail Care</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "nailcare",
                          subsubitem["nailcare"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">6. Foot Care</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "footcare",
                          subsubitem["footcare"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Activities</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "activities",
                          subsubitem["activities"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">
                Social Behaviour 1. Watch TV
              </Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "watchtv",
                          subsubitem["watchtv"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">2. Read Book</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "readbook",
                          subsubitem["readbook"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">3. Go Outside</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "gooutside",
                          subsubitem["gooutside"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">
                Any Change In Condition
              </Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "anychangeincondition",
                          subsubitem["anychangeincondition"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Doctor Visit</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "doctorvisit",
                          subsubitem["doctorvisit"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Fencing Radius</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "responderFancingRadius",
                          subsubitem["responderFancingRadius"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">GEO Location</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "geolocation",
                          subsubitem["geolocation"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>
          </StickyTable>
        </div>
      </>
    );
  }

  if (title === "OUTPUT CHART") {
    return (
      <>
        <div
          style={{
            width: "100%",
            height: "300px",
            border: "1px solid #780001",
            marginTop: 20,
            marginBottom: 20,
            backgound: "#dedede",
          }}
        >
          <StickyTable borderColor="#780001">
            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Date</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "date",
                          subsubitem["date"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Time</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "time",
                          subsubitem["time"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Responder Name</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "responseName",
                          subsubitem["responseName"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Responder Type</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "respondertype",
                          subsubitem["respondertype"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">
                Did Elder Pass Urine?
              </Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "elderpass",
                          subsubitem["elderpass"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">
                Urine Output Quantity
              </Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "elderUrineQuantity",
                          subsubitem["elderUrineQuantity"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">
                Did Elder Pass Stool?
              </Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "stool",
                          subsubitem["stool"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Fencing Radius</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "responderFancingRadius",
                          subsubitem["responderFancingRadius"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">GEO Location</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "geolocation",
                          subsubitem["geolocation"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>
          </StickyTable>
        </div>
      </>
    );
  }

  if (title === "INTAKE CHART") {
    return (
      <>
        <div
          style={{
            width: "100%",
            height: "400px",
            border: "1px solid #780001",
            marginTop: 20,
            marginBottom: 20,
            backgound: "#dedede",
          }}
        >
          <StickyTable borderColor="#780001">
            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Date</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "date",
                          subsubitem["date"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Time</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "time",
                          subsubitem["time"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Responder Name</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "responseName",
                          subsubitem["responseName"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Responder Type</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "respondertype",
                          subsubitem["respondertype"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Meal Type</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "mealType",
                          subsubitem["mealType"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Time Of Meal</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {moment(get(subsubitem, "timeOfMeal", "")).format(
                          "DD/MM/YYYY hh:mm a"
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">
                What Did Elder Eat
              </Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "whatdideldereat",
                          subsubitem["whatdideldereat"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">
                What Did Elder Drink
              </Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "whatdidelderdrink",
                          subsubitem["whatdidelderdrink"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Fencing Radius</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "responderFancingRadius",
                          subsubitem["responderFancingRadius"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">GEO Location</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "geolocation",
                          subsubitem["geolocation"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>
          </StickyTable>
        </div>
      </>
    );
  }

  if (title === "Health Status") {
    return (
      <>
        <div
          style={{
            width: "100%",
            height: "400px",
            border: "1px solid #780001",
            marginTop: 20,
            marginBottom: 20,
            backgound: "#dedede",
          }}
        >
          <StickyTable borderColor="#780001">
            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Date</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "date",
                          subsubitem["date"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Time</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "time",
                          subsubitem["time"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Responder Name</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "responseName",
                          subsubitem["responseName"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Responder Type</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "respondertype",
                          subsubitem["respondertype"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Elder Mood</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "eldermood",
                          subsubitem["eldermood"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Skin Condition</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "skincondition",
                          subsubitem["skincondition"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Pressure Ulcer</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "pressureulcer",
                          subsubitem["pressureulcer"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">
                Mobility 1. History Of Fall
              </Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "historyoffall",
                          subsubitem["historyoffall"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">
                2. Use Of Assistive Device
              </Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "assistivedevice",
                          subsubitem["assistivedevice"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Fencing Radius</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "responderFancingRadius",
                          subsubitem["responderFancingRadius"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">GEO Location</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "geolocation",
                          subsubitem["geolocation"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>
          </StickyTable>
        </div>
      </>
    );
  }

  if (title === "NF2 - Daily Documentation") {
    return (
      <>
        <div
          style={{
            width: "100%",
            height: "400px",
            border: "1px solid #780001",
            marginTop: 20,
            marginBottom: 20,
            backgound: "#dedede",
          }}
        >
          <StickyTable borderColor="#780001">
            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Date</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "date",
                          subsubitem["date"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Time</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "time",
                          subsubitem["time"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Responder Name</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "responseName",
                          subsubitem["responseName"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Responder Type</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "respondertype",
                          subsubitem["respondertype"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">
                Hygiene 1. Oral Care
              </Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "oralcare",
                          subsubitem["oralcare"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">2. Bath</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "bath",
                          subsubitem["bath"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">3. Eye Care</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "eyecare",
                          subsubitem["eyecare"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">4. Hair Care</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "haircare",
                          subsubitem["haircare"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">5. Nail Care</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "nailcare",
                          subsubitem["nailcare"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">6. Foot Care</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "footcare",
                          subsubitem["footcare"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Activities</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "activities",
                          subsubitem["activities"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">
                Social Behaviour 1. Watch TV
              </Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "watchtv",
                          subsubitem["watchtv"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">2. Read Book</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "readbook",
                          subsubitem["readbook"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">3.Go Outside</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "gooutside",
                          subsubitem["gooutside"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">
                Any Change In Condition
              </Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "anychangeincondition",
                          subsubitem["anychangeincondition"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Doctor Visit</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "doctorvisit",
                          subsubitem["doctorvisit"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Fencing Radius</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "responderFancingRadius",
                          subsubitem["responderFancingRadius"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">GEO Location</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "geolocation",
                          subsubitem["geolocation"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>
          </StickyTable>
        </div>
      </>
    );
  }

  if (title === "NO - Case Handover") {
    return null;
  }

  if (title === "Medical Chart") {
    return (
      <>
        <div
          style={{
            width: "100%",
            height: "300px",
            border: "1px solid #780001",
            marginTop: 20,
            marginBottom: 20,
            backgound: "#dedede",
          }}
        >
          <StickyTable borderColor="#780001">
            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Date</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "date",
                          subsubitem["date"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Time</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "time",
                          subsubitem["time"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Responder Name</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "responseName",
                          subsubitem["responseName"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Responder Type</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "respondertype",
                          subsubitem["respondertype"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Foleys Catheter</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "foleysCatheter",
                          subsubitem["foleysCatheter"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">NG Tube</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "ngTube",
                          subsubitem["ngTube"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Tracheostomy</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "tracheostomy",
                          subsubitem["tracheostomy"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Ambulation</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "ambulation",
                          subsubitem["ambulation"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Nebulization</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "nebulization",
                          subsubitem["nebulization"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">
                Spiromtery Exercises
              </Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "spiromteryExercises",
                          subsubitem["spiromteryExercises"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">
                Chest Physiotherapy
              </Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "chestPhysiotherapy",
                          subsubitem["chestPhysiotherapy"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Oxygen Mode</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "oxygenMode",
                          subsubitem["oxygenMode"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Remark</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "remark",
                          subsubitem["remark"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Fencing Radius</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "responderFancingRadius",
                          subsubitem["responderFancingRadius"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">GEO Location</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "geolocation",
                          subsubitem["geolocation"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>
          </StickyTable>
        </div>
      </>
    );
  }

  if (title === "Temperature") {
    return (
      <>
        <div
          style={{
            width: "100%",
            height: "400px",
            border: "1px solid #780001",
            marginTop: 20,
            marginBottom: 20,
            backgound: "#dedede",
          }}
        >
          <StickyTable borderColor="#780001">
            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Date</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "date",
                          subsubitem["date"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Time</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "time",
                          subsubitem["time"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Responder Name</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "responseName",
                          subsubitem["responseName"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Responder Type</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "respondertype",
                          subsubitem["respondertype"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Measurement</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "measurement",
                          subsubitem["measurement"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Mode</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "mode",
                          subsubitem["mode"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">
                Any Specific Intervention
              </Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "anyspecificintervention",
                          subsubitem["anyspecificintervention"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">
                Who Did You Inform
              </Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "whodidyouinform",
                          subsubitem["whodidyouinform"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Fencing Radius</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "responderFancingRadius",
                          subsubitem["responderFancingRadius"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">GEO Location</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "geolocation",
                          subsubitem["geolocation"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>
          </StickyTable>
        </div>
      </>
    );
  }

  if (title === "Blood Sugar") {
    return (
      <>
        <div
          style={{
            width: "100%",
            height: "400px",
            border: "1px solid #780001",
            marginTop: 20,
            marginBottom: 20,
            backgound: "#dedede",
          }}
        >
          <StickyTable borderColor="#780001">
            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Date</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "date",
                          subsubitem["date"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Time</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "time",
                          subsubitem["time"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Responder Name</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "responseName",
                          subsubitem["responseName"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Responder Type</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "respondertype",
                          subsubitem["respondertype"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Measurement</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "measurement",
                          subsubitem["measurement"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Oral Medicine</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "oralMedicine",
                          subsubitem["oralMedicine"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Name Of Medicine</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "nameOfMedicine",
                          subsubitem["nameOfMedicine"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">
                Any Specific Intervention
              </Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "anyspecificintervention",
                          subsubitem["anyspecificintervention"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Unit Of Insulin</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "unitofinsulin",
                          subsubitem["unitofinsulin"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Injection Site</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "injectionsite",
                          subsubitem["injectionsite"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">
                Who Did You Inform
              </Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "whodidyouinform",
                          subsubitem["whodidyouinform"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Fencing Radius</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "responderFancingRadius",
                          subsubitem["responderFancingRadius"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">GEO Location</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "geolocation",
                          subsubitem["geolocation"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>
          </StickyTable>
        </div>
      </>
    );
  }

  if (title === "Blood Pressure") {
    return (
      <>
        <div
          style={{
            width: "100%",
            height: "400px",
            border: "1px solid #780001",
            marginTop: 20,
            marginBottom: 20,
            backgound: "#dedede",
          }}
        >
          <StickyTable borderColor="#780001">
            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Date</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "date",
                          subsubitem["date"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Time</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "time",
                          subsubitem["time"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Responder Name</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "responseName",
                          subsubitem["responseName"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Responder Type</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "respondertype",
                          subsubitem["respondertype"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Systolic</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "systolic",
                          subsubitem["systolic"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Diastolic</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "diastolic",
                          subsubitem["diastolic"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">
                Any Specific Interventions Done
              </Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "specificIntervention",
                          subsubitem["specificIntervention"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">
                Who Did You Inform
              </Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "whodidyouinform",
                          subsubitem["whodidyouinform"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Fencing Radius</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "responderFancingRadius",
                          subsubitem["responderFancingRadius"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">GEO Location</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "geolocation",
                          subsubitem["geolocation"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>
          </StickyTable>
        </div>
      </>
    );
  }

  if (title === "Respiration") {
    return (
      <>
        <div
          style={{
            width: "100%",
            height: "300px",
            border: "1px solid #780001",
            marginTop: 20,
            marginBottom: 20,
            backgound: "#dedede",
          }}
        >
          <StickyTable borderColor="#780001">
            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Date</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "date",
                          subsubitem["date"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Time</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "time",
                          subsubitem["time"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Responder Name</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "responseName",
                          subsubitem["responseName"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Responder Type</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "respondertype",
                          subsubitem["respondertype"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Measurement</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "measurement",
                          subsubitem["measurement"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">
                Any Specific Interventions Done
              </Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "anyspecificintervention",
                          subsubitem["anyspecificintervention"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">
                Who Did You Inform
              </Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "whodidyouinform",
                          subsubitem["whodidyouinform"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Fencing Radius</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "responderFancingRadius",
                          subsubitem["responderFancingRadius"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">GEO Location</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "geolocation",
                          subsubitem["geolocation"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>
          </StickyTable>
        </div>
      </>
    );
  }

  if (title === "Pulse") {
    return (
      <>
        <div
          style={{
            width: "100%",
            height: "300px",
            border: "1px solid #780001",
            marginTop: 20,
            marginBottom: 20,
            backgound: "#dedede",
          }}
        >
          <StickyTable borderColor="#780001">
            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Date</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "date",
                          subsubitem["date"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Time</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "time",
                          subsubitem["time"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Responder Name</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "responseName",
                          subsubitem["responseName"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Responder Type</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "respondertype",
                          subsubitem["respondertype"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Measurement</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "measurement",
                          subsubitem["measurement"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">
                Any Specific Interventions Done
              </Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "anyspecificintervention",
                          subsubitem["anyspecificintervention"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">
                Who Did You Inform
              </Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "whodidyouinform",
                          subsubitem["whodidyouinform"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Fencing Radius</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "responderFancingRadius",
                          subsubitem["responderFancingRadius"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">GEO Location</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "geolocation",
                          subsubitem["geolocation"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>
          </StickyTable>
        </div>
      </>
    );
  }

  if (title === "Oxygen Saturation") {
    return (
      <>
        <div
          style={{
            width: "100%",
            height: "300px",
            border: "1px solid #780001",
            marginTop: 20,
            marginBottom: 20,
            backgound: "#dedede",
          }}
        >
          <StickyTable borderColor="#780001">
            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Date</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "date",
                          subsubitem["date"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Time</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "time",
                          subsubitem["time"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Responder Name</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "responseName",
                          subsubitem["responseName"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Responder Type</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "respondertype",
                          subsubitem["respondertype"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Measurement</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "measurement",
                          subsubitem["measurement"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">
                Any Specific Interventions Done
              </Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "anyspecificintervention",
                          subsubitem["anyspecificintervention"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">
                Who Did You Inform
              </Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "whodidyouinform",
                          subsubitem["whodidyouinform"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Fencing Radius</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "responderFancingRadius",
                          subsubitem["responderFancingRadius"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">GEO Location</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "geolocation",
                          subsubitem["geolocation"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>
          </StickyTable>
        </div>
      </>
    );
  }

  if (title === "Pain") {
    return (
      <>
        <div
          style={{
            width: "100%",
            height: "300px",
            border: "1px solid #780001",
            marginTop: 20,
            marginBottom: 20,
            backgound: "#dedede",
          }}
        >
          <StickyTable borderColor="#780001">
            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Date</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "date",
                          subsubitem["date"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Time</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "time",
                          subsubitem["time"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Responder Name</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "responseName",
                          subsubitem["responseName"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Responder Type</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "respondertype",
                          subsubitem["respondertype"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Measurement</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "measurement",
                          subsubitem["measurement"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">
                Any Specific Interventions Done
              </Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "anyspecificintervention",
                          subsubitem["anyspecificintervention"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">
                Who Did You Inform
              </Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "whodidyouinform",
                          subsubitem["whodidyouinform"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Fencing Radius</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "responderFancingRadius",
                          subsubitem["responderFancingRadius"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">GEO Location</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "geolocation",
                          subsubitem["geolocation"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>
          </StickyTable>
        </div>
      </>
    );
  }

  if (title === "Medical Consumables") {
    return (
      <>
        <div
          style={{
            width: "100%",
            height: "300px",
            border: "1px solid #780001",
            marginTop: 20,
            marginBottom: 20,
            backgound: "#dedede",
          }}
        >
          <StickyTable borderColor="#780001">
            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Date</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "date",
                          subsubitem["date"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Time</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "time",
                          subsubitem["time"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Responder Name</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "responseName",
                          subsubitem["responseName"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Responder Type</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "respondertype",
                          subsubitem["respondertype"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Diapers Used</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "diapersUsed",
                          subsubitem["diapersUsed"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Gloves Used</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "glovesUsed",
                          subsubitem["glovesUsed"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Wipes Used</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "wipesUsed",
                          subsubitem["wipesUsed"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Other</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "medicalConsumablesOther",
                          subsubitem["medicalConsumablesOther"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Fencing Radius</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "responderFancingRadius",
                          subsubitem["responderFancingRadius"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">GEO Location</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "geolocation",
                          subsubitem["geolocation"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>
          </StickyTable>
        </div>
      </>
    );
  }

  if (title === "Braden Score") {
    return (
      <>
        <div
          style={{
            width: "100%",
            height: "400px",
            border: "1px solid #780001",
            marginTop: 20,
            marginBottom: 20,
            backgound: "#dedede",
          }}
        >
          <StickyTable borderColor="#780001">
            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Date</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "date",
                          subsubitem["date"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Time</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "time",
                          subsubitem["time"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Responder Name</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "responseName",
                          subsubitem["responseName"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Responder Type</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "respondertype",
                          subsubitem["respondertype"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Total Score</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "totalScore",
                          subsubitem["totalScore"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Mobility</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "mobility",
                          subsubitem["mobility"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Moisture</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "moisture",
                          subsubitem["moisture"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Activity</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "activity",
                          subsubitem["activity"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">
                Sensory Perception
              </Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "sensoryPerception",
                          subsubitem["sensoryPerception"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Nutrition</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "nutrition",
                          subsubitem["nutrition"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Friction Shear</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "frictionShear",
                          subsubitem["frictionShear"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Fencing Radius</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "responderFancingRadius",
                          subsubitem["responderFancingRadius"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">GEO Location</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "geolocation",
                          subsubitem["geolocation"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>
          </StickyTable>
        </div>
      </>
    );
  }

  if (title === "Morsefall Scale") {
    return (
      <>
        <div
          style={{
            width: "100%",
            height: "400px",
            border: "1px solid #780001",
            marginTop: 20,
            marginBottom: 20,
            backgound: "#dedede",
          }}
        >
          <StickyTable borderColor="#780001">
            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Date</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "date",
                          subsubitem["date"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Time</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "time",
                          subsubitem["time"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Responder Name</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "responseName",
                          subsubitem["responseName"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Responder Type</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "respondertype",
                          subsubitem["respondertype"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Total Score</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "totalScore",
                          subsubitem["totalScore"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">History Of Fall</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "historyOfFall",
                          subsubitem["historyOfFall"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">
                Secondary Diagnosis
              </Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "secondaryDiagnosis",
                          subsubitem["secondaryDiagnosis"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Ambulatory Aid</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "ambulatoryAid",
                          subsubitem["ambulatoryAid"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">IVTherapy</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "IVTherapy",
                          subsubitem["IVTherapy"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Gait</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "gait",
                          subsubitem["gait"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Mental Status</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "mentalStatus",
                          subsubitem["mentalStatus"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Fencing Radius</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "responderFancingRadius",
                          subsubitem["responderFancingRadius"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">GEO Location</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "geolocation",
                          subsubitem["geolocation"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>
          </StickyTable>
        </div>
      </>
    );
  }

  if (title === "Emergency Record" || title === "Emergency Input") {
    return (
      <>
        <div
          style={{
            width: "100%",
            height: "400px",
            border: "1px solid #780001",
            marginTop: 20,
            marginBottom: 20,
            backgound: "#dedede",
          }}
        >
          <StickyTable borderColor="#780001">
            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Date</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "date",
                          subsubitem["date"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>
            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Time</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "time",
                          subsubitem["time"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>
            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Responder Name</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "responseName",
                          subsubitem["responseName"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>
            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Responder Type</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "respondertype",
                          subsubitem["respondertype"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>
            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Emergency Type</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "emergencytype",
                          subsubitem["emergencytype"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">
                Location Of Incident
              </Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "incidentlocation",
                          subsubitem["incidentlocation"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Witness Name</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "witnessname",
                          subsubitem["witnessname"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">
                Did The Incident Resulted In A Transfer To The Hospital?
              </Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "didhospitalised",
                          subsubitem["didhospitalised"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">
                Name Of Accompany
              </Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "nameofaccompany",
                          subsubitem["nameofaccompany"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">
                Did You Call Your Emoha Nursing Officer?
              </Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "didcallemoha",
                          subsubitem["didcallemoha"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">
                IF Yes What Time Did You Call?
              </Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "timeofemohacall",
                          subsubitem["timeofemohacall"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">
                Did You Call The Emoha Emergency Number?
              </Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "timeofNOcall",
                          subsubitem["timeofNOcall"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">
                IF Yes What Time Did You Call?
              </Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "didcallNO",
                          subsubitem["didcallNO"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">What Happen</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "whatHappen",
                          subsubitem["whatHappen"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>
            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">What Did You Do?</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "actiontaken",
                          subsubitem["actiontaken"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">
                What Is The Conclusion?
              </Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "conclusion",
                          subsubitem["conclusion"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">GEO Location</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "geolocation",
                          subsubitem["geolocation"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Fencing Radius</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "responderFancingRadius",
                          subsubitem["responderFancingRadius"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>
          </StickyTable>
        </div>
      </>
    );
  }

  if (title === "Attendance") {
    return (
      <>
        <div
          style={{
            width: "100%",
            height: "400px",
            border: "1px solid #780001",
            marginTop: 20,
            marginBottom: 20,
            backgound: "#dedede",
            zIndex: 0,
          }}
        >
          <StickyTable borderColor="#780001">
            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Date</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "date",
                          subsubitem["date"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>
            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Responder Name</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "responseName",
                          subsubitem["responseName"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>
            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Responder Type</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "responderType",
                          subsubitem["responderType"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Check In Time</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {subsubitem.checkInTime !== "red_col" ? (
                          moment(get(subsubitem, "checkInTime", "")).format(
                            "DD/MM/YYYY hh:mm a"
                          )
                        ) : (
                          <Tag color="red">Not Filled </Tag>
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Check Out Time</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {subsubitem.checkOutTime !== "red_col" ? (
                          moment(get(subsubitem, "checkOutTime", "")).format(
                            "DD/MM/YYYY hh:mm a"
                          )
                        ) : (
                          <Tag color="red">Not Filled </Tag>
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">Working Hrs.</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "workingHrs",
                          subsubitem["workingHrs"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">
                Fencing Radius(CheckIn)
              </Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "responderFancingRadiusCheckIn",
                          subsubitem["responderFancingRadiusCheckIn"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">GEO CheckIn</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "geolocationCheckIn",
                          subsubitem["geolocationCheckIn"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">
                Fencing Radius(CheckOut)
              </Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "responderFancingRadiusCheckOut",
                          subsubitem["responderFancingRadiusCheckOut"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>

            <Row key={Math.random().toString(36).substring(7)}>
              <Cell className="sticky-table-cell-header">GEO CheckOut</Cell>
              {Object.keys(item.list).length > 0 ? (
                Object.keys(item.list).map((subItem) => {
                  let a = 0;
                  return item.list[subItem].map((subsubitem) => {
                    return (
                      <Cell>
                        {fieldValue(
                          "geolocationCheckOut",
                          subsubitem["geolocationCheckOut"],
                          item.title,
                          subsubitem
                        )}
                      </Cell>
                    );
                  });
                })
              ) : (
                <div className="txt_nodata">No Data Found</div>
              )}
            </Row>
          </StickyTable>
        </div>
      </>
    );
  }
}

export default getDocTable;
