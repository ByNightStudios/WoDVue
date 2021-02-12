import * as APIs from '../common/backendConstants';
import { axiosInstance } from '../store/store';

class ResponderService {
  getResponderKYC(payload) {
    return axiosInstance.get(
      APIs.RESPONDER_KYC_URL.replace(':responder_id', payload.responder_id)
    );
  }

  addResponderKYC(payload) {
    return axiosInstance.post(APIs.RESPONDER_KYC_UPLOAD, payload);
  }

  requestVerification(payload) {
    return axiosInstance.post(APIs.RESPONDER_VERIFICATION_URL, payload);
  }

  getVerificationData(id) {
    return axiosInstance.get(`${APIs.RESPONDER_VERIFICATION_URL}/${id}`);
  }
}

export default ResponderService;
