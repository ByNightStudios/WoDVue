import {
  ADDNOTIFICATION,
  READNOTIFICATIONS,
  FETCHNOTIFICATION,
  RESETNOTIFICATIONS,
} from '../common/backendConstants';

const initialState = {
  notifications: [],
  notificationsCount: 0,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case FETCHNOTIFICATION:
      return {
        ...state,
        notifications: [
          ...state.notifications,
          ...action.payload.notifications,
        ],
        notificationsCount: action.payload.unread_count,
      };

    case ADDNOTIFICATION:
      let updatedNotifications = Object.assign([], state.notifications);
      updatedNotifications.unshift(action.payload);

      let updatedNotificationsCount = state.notificationsCount;
      updatedNotificationsCount++;

      return {
        ...state,
        notifications: updatedNotifications,
        notificationsCount: updatedNotificationsCount,
      };

    case READNOTIFICATIONS:
      let readNotificationsArr = Object.assign([], state.notifications);
      for (let notification of readNotificationsArr) {
        notification.read = true;
      }

      return {
        ...state,
        notifications: readNotificationsArr,
        notificationsCount: 0,
      };

    case RESETNOTIFICATIONS:
      return {
        ...state,
        notifications: [],
        notificationsCount: 0,
      };

    default:
      return state;
  }
}
