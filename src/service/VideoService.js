import * as APIs from '../common/backendConstants';
import { axiosInstance } from '../store/store';

export default class VideoService {
  getActiveCalls() {
    return axiosInstance.get(APIs.GET_ACTIVE_CALLS_LIST);
  }

  getActiveCallMembers(conference_room_id) {
    return axiosInstance.get(
      `${APIs.ROOM_MEMBERS}?conference_room_id=${conference_room_id}`
    );
  }

  joinRoom(payload) {
    return axiosInstance.post(APIs.JOIN_ROOM, payload);
  }

  disconnectCall(payload) {
    return axiosInstance.post(APIs.DISCONNECT_CALL, payload);
  }
}
