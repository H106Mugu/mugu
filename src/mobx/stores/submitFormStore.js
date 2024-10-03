import { makeAutoObservable } from "mobx";

class SubmitFormStore {
  isOpen = false; // Modal visibility state
  fields = {
    name: "",
    email: "",
    postcode: "",
    requireShipping: false,
  };

  constructor() {
    makeAutoObservable(this); // Automatically make the class observable
  }

  // Getter for isOpen
  get isModalOpen() {
    return this.isOpen;
  }

  // Setter for isOpen
  setModalOpen(value) {
    this.isOpen = value;
  }

  // Getter for fields
  get getFormFields() {
    return this.fields;
  }

  // Setter for all fields at once
  setFields(fields) {
    this.fields = { ...this.fields, ...fields }; // Merge the existing fields with the new values
  }

  // Reset form fields
  resetFields() {
    this.fields = {
      name: "",
      email: "",
      postcode: "",
      requireShipping: false,
    };
  }
}

const submitFormStore = new SubmitFormStore();
export default submitFormStore;
