// Imports
import React, { Component } from "react";

// Import Search Bar Components
import { connect } from "react-redux";
import { Input } from "antd";
import {
  getCountries,
  getStates,
  getCities,
} from "../../actions/LocationAction";
// Import React Scrit Libraray to load Google object
import Script from "react-load-script";

class Search extends Component {
  // Define Constructor
  constructor(props) {
    super(props);

    // Declare State
    this.state = {
      city: "",
      query: "",
      formData: {
        city: "",
        state: "",
        country: "",
      },
    };
  }

  handleScriptLoad = () => {
    // Declare Options For Autocomplete
    const options = {
      types: ["(cities)"],
    }; // To disable any eslint 'google not defined' errors

    // Initialize Google Autocomplete
    /*global google*/ this.autocomplete = new google.maps.places.Autocomplete(
      document.getElementById("autocomplete"),
      options
    );

    // Avoid paying for data that you don't need by restricting the set of
    // place fields that are returned to just the address components and formatted
    // address.
    this.autocomplete.setFields([
      "address_components",
      "formatted_address",
      "geometry",
    ]);

    // Fire Event when a suggested name is selected
    this.autocomplete.addListener("place_changed", this.handlePlaceSelect);
  };

  getCountriesList() {
    this.props.startLoader();
    this.props
      .getCountries()
      .then((result) => {
        this.setState({ countries: result.data });
        this.props.stopLoader();
      })
      .catch((error) => {
        this.props.openNotification("Error", error.response.data.message, 0);
        this.props.stopLoader();
      });
  }

  getStatesList(country) {
    this.props.startLoader();
    this.props
      .getStates(country)
      .then((result) => {
        this.setState({ states: result.data });
        this.props.stopLoader();
      })
      .catch((error) => {
        this.props.openNotification("Error", error.response.data.message, 0);
        this.props.stopLoader();
      });
  }

  getCitiesList(state) {
    this.props.startLoader();
    this.props
      .getCities(state)
      .then((result) => {
        this.props.stopLoader();
        this.setState({ cities: result.data });
      })
      .catch((error) => {
        this.props.openNotification("Error", error.response.data.message, 0);
        this.props.stopLoader();
      });
  }

  fillInAddress(place) {
    let formData = this.state.formData;
    for (var i = 0; i < place.length; i++) {
      var addressType = place[i].types[0];
      if (addressType == "administrative_area_level_2") {
        formData.city = place[i].long_name;
      }
      if (addressType == "administrative_area_level_1") {
        formData.state = place[i].long_name;
        this.getCitiesList(formData.state);
      }
      if (addressType == "country") {
        formData.country = place[i].long_name;
        this.getStatesList(formData.country);
      }
      this.setState({ formData });
    }
  }

  handlePlaceSelect = () => {
    // Extract City From Address Object
    const addressObject = this.autocomplete.getPlace();
    const address = addressObject.address_components;

    // Check if address is valid
    if (address) {
      // Set State
      this.fillInAddress(addressObject.address_components);
      const myFriendData = {
        addLocationInput: addressObject.formatted_address,
        city: this.state.formData.city,
        country: this.state.formData.country,
        state: this.state.formData.state,
        geoLatitude: this.autocomplete.getPlace().geometry.location.lat(),
        geoLongitude: this.autocomplete.getPlace().geometry.location.lng(),
      };

      if (myFriendData) {
        this.setState({ query: addressObject.formatted_address });
        this.props.handleUpdateDataInsideForm(myFriendData);
      }
    }
  };

  handleOnChange = (e) => {
    this.setState({ query: e.target.value });
  }

  render() {
    const { style } = this.props;

    return (
      <div>
        <Script
          url="https://maps.googleapis.com/maps/api/js?key=AIzaSyC5i2xBMc10GAeGvEjq58C5CrvVkPEZFbY&libraries=places"
          onLoad={this.handleScriptLoad}
        />
        <Input.Search
          id="autocomplete"
          placeholder=""
          hintText="Search City"
          value={this.state.query}
          style={style}
          onChange={this.handleOnChange}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  elderData: state.elder.elderData,
});

const mapDispatchToProps = {
  getCountries,
  getStates,
  getCities,
};

Search.defaultProps = {
  style: {
    margin: "0 auto",
    maxWidth: 800,
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Search);
