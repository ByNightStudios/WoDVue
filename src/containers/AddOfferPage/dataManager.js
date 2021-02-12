import {
  addOfferService,
  addCommunityPostService,
} from '../../service/CommunityServices';
import {
  getCountriesService,
  getCitiesService,
  getStatesService,
} from '../../service/LocationService';

export const addOffer = (state) => {
  let body = {
    community_feed_id: state.community_feed_id,
    title: state.title,
    image_uuid: state.image_uuid,
    category_id: 3,
    location: state.location,
    status: state.status,
    start_date: state.startDate,
    end_date: state.endDate,
    content: state.content,
    author: state.author,
    description: state.description,
    theme_id: state.theme_id,
  };
  return addOfferService(body)
    .then((data) => {
      return data;
    })
    .catch((error) => {
      throw error.response.data;
    });
};

export const createFeed = () => {
  return addCommunityPostService({
    category_id: 3,
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
