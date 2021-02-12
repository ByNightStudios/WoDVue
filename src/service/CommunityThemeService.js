import * as APIs from '../common/backendConstants';
import { axiosInstance } from '../store/store';

class CommunityThemeService {
  addCommunityTheme(payload) {
    return axiosInstance.post(APIs.COMMUNITY_THEME, payload);
  }

  editCommunityTheme(payload) {
    return axiosInstance.put(APIs.COMMUNITY_THEME_BY_ID, payload);
  }

  getCommunityTheme(payload) {
    let page = 0;
    if (payload.page) {
      page = payload.page;
    }

    let url = `${APIs.COMMUNITY_THEME}?page=${page}`;
    return axiosInstance.get(url);
  }

  getCommunityThemeByID(payload) {
    let url = APIs.COMMUNITY_THEME_BY_ID.replace(':theme_id', payload.theme_id);
    return axiosInstance.get(url);
  }
}

export default CommunityThemeService;
