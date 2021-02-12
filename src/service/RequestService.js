import * as APIs from '../common/backendConstants';
import { axiosInstance } from '../store/store';

class RequestService {
  getRequestProof(payload) {
    return axiosInstance.get(
      `${APIs.REQUEST_MEDIA_FETCH_URL}?type=${payload.type}&request_id=${payload.requestID}`
    );
  }

  addRequestProof(payload) {
    return axiosInstance.post(APIs.REQUEST_MEDIA_ADD_URL, payload);
  }

  addRequestMedia(payload) {
    return axiosInstance.post(APIs.UPLOAD_REQUEST_MEDIA_URL, payload);
  }

  getServicePendingResponders(id) {
    return axiosInstance.get(
      APIs.PENDING_SERVICE_RESPONDERS.replace(':id', id)
    );
  }
}

export default RequestService;
