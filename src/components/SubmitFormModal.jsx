import React from "react";
import { Modal, Form, Input, Checkbox, Button } from "antd";
import { useStores } from "../mobx/context/StoreContext";

const SubmitFormModal = ({ open, onClose }) => {
  const [form] = Form.useForm();
  const { submitFormStore } = useStores();

  const onFinish = (values) => {
    console.log("Received values from form: ", values);
    // Handle form submission logic here
    // For example, send data to server or API
    submitFormStore.setFields(values);
  };

  return (
    <Modal
      title={
        <div className="text-lg font-semibold">Submit your custom design</div>
      }
      open={open}
      onCancel={onClose}
      footer={null} // No default footer buttons
    >
      <p className="my-4">
        Thank you for customising your shelf design! Please provide your
        information below, and one of our friendly team members will reach out
        to you shortly with the quote.
      </p>
      <p className="mb-2 font-semibold">Your info:</p>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ requireShipping: false }}
      >
        <Form.Item
          name="name"
          rules={[{ required: true, message: "Please enter your name!" }]}
        >
          <Input placeholder="Enter your name" />
        </Form.Item>

        <Form.Item
          name="email"
          rules={[
            {
              required: true,
              type: "email",
              message: "Please enter a valid email!",
            },
          ]}
        >
          <Input placeholder="Enter your email" />
        </Form.Item>

        <Form.Item
          name="postcode"
          rules={[{ required: true, message: "Please enter your postcode!" }]}
        >
          <Input placeholder="Enter your postcode" />
        </Form.Item>

        <Form.Item name="requireShipping" valuePropName="checked">
          <Checkbox>Require Shipping</Checkbox>
        </Form.Item>

        <Form.Item className="w-full">
          <Button type="primary" htmlType="submit" className="w-full">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SubmitFormModal;
