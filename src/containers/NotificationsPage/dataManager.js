import NotificationServiceFile from '../../service/NotificationService';
const NotificationService = new NotificationServiceFile();

class NotificationsManager {
  addNotification(inputs) {
    let payload = {
      user_id: inputs.userID,
      content: inputs.content,
    };

    return NotificationService.addNotification(payload);
  }
}

export default NotificationsManager;
