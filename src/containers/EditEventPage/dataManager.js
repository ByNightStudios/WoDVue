import {
  addEventService,
  getCommunityPostService,
} from '../../service/CommunityServices';
import {
  getCountriesService,
  getCitiesService,
  getStatesService,
} from '../../service/LocationService';

export const updateEvent = (state) => {
  let body = {
    community_feed_id: state.community_feed_id,
    title: state.title,
    author: state.author,
    image_uuid: state.image_uuid,
    category_id: 2,
    status: state.status,
    location: state.location,
    address: state.address,
    start_date: state.startDate,
    end_date: state.endDate,
    description: state.description,
    content: state.content.toString(),
    theme_id: state.theme_id,
  };
  return addEventService(body)
    .then((data) => {
      return data;
    })
    .catch((error) => {
      throw error.response.data;
    });
};

export const getCommunityPost = (id) => {
  return getCommunityPostService(id)
    .then((data) => {
      return data;
    })
    .catch((error) => {
      throw error.response.data;
    });
};
export const getCountries = () => {
  return getCountriesService()
    .then((result) => {
      return result;
    })
    .catch((error) => {
      throw error.response.data;
    });
};
export const getStates = (param) => {
  return getStatesService(param)
    .then((result) => {
      return result;
    })
    .catch((error) => {
      throw error.response.data;
    });
};
export const getCities = (param) => {
  return getCitiesService(param)
    .then((result) => {
      return result;
    })
    .catch((error) => {
      throw error.response.data;
    });
};
