import * as APIs from "../common/backendConstants";
import { axiosInstance } from "../store/store";

class OrderService {
  getOrdersService(payload) {
    let url = APIs.GET_ORDERS_URL;
    let page = 0;
    if (payload.page) {
      page = payload.page;
      url = `${url}?page=${page - 1}`;
    }
    if (payload.search) {
      url = `${url}&search=${payload.search}`;
    }
    if (payload.status !== null) {
      url = `${url}&status=${payload.status}`;
    }
    return axiosInstance.get(url);
  }

  getOrderByIDService(payload) {
    let url = APIs.GET_ORDERS_BY_ID_URL.replace(":order_id", payload.order_id);

    return axiosInstance.get(url);
  }
}

export default OrderService;
