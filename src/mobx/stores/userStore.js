import { makeAutoObservable } from "mobx";

class UserStore {
  userName = ""; // Initially empty

  constructor() {
    makeAutoObservable(this);
  }

  get getUserName() {
    return this.userName;
  }

  setUserName(name) {
    this.userName = name;
  }
}

export default new UserStore();
