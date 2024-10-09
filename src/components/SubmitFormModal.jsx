import React, { useState } from "react";
import { Modal, Form, Input, Checkbox, Button } from "antd";
import { useStores } from "../mobx/context/StoreContext";

const SubmitFormModal = ({ open, onClose }) => {
  const [form] = Form.useForm();
  const { submitFormStore } = useStores();
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const onFinish = (values) => {
    console.log("Received values from form: ", values);
    submitFormStore.setFields(values);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsSubmitted(true);
      form.resetFields();
    }, 1800);
  };

  return (
    <Modal
      centered
      width={325}
      title="Submit your custom design"
      open={open}
      onCancel={onClose}
      footer={null} // No default footer buttons
    >
      <div className="font-thin text-sm leading-4">
        Thank you for customising your shelf design! Please provide your
        information below, and one of our friendly team members will reach out
        to you shortly with the quote.
      </div>
      <p className="my-4 font-semibold">Your info</p>
      <Form
        disabled={isSubmitted}
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ requireShipping: false }}
      >
        <Form.Item
          name="name"
          rules={[{ required: true, message: "Please enter your name!" }]}
        >
          <Input
            placeholder="Name*"
            className="!p-[8px] rounded-none border-[#BCBCBC]"
          />
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
          <Input
            placeholder="Email*"
            className="!p-[8px] rounded-none border-[#BCBCBC]"
          />
        </Form.Item>

        <Form.Item
          name="postcode"
          rules={[{ required: true, message: "Please enter your postcode!" }]}
        >
          <Input
            placeholder="Postcode*"
            className="!p-[8px] rounded-none border-[#BCBCBC]"
          />
        </Form.Item>

        <Form.Item
          name="requireShipping"
          valuePropName="checked"
          className="-mt-1"
        >
          <Checkbox>Require Shipping</Checkbox>
        </Form.Item>

        {isSubmitted ? (
          <div className="leading-5 pb-7">
            <div className="text-green-600">Submission Successful!</div>
            <div>Thank you! We'll in touch soon with your quote.</div>
          </div>
        ) : (
          <Form.Item className="w-full pb-[32px]">
            <Button
              loading={loading}
              type="default"
              htmlType="submit"
              className="w-full"
            >
              Submit
            </Button>
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default SubmitFormModal;
