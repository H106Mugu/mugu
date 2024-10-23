/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Modal, Form, Input, Checkbox, Button } from "antd";
import { useStores } from "../mobx/context/StoreContext";

import { pdf } from "@react-pdf/renderer";
import PDFDocument from "./PDFDocument";

import { observer } from "mobx-react-lite";
import { acrylicColorOptions, stainlessColorOptions } from "../data/optionData";

function convertToSentenceCase(str) {
  // Insert a space before all capital letters and convert the string to lowercase
  let result = str.replace(/([A-Z])/g, " $1").toLowerCase();

  // Capitalize the first letter
  result = result.charAt(0).toUpperCase() + result.slice(1);

  return result;
}

function getColorNameFromHex(hex, type) {
  if (type === "acrylic") {
    return acrylicColorOptions.find((option) => option.value === hex).label
      .props.children[1].props.children;
  } else if (type === "stainless") {
    return stainlessColorOptions.find((option) => option.value === hex).label
      .props.children[1].props.children;
  }
}

function getPanelColors(colorRows, type) {
  const colorPanelMap = {};

  // Loop through colorRows to build a map of colors and their panel numbers
  Object.keys(colorRows).forEach((panel) => {
    const hex = colorRows[panel];
    const colorName = getColorNameFromHex(hex, type);

    if (colorPanelMap[colorName]) {
      colorPanelMap[colorName].push(Number(panel) + 1); // +1 because panels are 1-indexed
    } else {
      colorPanelMap[colorName] = [Number(panel) + 1];
    }
  });

  // Build the desired string format
  return Object.entries(colorPanelMap)
    .map(([colorName, panels]) => `${colorName}(Panel ${panels.join(",")})`)
    .join(", ");
}

const getUnitDimensions = (configValuesStore) => {
  const totalWidth = configValuesStore.totalLength.width;
  const totalHeight = configValuesStore.totalLength.height;
  const totalDepth = configValuesStore.configValues[0][0].depth;

  // Get unique column widths (assumes all rows have the same number of columns)
  const columnWidths = Object.keys(configValuesStore.configValues[0]).map(
    (colIndex) => configValuesStore.configValues[0][colIndex].width
  );

  // Get row heights
  const rowHeights = Object.keys(configValuesStore.configValues).map(
    (rowIndex) => configValuesStore.configValues[rowIndex][0].height
  );

  // Format column width string (only once for all columns)
  const columnWidthString = columnWidths
    .filter((width) => width !== undefined)
    .map((width, index) => `C${index + 1}: ${width}mm`)
    .join(", ");

  // Format row height string (once per row, from bottom to top)
  const rowHeightString = rowHeights
    .filter((height) => height !== undefined)
    .map((height, index) => `R${index + 1}: ${height}mm`)
    .join(", ");

  return [
    `${totalWidth}mm x ${totalHeight}mm x ${totalDepth}mm, Depth: ${totalDepth}mm`,
    `Column Width: From left (${columnWidthString})`,
    `Row Height: From bottom (${rowHeightString})`,
  ].join("\n");
};

const SubmitFormModal = observer(({ open, onClose }) => {
  const [form] = Form.useForm();
  const { submitFormStore, configValuesStore } = useStores();
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const onFinish = async (values) => {
    submitFormStore.setFields(values);
    setLoading(true);

    console.log(
      "configValuesStore.getAllImagesUrl.frontView",
      configValuesStore.getAllImagesUrl.frontView
    );
    // Create the PDF
    const doc = (
      <PDFDocument
        data={{
          basicInfo: values,
          materialInfo: [
            {
              key: "Base shelf type",
              value:
                configValuesStore.getAllConfigValues.shelfType
                  .charAt(0)
                  .toUpperCase() +
                configValuesStore.getAllConfigValues.shelfType.slice(1) +
                " Panel",
            },
            {
              key: "Structure element",
              value: convertToSentenceCase(
                configValuesStore.getAllConfigValues.structureElements
              ),
            },
            {
              key: "Unit Dimensions",
              value: getUnitDimensions(configValuesStore),
            },
            {
              key: "Panel Colour",
              value:
                configValuesStore.getAllConfigValues.shelfType === "acrylic"
                  ? "From bottom: " +
                    getPanelColors(configValuesStore.getColorRows, "acrylic")
                  : getColorNameFromHex(
                      configValuesStore.getAllConfigValues.color,
                      "stainless"
                    ),
            },
          ],
          images: {
            front: configValuesStore.getAllImagesUrl.frontView,
            top: configValuesStore.getAllImagesUrl.topView,
            isometric: configValuesStore.getAllImagesUrl.isometricView,
          },
          // configValues: submitFormStore.configValues,
        }}
      />
    );
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
              disabled={
                Object.values(configValuesStore.getAllImagesUrl)[2] === null
              }
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
});

export default SubmitFormModal;
