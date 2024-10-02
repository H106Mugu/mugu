import { makeAutoObservable } from "mobx";

class ModalStore {
  isModalShownAlready = false; // Initially false

  constructor() {
    makeAutoObservable(this);
  }

  get getModalState() {
    return this.isModalShownAlready;
  }

  setModalState(value) {
    this.isModalShownAlready = value;
  }
}

export default new ModalStore();
