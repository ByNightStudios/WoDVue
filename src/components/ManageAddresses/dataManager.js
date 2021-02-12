import ElderServiceFile from '../../service/ElderService';
const ElderService = new ElderServiceFile()

export default class AddressManager {
    deleteElderAddress(inputs) {
        let payload = {
            user_id : inputs.userID,
            address_id : inputs.addressID
        };

        return ElderService.deleteElderAddress(payload);
    }

    addAddressValidator(formData) {
        let isFormValid = true;
        Object.keys(formData).map((item, index) => {
          if (((!formData[item] || formData[item] === "") &&  item !== "city" && item !== "addLocationInput" && item !== "addressID" && item !== "latitude" && item !== "longitude")) {
            return (isFormValid = false);
          }
        });
        return isFormValid;
      };

      editAddressValidator(formData) {
        let isFormValid = true;
        Object.keys(formData).map((item, index) => {
          if (((!formData[item] || formData[item] === "") &&  item !== "city" && item !== "addLocationInput")) {
            return (isFormValid = false);
          }
        });
        return isFormValid;
      };

    addElderAddress(inputs) {
        const {userID, addressLine1, addressLine2, city, state, country, geoLatitude, geoLongitude, latitude, longitude} = inputs;
        let payload = {
            user_id : userID,
            address_line_1 : addressLine1,
            address_line_2 : addressLine2,
            city,
            state,
            country,
            latitude,
            longitude,
            geo_latitude : geoLatitude,
            geo_longitude : geoLongitude
        };

        return ElderService.addElderAddress(payload);
    }

    editElderAddress(inputs) {
        const {userID, addressLine1, addressLine2, city, state, country, geoLatitude, geoLongitude, addressID, latitude, longitude} = inputs;
        let payload = {
            user_id : userID,
            address_line_1 : addressLine1,
            address_line_2 : addressLine2,
            city,
            state,
            country,
            latitude,
            longitude,
            geo_latitude : geoLatitude,
            geo_longitude : geoLongitude,
            address_id : addressID
        };
        payload.default = inputs.default;

        return ElderService.editElderAddress(payload);
    }
}