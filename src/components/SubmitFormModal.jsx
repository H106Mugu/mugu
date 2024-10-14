import React, { useState } from "react";
import { Modal, Form, Input, Checkbox, Button } from "antd";
import { useStores } from "../mobx/context/StoreContext";

import { pdf } from "@react-pdf/renderer";
import PDFDocument from "./PDFDocument"; // Adjust the path as necessary

const SubmitFormModal = ({ open, onClose }) => {
  const [form] = Form.useForm();
  const { submitFormStore } = useStores();
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const onFinish = async (values) => {
    console.log("Received values from form: ", values);
    submitFormStore.setFields(values);
    setLoading(true);

    // Create the PDF
    const doc = <PDFDocument data={values} />;
    const blob = await pdf(doc).toBlob();

    // Trigger download
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Mugu-quote.pdf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setTimeout(() => {
      setLoading(false);
      setIsSubmitted(true);
      form.resetFields();
    }, 1800);
  };

  return (
    <Modal
      centered
      width={330}
      title="Submit your custom design"
      open={open}
      onCancel={onClose}
      footer={null} // No default footer buttons
    >
      <div className="font-medium text-sm leading-4">
        Thank you for customising your shelf design! Please provide your
        information below, and one of our friendly team members will reach out
        to you shortly with the quote.
      </div>
      <button
        className="border mt-4 rounded-md p-2 bg-theme-primary text-white"
        onClick={() =>
          form.setFieldsValue({
            name: "John Doe",
            email: "test@test.com",
            postcode: "2000",
            requireShipping: true,
          })
        }
      >
        Fill Form
      </button>
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
          rules={[
            { required: true, message: "Please enter your postcode!" },
            {
              pattern: /^[0-9]{4}$/, // Regular expression for Australian postcodes
              message: "Please enter a valid Australian postcode!",
            },
          ]}
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
