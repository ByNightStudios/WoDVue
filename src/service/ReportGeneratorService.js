import * as APIs from "../common/backendConstants";
import { axiosInstance } from "../store/store";
import axios from "axios";

class ReportGeneratorService {
  constructor() {}

  generateReport(payload) {
    return axiosInstance.post(APIs.REPORTGENERATOR, payload);
  }
}

export default ReportGeneratorService;
