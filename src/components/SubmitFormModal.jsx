/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Modal, Form, Input, Checkbox, Button, message } from "antd";
import { useStores } from "../mobx/context/StoreContext";
import ReCAPTCHA from "react-google-recaptcha";

import { pdf } from "@react-pdf/renderer";
import PDFDocument from "./PDFDocument";

import { observer } from "mobx-react-lite";
import { acrylicColorOptions, stainlessColorOptions } from "../data/optionData";
import { set } from "mobx";
import { IoCloseOutline } from "react-icons/io5";

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(",")[1]); // Removing Data URI prefix
    reader.onerror = (error) => reject(error);
  });
}

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
  const totalDepth = configValuesStore.totalDepth;

  // Get unique column widths (assumes all rows have the same number of columns)
  const columnWidths = Object.keys(configValuesStore.getAllConfigValues[0]).map(
    (colIndex) => configValuesStore.getAllConfigValues[0][colIndex]?.width
  );

  // // Get row heights
  // const rowHeights = Object.keys(configValuesStore.getAllConfigValues).map(
  //   (rowIndex) => configValuesStore.getAllConfigValues[rowIndex][0]?.height
  // );

  // Get row heights
  const rowHeights = Object.keys(configValuesStore.getAllConfigValues).map(
    (rowIndex) => {
      const row = configValuesStore.getAllConfigValues[rowIndex];

      // Ensure that row is an object
      if (typeof row === "object" && row !== null) {
        // Find the first cuboid with a height in the row object
        const firstValidCuboid = Object.values(row).find(
          (cuboid) => cuboid && cuboid.height
        );

        // Return the height if a valid cuboid is found, otherwise null
        return firstValidCuboid ? firstValidCuboid.height : null;
      }

      // If row is not an object, return null or handle as needed
      return null;
    }
  );

  // Format column width string (only once for all columns)
  const columnWidthString = columnWidths
    .filter((width) => width !== undefined && width !== null)
    .map((width, index) => `C${index + 1}: ${width}mm`)
    .join(", ");

  // Format row height string (once per row, from bottom to top)
  const rowHeightString = rowHeights
    .filter((height) => height !== undefined && height !== null)
    .map((height, index) => `R${index + 1}: ${height}mm`)
    .join(", ");

  const unitDepth = configValuesStore.getAllConfigValues[0][0]?.depth;

  return {
    totalDimensions: `${totalWidth}mm x ${totalHeight}mm x ${totalDepth}mm`,
    columnWidths: `From left (${columnWidthString})`,
    rowHeights: `From bottom (${rowHeightString})`,
    unitDepth: `${unitDepth}mm`,
  };
};

const SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

const SubmitFormModal = observer(({ open, onClose }) => {
  const [form] = Form.useForm();
  const { submitFormStore, configValuesStore, loadingStore } = useStores();
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { totalDimensions, columnWidths, rowHeights, unitDepth } =
    getUnitDimensions(configValuesStore);
  const [captchaValue, setCaptchaValue] = useState(null); // Store captcha value
  const [captchaError, setCaptchaError] = useState(false); // Store captcha error
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values) => {
    if (!captchaValue) {
      setCaptchaError(true);
      return;
    }

    submitFormStore.setFields(values);
    setLoading(true);

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
              key: "Total Dimensions(WxHxD)",
              value: totalDimensions,
            },
            {
              key: "Column Width",
              value: columnWidths,
            },
            {
              key: "Row Height",
              value: rowHeights,
            },
            {
              key: "Unit Depth",
              value: unitDepth,
            },
            {
              key: "Panel Colour",
              value:
                configValuesStore.getAllConfigValues.shelfType === "acrylic"
                  ? configValuesStore.configValues.structureElements ===
                    "withTopAndBottomOnly"
                    ? "From bottom: " +
                      getPanelColors(configValuesStore.getColorRows, "acrylic")
                    : "No Panels"
                  : getColorNameFromHex(
                      configValuesStore.getAllConfigValues.color,
                      "stainless"
                    ),
            },
          ],
          images: {
            front: configValuesStore.getAllImagesUrl.frontView,
            side: configValuesStore.getAllImagesUrl.sideView,
            isometric: configValuesStore.getAllImagesUrl.isometricView,
          },
          // configValues: submitFormStore.configValues,
        }}
      />
    );
    const blob = await pdf(doc).toBlob();

    // POst api at https://uoqvpuvzgbe4tmdfvd5emkf3de0ewgps.lambda-url.ap-south-1.on.aws/

    fetch(
      "https://uoqvpuvzgbe4tmdfvd5emkf3de0ewgps.lambda-url.ap-south-1.on.aws/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          pdf: await toBase64(blob),
          postcode: values.postcode,
          requireShipping: values.requireShipping,
        }),
      }
    )
      .then((response) => {
        if (response.ok) {
          // message.success("Form submitted successfully");
          // console.log("Response", response);
          setLoading(false);
          setIsSubmitted(true);
          form.resetFields();
        }
      })
      .catch((error) => {
        console.error("Error submitting form", error);
        // message.error("Error submitting form");

        messageApi.open({
          type: "error",
          duration: 5,
          content: (
            <div className="bg-theme-primary text-white text-sm flex items-center">
              Error submitting form
              <IoCloseOutline
                className="text-white text-lg ms-3 cursor-pointer"
                onClick={() => messageApi.destroy()}
              />
            </div>
          ),
        });

        setLoading(false);
      });

    // Trigger download
    // const url = URL.createObjectURL(blob);
    // const a = document.createElement("a");
    // a.href = url;
    // a.download = "Mugu-quote-" + values.name + ".pdf";
    // document.body.appendChild(a);
    // a.click();
    // document.body.removeChild(a);
    // URL.revokeObjectURL(url);

    // setTimeout(() => {
    //   setLoading(false);
    //   setIsSubmitted(true);
    //   form.resetFields();
    // }, 1800);
  };

  const handleCaptchaChange = (value) => {
    setCaptchaError(false); // Reset captcha error when it changes
    setCaptchaValue(value); // Update captcha value when it changes
  };

  return (
    <>
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
        {/* <button
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
      </button> */}
        <p className="my-4 font-semibold">Your info</p>
        <Form
          disabled={isSubmitted}
          form={form}
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={(errorInfo) => {
            if (!captchaValue) {
              setCaptchaError(true);
            }
          }}
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

          {/* Add reCAPTCHA component */}
          <Form.Item>
            <ReCAPTCHA
              disabled={isSubmitted}
              className={`${
                captchaError ? "border" : "border-none"
              } border-[#ff4d4f] rounded w-[100.5%] h-[78px]`}
              sitekey={SITE_KEY}
              onChange={handleCaptchaChange}
            />
            {/* Display error message if reCAPTCHA is not completed */}
            {captchaError && (
              <div className="text-[#ff4d4f]">
                Please complete the reCAPTCHA!
              </div>
            )}
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
                  configValuesStore.getAllImagesUrl.isometricView === null
                }
                type="default"
                htmlType="submit"
                className="w-full"
              >
                <span className="text-sm">Submit</span>
              </Button>
            </Form.Item>
          )}
        </Form>
      </Modal>
      {contextHolder}
    </>
  );
});

export default SubmitFormModal;
