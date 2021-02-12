import * as APIs from "../common/backendConstants";
import { axiosInstance } from "../store/store";

export default class DashboardService {

  getUserLocations() {
    return axiosInstance.get(APIs.ANALYTICS_MAP);
  }

  shcActiveEldersList(payload) {
    return axiosInstance.get(`${APIs.SHC_ACTIVE_ELDERS_LIST}`);
  }

  getBirthDayList(){
    return axiosInstance.get(`${APIs.BIRTHDAY}`);
  }

  getPlanList(){
    return axiosInstance.get(`${APIs.ELDER_PLAN_EXPIRE}`);
  }
}
