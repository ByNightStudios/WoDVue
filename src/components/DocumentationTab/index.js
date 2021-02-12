import React from "react";
import styles from "./documentation-tab.scss";
import { Button, Form } from "react-bootstrap";
import { StickyTable, Row, Cell } from "react-sticky-table";
import ElderService from "../../service/ElderService";
import {
  notification,
  Radio,
  Input,
  DatePicker,
  Table,
  Tag,
  message,
  Card,
  Result,
  Empty,
} from "antd";
import moment from "moment";
import Select from "react-select";
import { connect } from "react-redux";
import {
  includes,
  sortBy,
  round,
  orderBy,
  isEmpty,
  flattenDeep,
  get,
} from "lodash";
import { getResponderConfig } from "../../actions/ConfigActions";
import { ELDERDATA } from "../../common/backendConstants";
import DocumentationTable from "./DocumentationTable";
import { dateFormat } from "highcharts";
import getEmptyObj from "./getEmptyObj";
import getDocTable from "./getDocumentationTable";

const form_type = [
  {
    label: "Common Forms",
    options: [
      { value: "Pressure Risk Mgmt", label: "Braden Score" },
      { value: "Daily Documentation", label: "Daily Documentation" },
      { value: "Medical Consumables", label: "Medical Consumables" },
      { value: "Morsefall Scale", label: "Morsefall Scale" },
      { value: "Health Status", label: "Health Status" },
      { value: "INTAKE CHART", label: "Intake Chart" },
      { value: "OUTPUT CHART", label: "Output Chart" },
      { value: "Emergency Record", label: "Emergency Record" },
    ],
  },
  {
    label: "Care Angel(CA)",
    options: [{ value: "Medical Chart", label: "Medical Chart" }],
  },
  {
    label: "Nursing Officer(NO)",
    options: [{ value: "Case Handover", label: "Case Handover" }],
  },
  {
    label: "Vital Sign Chart",
    options: [
      { value: "Temperature", label: "Temperature" },
      { value: "Blood Sugar", label: "Blood Sugar" },
      { value: "Blood Pressure", label: "Blood Pressure" },
      { value: "Respiration", label: "Respiration" },
      { value: "Pulse", label: "Pulse Rate" },
      { value: "Oxygen Saturation", label: "Oxygen Saturation" },
      { value: "Pain", label: "Pain Score" },
    ],
  },
];

