import ElderService from '../../service/ElderService';

export default class EldersFriendsManager {
  constructor() {
    this.elderService = new ElderService();
  }

  getElderFriendData = id => this.elderService.getElderFriendData(id);

  addElderFriendData = payload => this.elderService.addElderFriendData(payload);

  updateElderFriendData = (id, payload) =>
    this.elderService.updateElderFriendData(id, payload);

  getElderFriendNotes = payload =>
    this.elderService.getElderFriendNotes(payload);

  addElderFriendNotes = payload =>
    this.elderService.addElderFriendNotes(payload);
}
