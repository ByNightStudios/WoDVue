import * as APIs from '../common/backendConstants';
import { axiosInstance } from '../store/store';

class PlanService {
  getPlanCategoriesService(payload) {
    let url = APIs.GET_PLAN_CATEGORIES;
    let page = 0;
    if (payload.page) {
      page = payload.page;
      url = `${url}?page=${page - 1}`;
    }
    if (payload.search) {
      url = `${url}&search=${payload.search}`;
    }
    if (payload.get_all) {
      url = `${url}&get_all=${payload.get_all}`;
    }
    return axiosInstance.get(url);
  }

  getPlansService(payload) {
    let url = APIs.PLANS_URL;
    let page = 0;
    if (payload.page) {
      page = payload.page;
      url = `${url}?page=${page - 1}`;
    }
    if (payload.search) {
      url = `${url}&search=${payload.search}`;
    }
    return axiosInstance.get(url);
  }

  getPlanByID(payload) {
    let url = APIs.PLANS_ID_URL.replace(':id', payload.plan_id);
    return axiosInstance.get(url);
  }

  addPlanCategories(payload) {
    return axiosInstance.post(APIs.GET_PLAN_CATEGORIES, payload);
  }

  deletePlanCategory(payload) {
    let url = APIs.UPDATE_DELETE_PLAN_CATEGORIES.replace(
      ':plan_category_id',
      payload.plan_category_id
    );
    return axiosInstance.delete(url);
  }

  editPlanCategory(payload) {
    let url = APIs.UPDATE_DELETE_PLAN_CATEGORIES.replace(
      ':plan_category_id',
      payload.plan_category_id
    );
    return axiosInstance.put(url, payload);
  }

  addPlan(payload) {
    return axiosInstance.post(APIs.PLANS_URL, payload);
  }

  editPlan(payload) {
    let url = APIs.PLANS_ID_URL.replace(':id', payload.plan_id);
    return axiosInstance.put(url, payload);
  }

  deletePlan(payload) {
    let url = APIs.PLANS_ID_URL.replace(':id', payload.plan_id);
    return axiosInstance.delete(url, payload);
  }

  addUserPlan(payload) {
    return axiosInstance.post(APIs.ADD_USER_PLAN, payload);
  }
}

export default PlanService;
