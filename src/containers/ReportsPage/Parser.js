export const transformStateToPayload = currentState => {
  let dataPayload = {};
  Object.keys(currentState).map((item, index) => {
    if (item === "startValue") {
      return (dataPayload["start_date"] = currentState[item]);
    } else if (item === "endValue") {
      return (dataPayload["end_date"] = currentState[item]);
    } else if (item === "reportFormat") {
      return (dataPayload["format"] = currentState[item]);
    } else {
      return null;
    }
  });
  return dataPayload;
};
