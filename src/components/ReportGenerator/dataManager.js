import ReportGeneratorService from "../../service/ReportGeneratorService";

export default class ReportGeneratorDataManager {
  constructor() {
    this.reportService = new ReportGeneratorService();
  }

  generateReport = (payload) => {
    return this.reportService.generateReport(payload);
  };
}
