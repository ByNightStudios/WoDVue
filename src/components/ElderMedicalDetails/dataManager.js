import ElderService from "../../service/ElderService";

export default class ElderMedicalDetailsManager {
  constructor() {
    this.elderService = new ElderService();
    this.dependentFields = {
      selectedMedicalConditions: {
        value: "Other",
        type: "multi",
        depFields: ["otherMedicalConditions"],
      },
      isSmoking: {
        type: "radio",
        value: "yes",
        depFields: ["smokingSince", "smokingFrequency"],
      },
      isAlchol: {
        type: "radio",
        value: "yes",
        depFields: ["alcholSince", "alcholFrequency"],
      },
      isNarcotics: {
        type: "radio",
        value: "yes",
        depFields: ["narcoticsSince", "narcoticsFrequency"],
      },
      isTobacco: {
        type: "radio",
        value: "yes",
        depFields: ["tobaccoSince", "tobaccoFrequency"],
      },
      recentHospitalization: {
        type: "radio",
        value: "yes",
        depFields: ["hospitalizationReason", "hospitalizationDischargeDate"],
      },
      isFoodAllergy: {
        type: "radio",
        value: "yes",
        depFields: ["foodAllergy"],
      },
      isDrugAllergy: {
        type: "radio",
        value: "yes",
        depFields: ["drugAllergy"],
      },
      isOtherAllergy: {
        type: "radio",
        value: "yes",
        depFields: ["otherAllergy"],
      },
      historyOfFall: {
        type: "radio",
        value: "yes",
        depFields: ["numberOfFallsinLastYear"],
      },
      selectedmobilityConditionsOptions: {
        value: "Others",
        type: "multi",
        depFields: ["otherMobilityCondition"],
      },
      selectedEliminationOptions: {
        value: "Others",
        type: "multi",
        depFields: ["otherEliminationOption"],
      },
      selectedwoundCareOptions: {
        value: "Others",
        type: "multi",
        depFields: ["otherWoundCare"],
      },
      pressureUlcer: {
        type: "radio",
        value: "yes",
        depFields: [
          "pressureUlcerSize",
          "pressureUlcerLocation",
          "pressureUlcerStage",
          "pressureUlcerRisk",
        ],
      },
      selectedShcCaseOptions: {
        value: "Others",
        type: "multi",
        depFields: ["otherShcOptions"],
      },
      selectedSpecialDietOptions: {
        value: "Others",
        type: "multi",
        depFields: ["otherSpecialDiet"],
      },
      selectedMobilityAidOptions: {
        value: "Others",
        type: "multi",
        depFields: ["otherMobilityAid"],
      },
    };
  }

  updateMedicalDetails = (payload) => {
    return this.elderService.updateElderFormData(payload);
  };

  clearDependentFieldValues = (item, value) => {
    if (item === 'onSpecialDiet' && value === "no") {
      return ['selectedSpecialDietOptions']
    }
    const dependentFields = this.dependentFields;
    if (dependentFields[item] !== undefined) {
      if (dependentFields[item].type === "radio") {
        if (dependentFields[item].value !== value) {
          return dependentFields[item].depFields
        } else {
          return []
        }
      } else if (dependentFields[item].type === "multi") {
        if (!value.includes(dependentFields[item].value)) {
          return dependentFields[item].depFields
        } else {
          return []
        }
      }
    } else {
      return []
    }

  }

  validate = (formData) => {
    let validated = true;
    let label = [];
    const dependentFields = this.dependentFields;
    const fieldsList = Object.keys(dependentFields);
    for (let index = 0; index < fieldsList.length; index++) {
      const checkField = dependentFields[fieldsList[index]];
      const checkFieldType = checkField.type;
      const checkValidation = false;
      if (checkFieldType === "radio") {
        if (formData[fieldsList[index]] === checkField.value) {
          checkValidation = true;
        }
      } else if (checkFieldType === "multi") {
        if (formData[fieldsList[index]].includes(checkField.value)) {
          checkValidation = true;
        }
      }
      if (checkValidation) {
        const { depFields } = checkField;
        depFields.map((depField) => {
          if (formData[depField] === null || formData[depField] === "") {
            validated = false;
            label.push(depField);
          }
        });
        if (label.length === 10) {
          label.push("....");
          return { validated, label };
        }
      }
    }
    return { validated, label };
  };
}

