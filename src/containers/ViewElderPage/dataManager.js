import ElderServiceFile from '../../service/ElderService';
const ElderService = new ElderServiceFile();

export default class ElderManager {
  getElderData(payload) {
    return ElderService.getElderData(payload);
  }

  editProfileValidator(formData) {
    let isFormValid = true;
    Object.keys(formData).map((item, index) => {
      if (
        (!formData[item] || formData[item] === '') &&
        item !== 'imageURL' &&
        item !== 'image_uuid' &&
        item !== 'bloodGroup' &&
        item !== 'mobileNumber' &&
        item !== 'countryCode' &&
        item !== 'locationCode' &&
        item !== 'lead_source' &&
        item !== 'lead_date' &&
        item !== 'lead_sub_source' &&
        item !== 'lead_first_stage' &&
        item !== 'lead_second_stage' &&
        item !== 'lead_third_stage' &&
        item !== 'lead_fourth_stage' &&
        item !== 'data_source' &&
        item !== 'customer_id' &&
        item !== 'interested_service' &&
        item !== 'customer_type' &&
        item !== 'sensor_installation' &&
        item !== 'sales_remarks' &&
        item !== 'other_remarks' &&
        item !== 'nri_status' &&
        item !== 'relationship_with_elder' &&
        item !== 'marital_status' &&
        item !== 'home_type' &&
        item !== 'created_by' &&
        item !== 'modified_by' &&
        item !== 'most_liked_feature' &&
        item !== 'covid_diposition' &&
        item !== 'currency' &&
        item !== 'bedrooms' &&
        item !== 'service_end_date' &&
        item !== 'product_package' &&
        item !== 'payment_status' &&
        item !== 'proceed_to_af2b' &&
        item !== 'proceed_to_af2a' &&
        item !== 'target_group_type' &&
        item !== 'assessment_date' &&
        item !== 'appointment_created_date' &&
        item !== 'other_service' &&
        item !== 'who_did_you_meet' &&
        item !== 'select_days_month' &&
        item !== 'service_length' &&
        item !== 'salutation' &&
        item !== 'ad_set_name' &&
        item !== 'campaign_name' &&
        item !== 'form_source_url' &&
        item !== 'spouse_name' &&
        item !== 'spouse_dob' &&
        item !== 'google_link' &&
        item !== 'af21_remarks' &&
        item !== 'owner_name' &&
        item !== 'first_name_customer_calling' &&
        item !== 'last_name_customer_calling' &&
        item !== 'nok_phone' &&
        item !== 'nok_email' &&
        item !== 'nok_name' &&
        item !== 'is_nok_the_primary_emergency_contact' &&
        item !== 'primary_emergency_contact_number' &&
        item !== 'primary_emergency_contact_name' &&
        item !== 'secondary_emergency_contact_number' &&
        item !== 'secondary_emergency_contact_name' &&
        item !== 'sales_status' &&
        item !== 'allergies' &&
        item !== 'current_medical_conditions' &&
        item !== 'current_living_condition' &&
        item !== 'payment_source' &&
        item !== 'age'
      ) {
        return (isFormValid = false);
      }
    });
    return isFormValid;
  }

  editElderProfile(inputs) {
    const {
      firstName,
      lastName,
      bloodGroup,
      dob,
      gender,
      image_uuid,
      userID,
      locationCode,
      countryCode,
      mobileNumber,
      lead_source,
      lead_date,
      lead_sub_source,
      lead_first_stage,
      lead_second_stage,
      lead_third_stage,
      lead_fourth_stage,
      data_source,
      customer_id,
      interested_service,
      customer_type,
      sensor_installation,
      sales_remarks,
      other_remarks,
      nri_status,
      relationship_with_elder,
      marital_status,
      home_type,
      created_by,
      modified_by,
      most_liked_feature,
      covid_diposition,
      currency,
      bedrooms,
      service_end_date,
      product_package,
      payment_status,
      proceed_to_af2b,
      proceed_to_af2a,
      target_group_type,
      assessment_date,
      appointment_created_date,
      other_service,
      who_did_you_meet,
      select_days_month,
      service_length,
      salutation,
      ad_set_name,
      campaign_name,
      form_source_url,
      spouse_name,
      spouse_dob,
      google_link,
      af21_remarks,
      owner_name,
      first_name_customer_calling,
      last_name_customer_calling,
      nok_phone,
      nok_email,
      nok_name,
      is_nok_the_primary_emergency_contact,
      primary_emergency_contact_number,
      primary_emergency_contact_name,
      secondary_emergency_contact_number,
      secondary_emergency_contact_name,
      sales_status,
      allergies,
      current_medical_conditions,
      current_living_condition,
      age,
      payment_source,
    } = inputs;

    let newCurrentMedicalConditionsArr = [];
    let currentMedicalConditionsArr = [...new Set(current_medical_conditions)];
    for (let index = 0; index < currentMedicalConditionsArr.length; index++) {
      newCurrentMedicalConditionsArr.push({
        inputValue: currentMedicalConditionsArr[index],
      });
    }

    let payload = {
      first_name: firstName,
      last_name: lastName,
      gender,
      dob,
      blood_group: bloodGroup,
      image_uuid,
      user_type: 3,
      user_id: userID,
      location_code: locationCode.toUpperCase(),
      country_code: countryCode,
      mobile_number: mobileNumber,
      lead_source,
      lead_date,
      lead_sub_source,
      lead_first_stage,
      lead_second_stage,
      lead_third_stage,
      lead_fourth_stage,
      data_source,
      customer_id,
      interested_service,
      customer_type,
      sensor_installation,
      sales_remarks,
      other_remarks,
      nri_status,
      relationship_with_elder,
      marital_status,
      home_type,
      created_by,
      modified_by,
      most_liked_feature,
      covid_diposition,
      currency,
      bedrooms,
      service_end_date,
      product_package,
      payment_status,
      proceed_to_af2b,
      proceed_to_af2a,
      target_group_type,
      assessment_date,
      appointment_created_date,
      other_service,
      who_did_you_meet,
      select_days_month,
      service_length,
      salutation,
      ad_set_name,
      campaign_name,
      form_source_url,
      spouse_name,
      spouse_dob,
      google_link,
      af21_remarks,
      owner_name,
      first_name_customer_calling,
      last_name_customer_calling,
      nok_phone,
      nok_email,
      nok_name,
      is_nok_the_primary_emergency_contact,
      primary_emergency_contact_number,
      primary_emergency_contact_name,
      secondary_emergency_contact_number,
      secondary_emergency_contact_name,
      sales_status,
      allergies,
      current_medical_conditions: newCurrentMedicalConditionsArr,
      current_living_condition,
      age,
      payment_source,
    };

    return ElderService.editElderProfile(payload);
  }
}
