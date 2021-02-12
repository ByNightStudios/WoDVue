import { includes } from "lodash";

function getEmptyObj(date, title) {
  if (title === "Attendance") {
    const emptyObj = {
      date: date,
      responseName: "red_col",
      responderType: "red_col",
      checkInTime: "red_col",
      checkOutTime: "red_col",
      workingHrs: "red_col",
      responderFancingRadiusCheckIn: "red_col",
      geolocationCheckIn: "red_col",
      responderFancingRadiusCheckOut: "red_col",
      geolocationCheckOut: "red_col",
    };
    return emptyObj;
  }

  if (title === "Emergency Record") {
    const emptyObj = {
      date: date,
      time: "red_col",
      responseName: "red_col",
      respondertype: "red_col",
      emergencytype: "red_col",
      incidentlocation: "red_col",
      witnessname: "red_col",
      didhospitalised: "red_col",
      nameofaccompany: "red_col",
      didcallemoha: "red_col",
      timeofemohacall: "red_col",
      actiontaken: "red_col",
      conclusion: "red_col",
      didcallNO: "red_col",
      timeofNOcall: "red_col",
      whatHappen: "red_col",
      geolocation: "red_col",
      responderFancingRadius: "red_col",
    };
    return emptyObj;
  }

  if (title === "Emergency Input") {
    const emptyObj = {
      date: date,
      time: "red_col",
      responseName: "red_col",
      respondertype: "red_col",
      emergencytype: "red_col",
      incidentlocation: "red_col",
      witnessname: "red_col",
      didhospitalised: "red_col",
      nameofaccompany: "red_col",
      didcallemoha: "red_col",
      timeofemohacall: "red_col",
      actiontaken: "red_col",
      conclusion: "red_col",
      didcallNO: "red_col",
      timeofNOcall: "red_col",
      whatHappen: "red_col",
      geolocation: "red_col",
      responderFancingRadius: "red_col",
    };
    return emptyObj;
  }
  if (title === "OUTPUT CHART") {
    const emptyObj = {
      date: date,
      time: "red_col",
      responseName: "red_col",
      respondertype: "red_col",
      elderpass: "red_col",
      stool: "red_col",
      responderFancingRadius: "red_col",
      geolocation: "red_col",
    };
    return emptyObj;
  }
  if (title === "INTAKE CHART") {
    const emptyObj = {
      date: date,
      time: "red_col",
      responseName: "red_col",
      respondertype: "red_col",
      mealType: "red_col",
      timeOfMeal: "red_col",
      whatdideldereat: "red_col",
      whatdidelderdrink: "red_col",
      geolocation: "red_col",
      responderFancingRadius: "red_col",
    };
    return emptyObj;
  }
  if (title === "Health Status") {
    const emptyObj = {
      date: date,
      time: "red_col",
      responseName: "red_col",
      respondertype: "red_col",
      eldermood: "red_col",
      skincondition: "red_col",
      pressureulcer: "red_col",
      mobility: "red_col",
      historyoffall: "red_col",
      assistivedevice: "red_col",
      geolocation: "red_col",
      responderFancingRadius: "red_col",
    };
    return emptyObj;
  }
  if (includes(title, "NF1 - Daily Documentation")) {
    const emptyObj = {
      date: date,
      time: "red_col",
      responseName: "red_col",
      respondertype: "red_col",
      hygiene: "red_col",
      oralcare: "red_col",
      bath: "red_col",
      eyecare: "red_col",
      haircare: "red_col",
      nailcare: "red_col",
      footcare: "red_col",
      activities: "red_col",
      socialBehaviour: "red_col",
      watchtv: "red_col",
      readbook: "red_col",
      gooutside: "red_col",
      anychangeincondition: "red_col",
      doctorvisit: "red_col",
      responderFancingRadius: "red_col",
      geolocation: "red_col",
    };
    return emptyObj;
  }

  if (includes(title, "NF2 - Daily Documentation")) {
    const emptyObj = {
      date: date,
      time: "red_col",
      responseName: "red_col",
      respondertype: "red_col",
      hygiene: "red_col",
      oralcare: "red_col",
      bath: "red_col",
      eyecare: "red_col",
      haircare: "red_col",
      nailcare: "red_col",
      footcare: "red_col",
      activities: "red_col",
      socialBehaviour: "red_col",
      watchtv: "red_col",
      readbook: "red_col",
      gooutside: "red_col",
      anychangeincondition: "red_col",
      responderFancingRadius: "red_col",
      geolocation: "red_col",
    };
    return emptyObj;
  }

  if (includes(title, "NO - Case Handover")) {
    const emptyObj = {
      date: date,
      time: "red_col",
      responseName: "red_col",
      respondertype: "red_col",

      eldersWakeUpTime: "red_col",
      eldersSleepTime: "red_col",

      anySpecialInstructions: "red_col",
      activity: "red_col",
      name: "red_col",
      frequency: "red_col",
      geolocation: "red_col",
      responderFancingRadius: "red_col",
    };
    return emptyObj;
  }

  if (title === "Medical Chart") {
    const emptyObj = {
      date: date,
      time: "red_col",
      responseName: "red_col",
      respondertype: "red_col",
      foleysCatheter: "red_col",
      ngTube: "red_col",
      tracheostomy: "red_col",
      ambulation: "red_col",
      nebulization: "red_col",
      spiromteryExercises: "red_col",
      chestPhysiotherapy: "red_col",
      oxygenMode: "red_col",
      remark: "red_col",
      geolocation: "red_col",
      responderFancingRadius: "red_col",
    };
    return emptyObj;
  }

  if (title === "Temperature") {
    const emptyObj = {
      date: date,
      time: "red_col",
      respondertype: "red_col",
      responseName: "red_col",
      measurement: "red_col",
      mode: "red_col",
      anyspecificintervention: "red_col",
      whodidyouinform: "red_col",
      geolocation: "red_col",
      responderFancingRadius: "red_col",
    };
    return emptyObj;
  }

  if (title === "Blood Sugar") {
    const emptyObj = {
      date: date,
      time: "red_col",
      respondertype: "red_col",
      responseName: "red_col",
      measurement: "red_col",
      oralMedicine: "red_col",
      nameOfMedicine: "red_col",
      anyspecificintervention: "red_col",
      unitofinsulin: "red_col",
      injectionsite: "red_col",
      whodidyouinform: "red_col",
      geolocation: "red_col",
      responderFancingRadius: "red_col",
    };
    return emptyObj;
  }

  if (title === "Blood Pressure") {
    const emptyObj = {
      date: date,
      time: "red_col",
      responseName: "red_col",
      respondertype: "red_col",
      systolic: "red_col",
      diastolic: "red_col",
      specificIntervention: "red_col",
      whodidyouinform: "red_col",
      geolocation: "red_col",
      responderFancingRadius: "red_col",
    };
    return emptyObj;
  }

  if (title === "Respiration") {
    const emptyObj = {
      date: date,
      time: "red_col",
      responseName: "red_col",
      respondertype: "red_col",
      measurement: "red_col",
      anyspecificintervention: "red_col",
      whodidyouinform: "red_col",
      geolocation: "red_col",
      responderFancingRadius: "red_col",
    };
    return emptyObj;
  }

  if (title === "Pulse") {
    const emptyObj = {
      date: date,
      time: "red_col",
      responseName: "red_col",
      respondertype: "red_col",
      measurement: "red_col",
      anyspecificintervention: "red_col",
      whodidyouinform: "red_col",
      geolocation: "red_col",
      responderFancingRadius: "red_col",
    };
    return emptyObj;
  }

  if (title === "Oxygen Saturation") {
    const emptyObj = {
      date: date,
      time: "red_col",
      responseName: "red_col",
      respondertype: "red_col",
      measurement: "red_col",
      anyspecificintervention: "red_col",
      whodidyouinform: "red_col",
      geolocation: "red_col",
      responderFancingRadius: "red_col",
    };
    return emptyObj;
  }

  if (title === "Pain") {
    const emptyObj = {
      date: date,
      time: "red_col",
      responseName: "red_col",
      respondertype: "red_col",
      measurement: "red_col",
      anyspecificintervention: "red_col",
      whodidyouinform: "red_col",
      geolocation: "red_col",
      responderFancingRadius: "red_col",
    };
    return emptyObj;
  }

  if (title === "Medical Consumables") {
    const emptyObj = {
      date: date,
      time: "red_col",
      responseName: "red_col",
      respondertype: "red_col",
      diapersUsed: "red_col",
      glovesUsed: "red_col",
      wipesUsed: "red_col",
      geolocation: "red_col",
      responderFancingRadius: "red_col",
    };
    return emptyObj;
  }

  if (title === "Braden Score") {
    const emptyObj = {
      date: date,
      time: "red_col",
      responseName: "red_col",
      respondertype: "red_col",
      totalScore: "red_col",
      mobility: "red_col",
      moisture: "red_col",
      activity: "red_col",
      sensoryPerception: "red_col",
      nutrition: "red_col",
      frictionShear: "red_col",
      geolocation: "red_col",
      responderFancingRadius: "red_col",
    };
    return emptyObj;
  }

  if (title === "Morsefall Scale") {
    const emptyObj = {
      date: date,
      time: "red_col",
      respondertype: "red_col",
      responseName: "red_col",
      totalScore: "red_col",
      historyOfFall: "red_col",
      secondaryDiagnosis: "red_col",
      ambulatoryAid: "red_col",
      IVTherapy: "red_col",
      gait: "red_col",
      mentalStatus: "red_col",
      geolocation: "red_col",
      responderFancingRadius: "red_col",
    };
    return emptyObj;
  }

  const emptyObj = {
    date: date,
    activities: "red_col",
    anychangeincondition: "red_col",
    bath: "red_col",
    doctorvisit: "red_col",
    eyecare: "red_col",
    footcare: "red_col",
    geolocation: "red_col",
    gooutside: "red_col",
  };

  return emptyObj;
}

export default getEmptyObj;
