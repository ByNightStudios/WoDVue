import {
  addEventService,
  addCommunityPostService,
} from '../../service/CommunityServices';
import {
  getCountriesService,
  getCitiesService,
  getStatesService,
} from '../../service/LocationService';

export const addEvent = (state) => {
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
    content: state.content ? state.content.toString() : '',
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

export const createFeed = () => {
  return addCommunityPostService({
    category_id: 2,
  })
    .then((res) => {
      return res.data.id;
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
      throw error;
    });
};

export const getStates = (param) => {
  return getStatesService(param)
    .then((result) => {
      return result;
    })
    .catch((error) => {
      throw error;
    });
};

export const getCities = (param) => {
  return getCitiesService(param)
    .then((result) => {
      return result;
    })
    .catch((error) => {
      throw error;
    });
};