const tableLabel = {
  Nf1: "Care Partner",
  Nf2: "Care Angel",
  No: "Nursing Officer",
  NO: "Nursing Officer",
  respondertype: "Responder Type",
  responseName: "Responder Name",
  anyspecificintervention: "Any Specific Intervention",
  specificIntervention: "Any Specific interventions Done",
  whodidyouinform: "Who did you inform",
  oralcare: "Oral Care",
  shiftTiming: "Shift Timing",
  haircare: "Hair Care",
  nailcare: "Nail Care",
  eyecare: "Eye Care",
  footcare: "Foot Care",
  watchtv: "Watch TV",
  readbook: "Read Book",
  gooutside: "Go Outside",
  anychangeincondition: "Any Change in Condition",
  doctorvisit: "Doctor Visit",
  geolocation: "GEO Location",
  geolocationActive: "GEO Active",
  ambulatoryAid: "Ambulatory Aid",
  fallHistory: "Fall History",
  mentalStatus: "Mental Status",
  totalScore: "Total Score",
  eldermood: "Elder Mood",
  skincondition: "Skin Condition",
  pressureulcer: "Pressure Ulcer",
  historyoffall: "History of Fall",
  assistivedevice: "Assistive Device",
  whatdidelderdrink: "What did Elder Drink",
  whatdideldereat: "What did Elder Eat",
  elderpass: "Did elder pass Urine?",
  frictionShear: "Friction Shear",
  sensoryPerception: "Sensory Perception",
  chestPhysiotherapy: "Chest Physiotherapy",
  foleysCatheter: "Foleys Catheter",
  ngTube: "NG Tube",
  oxygenMode: "Oxygen Mode",
  spiromteryExercises: "Spiromtery Exercises",
  unitofinsulin: "Unit of Insulin",
  injectionsite: "Injection Site",
  emergencyhappenother: "Emergency happen other",
  witnessname: "Witness Name",
  incidentlocation: "Location Of Incident",
  didhospitalised: "Did the incident resulted in a transfer to the hospital?",
  nameofaccompany: "Name of Accompany",
  emergencytype: "Type Of Emergency",
  didcallNO: "IF Yes What time did you Call?",
  timeofNOcall: "Did You Call The Emoha Emergency Number?",
  didcallemoha: "Did You Call Your Emoha Nursing Officer?",
  timeofemohacall: "IF Yes What time did you Call?",
  actiontaken: "What Did You Do?",
  conclusion: "What Is The Conclusion?",
  geolocationActiveCheckIn: "GEO Location Active",
  geolocationCheckIn: "GEO CheckIn",
  geolocationCheckOut: "GEO CheckOut",
  responderType: "Responder Type",
  geolocationActiveCheckOut: "Geo Active CheckOut",
  checkInDate: "Check In Date",
  checkInTime: "Check In Time",
  checkOutDate: "Check Out Date",
  checkOutTime: "Check Out Time",
  workingHrs: "Working Hrs.",
  specialInstruction: "Specific Instruction",
  pressureUlcer: "Pressure Ulcer",
  walksclutchingonwall: "Walks Clutching on Wall",
  completeimmobile: "Complete Immobile",
  rebreathermask: "Rebreather Mask",
  notOk: "Not Ok",
  outsideHome: "Outside Home",
  crutchescanewalker: "Crutch Cane Walker",
  orientedtoownability: "Oriented to own Ability",
  potentialproblem: "Potential Problem",
  verylimited: "Very Limited",
  noimpairmentlimited: "No Impairment Limited",
  diapersUsed: "Diapers Used",
  glovesUsed: "gloves Used",
  wipesUsed: "Wipes Used",
  medicalConsumablesOther: "Other Medical Consumables",
  mealType: "Meal Type",
  timeOfMeal: "Time Of Meal",
  mealTypeBreakfast: "Meal Type - Breakfast",
  mealTypeBreakfastOther: "Breakfast(Other)",
  mealTypeDinner: "Meal Type - Dinner",
  mealTypeLunch: "Meal Type - Lunch",
  mealTypeLunchOther: "Lunch(Other)",
  meal_typeSnack: "Meal Type - Snack",
  mealTypeSnackOther: "Snack(Other)",
  emergencyHappen: "What Happened?",
  emergencyHappenYes: "Emergency Happen Yes",
  historyOfFall: "History Of Fall",
  secondaryDiagnosis: "Secondary Diagnosis",
  responderFancingRadius: "Fencing Radius",
  stool: "Did elder pass Stool?",
  oralMedicine: "Oral Medicine",
  nameOfMedicine: "Name Of Medicine",
  responderFancingRadiusCheckIn: "Fencing Radius(CheckIn)",
  wheelchairnurseassissted: "Wheelchair/Nurse Assissted",
  normalbormal: "Normal/Normal",
  emergencyTypeOther: "Emergency Type Other",
  whatHappen: "What Happen",
  responderFancingRadiusCheckOut: "Fencing Radius(CheckOut)",
  eldersWakeUpTime: "Elder's Wake up time",
  eldersSleepTime: "Elder's Sleep time",
  anySpecialInstructions: "Any Special Instructions",
  isexplained: "Explain CA/CP",
  socialBehaviour: "Social Behaviour",
  socialbehaviour: "Social Behaviour",
};

const typeName = {
  1: "Reading Book",
  2: "Reading Newspaper",
  3: "Taking a walk",
  4: "Playing Game",
  5: "Listening to Music",
  6: "Gardening",
  7: "Exercise",
  8: "Watching TV",
  9: "Religious Activities",
  10: "Others",
  11: "Oral Care",
  12: "Bathroom Bath",
  13: "Sponge Bath",
  14: "Eye Care",
  15: "Hair Care",
  16: "Nail Care",
  17: "Foot Care",
  18: "Perineal Care",
  19: "Tracheostomy Care",
  20: "Nebulization",
  21: "Spirometry Exercise",
  22: "Chest Physiotherapy",
  23: "Suctioning",
  24: "Oxygen Saturation",
  25: "Blood Sugar Check",
  26: "Respiratory Device",
  27: "Assistance with Medication",
  28: "Assistance with Meal",
  29: "Assistance with Elimination",
  30: "Assistance with Transferring",
  31: "Measures Pressure Ulcer",
  32: "Measures Prevent Fall",
};

