import * as APIs from '../common/backendConstants';
import { axiosInstance } from '../store/store';

class NotificationService {
  getNotifications(currentPage) {
    let apiUrl = `${APIs.NOTIFICATIONS_SELF}?page=${currentPage}`;
    return axiosInstance.get(apiUrl);
  }

  addNotification(payload) {
    return axiosInstance.post(APIs.NOTIFICATIONS, payload);
  }

  markNotificationsRead() {
    return axiosInstance.put(APIs.NOTIFICATIONS_SELF);
  }
}

export default NotificationService;
