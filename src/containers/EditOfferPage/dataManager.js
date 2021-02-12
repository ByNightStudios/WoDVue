import {
  addOfferService,
  getCommunityPostService
} from '../../service/CommunityServices';
import {
  getCountriesService,
  getCitiesService,
  getStatesService
} from '../../service/LocationService';

export const updateOffer = state => {
  let body = {
    community_feed_id: state.community_feed_id,
    title: state.title,
    image_uuid: state.image_uuid,
    category_id: 3,
    status: state.status,
    start_date: state.startDate,
    end_date: state.endDate,
    content: state.content ? state.content.toString() : '',
    author: state.author,
    description: state.description,
    location: state.location,
    theme_id: state.theme_id
  };
  return addOfferService(body)
    .then(data => {
      return data;
    })
    .catch(error => {
      throw error.response.data;
    });
};

export const getCommunityPost = id => {
  return getCommunityPostService(id)
    .then(data => {
      return data;
    })
    .catch(error => {
      throw error.response.data;
    });
};
export const getCountries = () => {
  return getCountriesService()
    .then(result => {
      return result;
    })
    .catch(error => {
      throw error;
    });
};
export const getStates = param => {
  return getStatesService(param)
    .then(result => {
      return result;
    })
    .catch(error => {
      throw error.response.data;
    });
};
export const getCities = param => {
  return getCitiesService(param)
    .then(result => {
      return result;
    })
    .catch(error => {
      throw error.response.data;
    });
};
