import { includes } from 'lodash';
import ElderService from "../../service/ElderService";

export default class ElderOtherInfoManager {
  constructor() {
    this.elderService = new ElderService();
    this.dependentFields = {
      needAssitanceWithDocter: {
        type: "radio",
        value: "yes",
        depFields: ["doctorAssitance"]
      },
      otherRoutineAppointments: {
        type: "radio",
        value: "yes",
        depFields: ["otherRoutineAppointmentName"]
      },
      elderNeedsAssitance: {
        type: "radio",
        value: "yes",
        depFields: ["eldersAssitances"]
      },
      selectedReligion: {
        value: "Other",
        type: "multi",
        depFields: ["otherReligion"]
      }
    }
  }

  updateElderOtherData = (payload) => {
    return this.elderService.updateElderFormData(payload)
  }

  clearDependentFieldValues = (item, value) => {
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
    const fields = Object.keys(formData);
    let validated = true;
    let label = '';
    const requiredFields = ['dateCompleted'];
    for (let index = 0; index < fields.length; index++) {
      if (includes(requiredFields, fields[index])) {
        if (formData[fields[index]] === null || formData[fields[index]] === '') {
          validated = false;
          label = fields[index];
        }
      }
    }
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
        if (formData[fieldsList[index]]?.includes(checkField.value)) {
          checkValidation = true;
        }
      }
      if (checkValidation) {
        const { depFields } = checkField
        depFields?.map((depField) => {
          if (formData[depField] === null || formData[depField] === '') {
            validated = false;
            label = depField
          }
        })
      }
    }
    return { validated, label };
  }
}

export const selectionOptions = {
  religionOptions: [
    "Atheist/Agnostic",
    "Hinduism",
    "Sikhism",
    "Buddhism",
    "Christianity",
    "Islam",
    "Jainism",
    "Other",
  ]
}


export const stateLableMapping = {
  eldersAssitances: 'Does elder need assistance',
  dateCompleted: 'Date and Time of Completion',
  otherRoutineAppointmentName: 'Other Routine Appointments',
  doctorAssitance: 'Need Assitance with Doctor',
  otherReligion: 'Other Religion'
}