const res_type = [
  { value: 1, label: "Care Partner" },
  { value: 2, label: "Care Angel" },
  { value: 3, label: "Nursing Officer" },
];
const labelNotRender = [
  "mealTypeBreakfast",
  "mealTypeBreakfastOther",
  "mealTypeDinner",
  "mealTypeLunch",
  "mealTypeLunchOther",
  "mealTypeSnackOther",
  "meal_typeSnack",
  "geolocationActive",
  "geolocationActiveCheckIn",
  "geolocationActiveCheckOut",
  "isexplained",
  "Physiotherapist_other",
  "did_elder_eat_other",
  "meal_type_dinner_other",
  "meal_type_snack_other, meal_type_breakfast_other",
  "meal_type_lunch_other",
  "elderOther",
  "elderOtherundefined",
  "mealTypeDinnerOther",
  "shiftTiming",
  "emergencyTypeOther",
  "emergencyhappenother",
];
class DocumentationTab extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTab: "",
      responderType: [1, 2],
      documentationData: {},
      selectedResType: [],
      startDate: moment().subtract(7, "days").toDate(),
      endDate: new Date(),
      selectedResType: [],
      formType: [],
      respAttendance: [],
      emergencyInput: [],
      elderWMSDoc: [],
      elder_id: "9254",
      isFilter: false,
    };
    this.elderService = new ElderService();
  }

  componentDidMount() {
    this.getResponderConfig();
    const id = this.props.currentElderIdentifier;
    this.setState({
      elder_id: this.props.currentElderIdentifier,
    });
    const filterData = {
      startDate: moment().subtract(7, "days").toDate(),
      endDate: new Date(),
      responder_type: [1, 2, 3],
      elder_id: id,
      child_form: [],
    };

    const emergencyInput = {
      startDate: moment().subtract(7, "days").toDate(),
      endDate: new Date(),
      responder_type: [1, 2, 3],
      elder_id: id,
    };

    const respAttendance = {
      startDate: moment().subtract(7, "days").toDate(),
      endDate: new Date(),
      responder_type: [1, 2, 3],
      elder_id: id,
    };

    const elderDocCount = {
      startDate: moment().subtract(7, "days").toDate(),
      endDate: new Date(),
      responder_type: [1, 2, 3],
      elder_id: id,
    };

    this.list(filterData);
    this.wmsRespAttendance(respAttendance);
    this.getEmergencyInput(emergencyInput);
    this.getElderDocCount(elderDocCount);
  }

  dateRange = (startDate, endDate, steps = 1) => {
    const dateArray = [];
    let currentDate = new Date(startDate);

    while (currentDate <= new Date(endDate)) {
      dateArray.push(moment(currentDate).format("YYYY-MM-DD"));
      // Use UTC date to prevent problems with time zones and DST
      currentDate.setUTCDate(currentDate.getUTCDate() + steps);
    }

    return dateArray;
  };

  mappedDocData = (data) => {
    if (isEmpty(data)) {
      return data;
    }
    let mappedDataList = [];
    const dateRanges = this.dateRange(
      moment(this.state.startDate).format("YYYY-MM-DD"),
      moment(this.state.endDate).format("YYYY-MM-DD")
    );

    for (let i = 0; i < dateRanges.length; i += 1) {
      if (!isEmpty(data[dateRanges[i]])) {
        const linkedData = {};
        linkedData[`${dateRanges[i]}`] = data[dateRanges[i]];
        mappedDataList.push(linkedData);
      } else {
        const myObject = {};
        myObject[`${dateRanges[i]}`] = [{ date: dateRanges[i] }];
        if (!includes(mappedDataList, myObject)) {
          mappedDataList.push(myObject);
        }
      }
    }
    const sortedMappedDataList = orderBy(
      mappedDataList,
      (o) => moment(Object.keys(o)[0]).format("YYYY-MM-DD"),
      ["desc"]
    );
    const toObjectMappedList = Object.assign({}, ...sortedMappedDataList);
    return toObjectMappedList;
  };

  mappedData = (data) => {
    const mappedListData = {};
    const dateRanges = this.dateRange(
      moment(this.state.startDate).format("YYYY-MM-DD"),
      moment(this.state.endDate).format("YYYY-MM-DD")
    );

    const getKeyValuePair = (data, title) => {
      let mappedList = [];
      if (!Array.isArray(data)) {
        for (let i = 0; i < dateRanges.length; i += 1) {
          if (!isEmpty(data[dateRanges[i]])) {
            const linkedData = {};
            linkedData[`${dateRanges[i]}`] = data[dateRanges[i]];
            mappedList.push(linkedData);
          }

          if (!data[dateRanges[i]]) {
            const myUnlinkedData = {};
            myUnlinkedData[`${dateRanges[i]}`] = [
              getEmptyObj(dateRanges[i], title),
            ];
            mappedList.push(myUnlinkedData);
          }
        }
      }

      const sortedByDate = orderBy(
        mappedList,
        (o) => moment(Object.keys(o)[0]).format("YYYY-MM-DD"),
        ["desc"]
      );

      const toObjectMappedList = Object.assign({}, ...sortedByDate);
      return toObjectMappedList;
    };

    for (const p in data) {
      mappedListData[p] = data[p].map((item) => {
        const mappedListObject = {
          title: item.title,
          list: getKeyValuePair(item.list, item.title),
          isEmptyList: isEmpty(item.list),
        };
        return mappedListObject;
      });
    }

    return mappedListData;
  };

  mappedData3 = (data) => {
    const mappedListData = {};
    const dateRanges = this.dateRange(
      moment(this.state.startDate).format("YYYY-MM-DD"),
      moment(this.state.endDate).format("YYYY-MM-DD")
    );

    const getKeyValuePair = (data, title) => {
      let mappedList = [];
      if (!Array.isArray(data)) {
        for (let i = 0; i < dateRanges.length; i += 1) {
          if (!isEmpty(data[dateRanges[i]])) {
            const linkedData = {};
            linkedData[`${dateRanges[i]}`] = data[dateRanges[i]];
            mappedList.push(linkedData);
          }

          if (!data[dateRanges[i]]) {
            const myUnlinkedData = {};
            myUnlinkedData[`${dateRanges[i]}`] = [
              getEmptyObj(dateRanges[i], title),
            ];
            mappedList.push(myUnlinkedData);
          }
        }
      }

      const sortedByDate = orderBy(
        mappedList,
        (o) => moment(Object.keys(o)[0]).format("YYYY-MM-DD"),
        ["desc"]
      );

      const toObjectMappedList = Object.assign({}, ...sortedByDate);
      return toObjectMappedList;
    };

    for (const p in data) {
      mappedListData[p] = data[p].map((item) => {
        const mappedListObject = {
          title: item.title,
          list: getKeyValuePair(item.list, item.title),
          isEmptyList: isEmpty(item.list),
        };
        return mappedListObject;
      });
    }

    return mappedListData;
  };

  mappedListDataDocuments = (docData) => {
    const mappedListData = {};
    const dateRanges = this.dateRange(
      moment(this.state.startDate).format("YYYY-MM-DD"),
      moment(this.state.endDate).format("YYYY-MM-DD")
    );

    const getKeyValuePair2 = (data2) => {
      const getMappedList2 = (listObj, title) => {
        let mappedList2 = [];
        if (!Array.isArray(listObj)) {
          for (let i = 0; i < dateRanges.length; i += 1) {
            if (!isEmpty(listObj[dateRanges[i]])) {
              const linkedData = {};
              linkedData[`${dateRanges[i]}`] = listObj[dateRanges[i]];
              mappedList2.push(linkedData);
            }

            if (!listObj[dateRanges[i]]) {
              const myUnlinkedData = {};
              myUnlinkedData[`${dateRanges[i]}`] = [
                getEmptyObj(dateRanges[i], title),
              ];
              mappedList2.push(myUnlinkedData);
            }
          }
          const sortedByDate = orderBy(
            mappedList2,
            (o) => moment(Object.keys(o)[0]).format("YYYY-MM-DD"),
            ["desc"]
          );

          const toObjectMappedList = Object.assign({}, ...sortedByDate);
          return toObjectMappedList;
        }
      };

      data2 = data2.map((item) => {
        const mappedData = {
          title: item.title,
          list: getMappedList2(item.list, item.title),
          isEmptyList: isEmpty(item.list),
        };
        return mappedData;
      });
      return data2;
    };

    const getKeyValuePair = (data, title) => {
      let mappedList_1 = [];
      if (!Array.isArray(data)) {
        for (let i = 0; i < dateRanges.length; i += 1) {
          if (!isEmpty(data[dateRanges[i]])) {
            const linkedData = {};
            linkedData[`${dateRanges[i]}`] = data[dateRanges[i]];
            mappedList_1.push(linkedData);
          }

          if (!data[dateRanges[i]]) {
            const myUnlinkedData = {};
            myUnlinkedData[`${dateRanges[i]}`] = [
              getEmptyObj(dateRanges[i], title),
            ];
            mappedList_1.push(myUnlinkedData);
          }
        }

        const sortedByDate = orderBy(
          flattenDeep(mappedList_1),
          (o) => moment(Object.keys(o)[0]).format("YYYY-MM-DD"),
          ["desc"]
        );

        const toObjectMappedList = Object.assign({}, ...sortedByDate);
        return toObjectMappedList;
      }
      return getKeyValuePair2(data);
    };

    for (const p in docData) {
      mappedListData[p] = docData[p].map((item) => {
        const mappedListObject = {
          title: item.title,
          list: getKeyValuePair(item.list, item.title),
          isEmptyList: isEmpty(item.list),
        };
        return mappedListObject;
      });
    }

    return mappedListData;
  };

  list = (filterData) => {
    this.props.startLoader();
    this.elderService
      .wmsNf1Info(filterData)
      .then((response) => {
        if (response.data) {
          this.setState({
            documentationData: this.mappedListDataDocuments(response.data),
          });
        }
        this.props.stopLoader();
      })
      .catch((errorData) => {
        this.props.stopLoader();
        this.props.openNotification(
          "Error!",
          errorData.response.data.message,
          0
        );
      });
  };

  wmsRespAttendance = (respAttendance) => {
    this.props.startLoader();
    this.elderService
      .wmsRespAttendance(respAttendance)
      .then((response) => {
        if (response.data) {
          this.setState({
            respAttendance: this.mappedData(response.data),
          });
        }
        this.props.stopLoader();
      })
      .catch((errorData) => {
        this.props.stopLoader();
        this.props.openNotification(
          "Error!",
          errorData.response.data.message,
          0
        );
      });
  };

  getEmergencyInput = (emergencyInput) => {
    this.props.startLoader();
    this.elderService
      .getEmergencyInput(emergencyInput)
      .then((response) => {
        if (response.data) {
          this.setState({
            emergencyInput: this.mappedData3(response.data),
          });
        }
        this.props.stopLoader();
      })
      .catch((errorData) => {
        this.props.stopLoader();
        this.props.openNotification(
          "Error!",
          errorData.response.data.message,
          0
        );
      });
  };

  getElderDocCount = (payload) => {
    this.props.startLoader();
    this.elderService
      .getElderWMSDoc(payload)
      .then((response) => {
        if (response.data) {
          this.setState({
            elderWMSDoc: this.mappedDocData(response.data),
          });
        }
        this.props.stopLoader();
      })
      .catch((errorData) => {
        this.props.stopLoader();
        this.props.openNotification(
          "Error!",
          errorData.response.data.message,
          0
        );
      });
  };

  getRenderDocTable(item, Title, labelNotRender, tableLabel, typeName) {
    if (isEmpty(item.list) || item.isEmptyList) {
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
    } else {
      return getDocTable(item, Title, labelNotRender, tableLabel, typeName);
    }
  }

  handler = (i) => {
    this.setState((prevState) => ({
      activeTab: prevState.activeTab === i ? "" : i,
    }));
  };

  setStateValues = (e, field) => {
    let value;
    if (field === "startDate" || field === "endDate") {
      value = e ? moment(e._d).format("YYYY-MM-DD HH:mm") : null;
    } else {
      value = e.currentTarget.value;
    }
    let state = this.state;
    state[`${field}`] = value;
    this.setState(state);
    if (field === "startDate") {
      this.setState({ endDate: moment(this.state.startDate).add(15, "days") });
    }
  };

  getResponderConfig() {
    this.props
      .getResponderConfig("country_codes")
      .then((result) => {
        this.setState({
          responderTypes: result.responder_types,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  handleChange = (selectedOption) => {
    this.setState({ selectedResType: selectedOption });
  };

  handleChangeformType = (formType) => {
    this.setState({ formType: formType });
  };

  handleFilter = () => {
    const {
      startDate,
      endDate,
      selectedResType,
      formType,
      elder_id,
      responderType,
    } = this.state;
    let responderTypee = [];
    let formtype = [];
    selectedResType &&
      selectedResType.forEach((item) => {
        responderTypee.push(item.value);
      });

    formType &&
      formType.forEach((item) => {
        formtype.push(item.value);
      });
    const filterData = {
      startDate: startDate,
      endDate: endDate,
      responder_type: responderTypee,
      elder_id: elder_id,
      child_form: formtype,
    };
    const emergencyInput = {
      startDate: startDate,
      endDate: endDate,
      responder_type: responderTypee,
      elder_id: elder_id,
    };

    const respAttendance = {
      startDate: startDate,
      endDate: endDate,
      responder_type: responderTypee,
      elder_id: elder_id,
    };
    this.setState({
      isFilter: true,
    });

    const elderDocCount = {
      startDate: startDate,
      endDate: endDate,
      responder_type: responderTypee,
      elder_id: elder_id,
    };

    this.list(filterData);
    this.wmsRespAttendance(respAttendance);
    this.getEmergencyInput(emergencyInput);
    this.getElderDocCount(elderDocCount);
  };

  objFilter = (val) => {
    let updatedArr;
    if (typeof val === "string") {
      let arr = val.split(",");
      if (arr.length >= 1) {
        updatedArr = arr.filter((a) => {
          return (
            a !== "elderOtherundefined" &&
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

  getValueInMandKM = (value) => {
    if (value < 1000) {
      return `${value} m`;
    }
    return `${round(value / 1000, 2)} km`;
  };

  getFancingRadiusValue = (val) => {
    if (val > 500 || val < 0 || val === null) {
      return <Tag color="volcano">{this.getValueInMandKM(val)}</Tag>;
    }
    return <Tag color="lime">{this.getValueInMandKM(val)}</Tag>;
  };

  fieldValue = (label, val, title, items) => {
    if (label === "date") {
      return moment(val).format("DD/MM/YYYY");
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
            a !== "elderOtherundefined" &&
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
        return <>{val ? moment(val).format("H:m:s") : ""}</>;
      }
    }
    if (title === "INTAKE CHART") {
      let mealtype = "";
      if (label === "whatdideldereat") {
        if (items.mealTypeBreakfast !== "") {
          mealtype = mealtype + this.objFilter(items.mealTypeBreakfast) + ", ";
        }
        if (items.mealTypeBreakfastOther !== "") {
          mealtype =
            mealtype + this.objFilter(items.mealTypeBreakfastOther) + ", ";
        }
        if (items.mealTypeDinner !== "") {
          mealtype = mealtype + this.objFilter(items.mealTypeDinner) + ", ";
        }
        if (
          typeof items.mealTypeDinnerOther !== "undefined" &&
          items.mealTypeDinnerOther !== ""
        ) {
          mealtype = mealtype + items.mealTypeDinnerOther + ",";
        }
        if (items.mealTypeLunch !== "") {
          mealtype = mealtype + this.objFilter(items.mealTypeLunch) + ", ";
        }
        if (items.mealTypeLunchOther !== "") {
          mealtype = mealtype + this.objFilter(items.mealTypeLunchOther) + ", ";
        }
        if (items.mealTypeSnackOther !== "") {
          mealtype = mealtype + this.objFilter(items.mealTypeSnackOther) + ", ";
        }
        if (items.meal_typeSnack !== "") {
          mealtype = mealtype + this.objFilter(items.meal_typeSnack) + ", ";
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
      return this.getFancingRadiusValue(val);
    } else if (label === "workingHrs") {
      return (
        <span class="text-lowercase">
          {val ? (val / 60).toFixed(2) + " hrs." : "-"}
        </span>
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
          case "yes":
            return <span className="doc-icon-yes"></span>;
          case "notgiven":
          case "notGiven":
          case "no":
            return <span className="doc-icon-no"></span>;
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

  tabUpdate = (val) => {};

  renderElderWMSDoc = (elderDocData) => {
    const columns = [
      {
        title: "Date",
      },
      {
        title: "Responder Name",
        dataIndex: "responseName",
        key: "responseName",
      },
      {
        title: "Responder Type",
      },
      {
        title: "Daily Documentation",
      },
      {
        title: "Health status",
      },
      {
        title: "Medical Care Chart",
      },
      {
        title: "Intake Chart",
      },
      {
        title: "Output Chart",
      },
      {
        title: "Medical Consumables",
      },
      {
        title: "Vital Sign - Temperature",
      },
      {
        title: "Vital Sign - Respiration",
      },
      {
        title: "Vital Sign - Pulse",
      },
      {
        title: "Vital Sign - Blood Pressure",
      },
      {
        title: "Vital Sign - Pain",
      },
      {
        title: "Blood Sugar",
      },
      {
        title: "Oxygen Saturation",
      },
      {
        title: "Morse fall scale",
      },
      {
        title: "Braden Score",
      },
      {
        title: "Shift time",
      },
      {
        title: "Check In",
      },
      {
        title: "Check Out",
      },
    ];

    let maskedElderDocData = [];
    for (const p in elderDocData) {
      maskedElderDocData.push(elderDocData[p]);
    }

    const flatten = maskedElderDocData.flat(Infinity);

    const sortedFlattenData = orderBy(
      flatten,
      (o) => {
        return moment(o.date).format("YYYY-MM-DD");
      },
      ["desc"]
    );

    return (
      <DocumentationTable
        dataSource={sortedFlattenData || []}
        columns={columns}
      />
    );
  };

  renderVitalDetails(item) {
    if (item.title === "Vitals Sign Chart") {
      return Object.keys(item).length ? (
        Object.keys(item).map((index) => {
          return (
            <>
              {Array.isArray(item[index]) ? (
                item[index].map((item, i) => {
                  return (
                    <div className="childList">
                      <div className="title-format-sheet">{item.title}</div>
                      <div className="format_doctable">
                        {this.getRenderDocTable(
                          item,
                          item.title,
                          labelNotRender,
                          tableLabel,
                          typeName
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="txt_nodata"></div>
              )}
            </>
          );
        })
      ) : (
        <div className="txt_nodata">No Data Found</div>
      );
    }
    return <div />;
  }

  getCustomObjList(object) {
    delete object.emergencyTypeOther;
    delete object.emergencyhappenother;
    return object;
  }

  render() {
    const {
      activeTab,
      documentationData,
      selectedResType,
      formType,
      respAttendance,
      emergencyInput,
      startDate,
      endDate,
      isFilter,
      elderWMSDoc,
    } = this.state;

    return (
      <div className="documentation-tab" style={styles}>
        <div className="row" style={{ zIndex: 10 }}>
          <div className="col-2">
            <Form.Group>
              <Form.Label>Start Date:</Form.Label>
              <DatePicker
                format={"DD/MM/YYYY"}
                placeholder="Start Date"
                disabledDate={(d) => !d || d.isAfter(new Date())}
                value={moment(startDate)}
                onChange={(e) => {
                  this.setStateValues(e, "startDate");
                  message.info(
                    "Currently, we can filtered out data upto 15 days."
                  );
                }}
              />
            </Form.Group>
          </div>
          <div className="col-2">
            <Form.Group>
              <Form.Label>End Date:</Form.Label>
              <DatePicker
                format={"DD/MM/YYYY"}
                placeholder="End Date"
                value={moment(endDate)}
                disabledDate={(d) => !d || d.isAfter(new Date())}
                onChange={(e) => {
                  this.setStateValues(e, "endDate");
                  message.info(
                    "Please select start date. Currently, we can filtered out data upto 15 days."
                  );
                }}
              />
            </Form.Group>
          </div>
          <div className="col">
            <Form.Group>
              <Form.Label>Responder Type</Form.Label>
              <Select
                name="selectedResType"
                value={selectedResType}
                onChange={this.handleChange}
                options={res_type}
                isMulti
                style={{ minWidth: 300 }}
              />
            </Form.Group>
          </div>
          <div className="col">
            <Form.Group>
              <Form.Label>Form Type</Form.Label>
              <Select
                name="form_type"
                value={formType}
                onChange={this.handleChangeformType}
                options={form_type}
                isMulti
                className="filter_documentation_form_type"
              />
            </Form.Group>
          </div>
          <div className="col-2">
            <Form.Group>
              <Form.Label></Form.Label>
              <div>
                <Button
                  type="button"
                  className="btn"
                  onClick={() => this.handleFilter()}
                >
                  Filter
                </Button>
              </div>
            </Form.Group>
          </div>
        </div>

        <div style={{ zIndex: "2 !important" }}>
          <div className="emergencySection attSection">
            {Object.keys(respAttendance).length ? (
              Object.keys(respAttendance).map((index) => {
                return (
                  <>
                    <div className="main-title-format-sheet">
                      <span>{tableLabel[index]}</span>
                    </div>
                    {respAttendance[index].length ? (
                      respAttendance[index].map((item, i) => {
                        return (
                          <div className="childList">
                            <div className="title-format-sheet">
                              {item.title}
                            </div>
                            <div className="format_doctable">
                              {this.getRenderDocTable(
                                item,
                                item.title,
                                labelNotRender,
                                tableLabel,
                                typeName
                              )}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="txt_nodata">No Data Found</div>
                    )}
                  </>
                );
              })
            ) : (
              <div className="txt_nodata">No Data Found</div>
            )}
          </div>
        </div>
        <div>{this.renderElderWMSDoc(elderWMSDoc)}</div>

        <div>
          <div className="emergencySection dailySection">
            {Object.keys(documentationData).length ? (
              Object.keys(documentationData).map((index) => {
                return (
                  <>
                    <div className="main-title-format-sheet">
                      <span>{tableLabel[index]}</span>
                    </div>
                    {documentationData[index].length ? (
                      documentationData[index].map((item, i) => {
                        return (
                          <div className="childList">
                            <div className="title-format-sheet">
                              {item.title}
                            </div>
                            {this.renderVitalDetails(item)}
                            <div className="format_doctable">
                              {this.getRenderDocTable(
                                item,
                                item.title,
                                labelNotRender,
                                tableLabel,
                                typeName
                              )}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="txt_nodata">No Data Found</div>
                    )}
                  </>
                );
              })
            ) : (
              <div className="txt_nodata">No Data Found</div>
            )}
          </div>
        </div>

        <div className="emergencySection es">
          {Object.keys(emergencyInput).length ? (
            Object.keys(emergencyInput).map((index) => {
              return (
                <>
                  <div className="main-title-format-sheet">
                    <span>{tableLabel[index]}</span>
                  </div>
                  {emergencyInput[index].length ? (
                    emergencyInput[index].map((item, i) => {
                      return (
                        <div className="childList">
                          <div className="title-format-sheet">
                            Emergency Record
                          </div>
                          <div className="format_doctable">
                            {this.getRenderDocTable(
                              item,
                              item.title,
                              labelNotRender,
                              tableLabel,
                              typeName
                            )}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="txt_nodata">No Data Found</div>
                  )}
                </>
              );
            })
          ) : (
            <div className="txt_nodata">No Data Found</div>
          )}
        </div>
      </div>
    );
  }
  componentWillUnmount() {}
}

//export default DocumentationTab;

const mapsStateToProps = (state) => ({
  // user: state.user.user,
});

const mapDispatchToProps = {
  getResponderConfig,
};

export default connect(mapsStateToProps, mapDispatchToProps)(DocumentationTab);