export const selectionOptions = {
  elderMedicalConditionsOptions: [
    "Hypertension",
    "Cancer",
    "Depression",
    "Diabetes Mellitus",
    "Arthritis",
    "Dementia",
    "Tuberculosis",
    "High Cholesterol",
    "Alzheimer’s Disease",
    "Asthma",
    "Under Dialysis",
    "Fronto Temporal Dementia",
    "Coronary Artery Disease",
    "Parkinson’s Disease",
    "Vascular Dementia",
    "Heart Disease",
    "Schizophrenia",
    "Other",
  ],
  differentlyAbledOptions: [
    "Blind",
    "Hearing Defect",
    "Verbally Challenged",
    "Visually Challenged",
  ],
  familyHistoryOptions: [
    "Hypertension",
    "Respiratory Disease",
    "Diabetes Mellitus",
    "Epilepsy",
    "Tuberculosis",
    "Cancer",
    "Heart Disease",
    "Arthritis",
    "Stroke",
    "Any Chronic disease",
  ],
  mobilityConditionsOptions: [
    "No Mobility realted difficulties",
    "Difficult to maintain balance",
    "Bedridden/Comatose",
    "Fracture",
    "Functional decline",
    "Parkinson’s (Movement disorder)",
    "Paralyzed",
    "Others",
  ],
  nutritionOptions: [
    "Normal Nutrition",
    "Swallowing Difficulties",
    "Feeding through NG Tube",
    "Feeding through PEG Tube",
    "Nutritional IV feeding",
  ],
  eliminationOptions: [
    "Normal Elimination",
    "Bedpan",
    "Diaper",
    "Urinary Catheter",
    "Colostomy Bag",
    "Others",
  ],
  woundCareOptions: [
    "Colostomy Care",
    "Diabetic Foot Care",
    "Tracheostomy Care",
    "Others",
  ],
  visualAidOptions: ["Glasses", "Lens", "Hearing Aid"],
  shcCaseOptions: [
    "Dental Implants/aid",
    "C PAP",
    "Air Mattress",
    "Ventilator",
    "DVT Pump",
    "IV Cannula",
    "Arterial Line",
    "Tracheostomy",
    "Suction Machine",
    "Central Line",
    "Nebulizer",
    "Infusion Equipment",
    "Nasal Prongs",
    "Ryle’s Tube",
    "Oxygen Mask",
    "PEG Tube",
    "Oxygen Concentrator",
    "Oxygen Cylinder",
    "Bi PAP",
    "Others",
  ],
  mobilityAidOptions: ["Wheel Chair", "Crutches", "Cane", "Walker", "Others"],
  specialDietOptions: [
    "Pureed Food",
    "Mechanical Soft",
    "Thickened Food",
    "Low Sodium Diet",
    "Renal Diet",
    "Diabetic Diet",
    "Others",
  ],
};

export const stateLabelMapping = {
  otherMedicalConditions: "Other Medical Condition",
  smokingSince: "Smoking Since",
  smokingFrequency: "Smoking Frequency",
  alcholSince: "Alchol Since",
  alcholFrequency: "Alchol Frequency",
  narcoticsSince: "Narcotics Since",
  narcoticsFrequency: "Narcotics Frequency",
  tobaccoSince: "Tobacco Since",
  tobaccoFrequency: "Tobacco Frequency",
  hospitalizationReason: "Hospitalization Reason",
  hospitalizationDischargeDate: "Hospitalization Discharge Date",
  foodAllergy: "Food Allergy",
  drugAllergy: "Drug Allergy",
  otherAllergy: "Other Allergy",
  numberOfFallsinLastYear: "Number of falls in Last Year",
  otherMobilityCondition: "Other Mobility Condition",
  otherEliminationOption: "Other Elimination Option",
  otherWoundCare: "Other Wound Care",
  pressureUlcerSize: "Ulcer Pressure",
  pressureUlcerLocation: "Ulcer Location",
  pressureUlcerStage: "Ulcer Stage",
  otherShcOptions: "Other SHC Case",
  otherSpecialDiet: "Other Special Diet",
  otherMobilityAid: "Other Mobility Aid",
}
