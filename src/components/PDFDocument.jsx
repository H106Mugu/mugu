/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
// PDFDocument.js
import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  Link,
} from "@react-pdf/renderer";
import { Font } from "@react-pdf/renderer";
import muguLogo from "../assets/icons/mugu-logo.png";
import websiteIcon from "../assets/icons/websiteIcon.png";
import emailIcon from "../assets/icons/emailIcon.png";
import instagramIcon from "../assets/icons/instagramIcon.png";

// Import font files directly
import InterRegular from "../assets/fonts/Inter/static/Inter_18pt-Regular.ttf";
import InterBold from "../assets/fonts/Inter/static/Inter_18pt-Bold.ttf";

// Register the Inter font from local files
Font.register({
  family: "Inter",
  fonts: [
    { src: InterRegular }, // Regular weight
    { src: InterBold, fontWeight: "bold" }, // Bold weight
  ],
});

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#F3F0EB",
    height: "100%", // Ensure the page fills the height
    fontFamily: "Inter", // Set the font family for the entire PDF
  },
  section: {
    width: "100%", // Full width for each section
    borderBottom: "1px solid #DFDCDC", // Adding a border to each section
  },
  sectionWithoutBorder: {
    width: "100%", // Full width for each section
    padding: 20,
  },
  title: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 10,
  },
  text: {
    fontSize: 11,
  },
  sectionFlexRow: {
    flexDirection: "row", // Align children in a row
    height: "100%", // Full height for section 1
  },
  leftColumn: {
    width: "50%", // Left column width
    textAlign: "start", // Center text in the right column
    padding: 20,
  },
  rightColumn: {
    width: "50%", // Right column width
    textAlign: "start", // Center text in the right column
    padding: 20,
  },
  logo: {
    width: 20,
    height: 20,
  },
  section1Text: {
    fontSize: 11,
    fontWeight: "bold",
    paddingTop: 5,
  },

  tableContainer: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    border: "1px solid #DFDCDC",
  },
  tableRow: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    height: "40px",
    borderBottom: "1px solid #DFDCDC",
  },
  tableCell: {
    display: "flex",
    justifyContent: "center",
    paddingLeft: 5,
    borderRight: "1px solid #DFDCDC",
  },
  leftTableColumn: {
    flex: 3, // 30% of the row width
  },
  rightTableColumn: {
    flex: 7, // 70% of the row width
    borderRight: "none",
  },
  lastRow: {
    borderBottom: "none",
  },
  tableText: {
    fontSize: 11,
  },
  rowContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  rowColumn: {
    width: "33.33%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "start",
    alignItems: "center",
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  linkText: {
    fontSize: 11,
    color: "#000000", // Standard color for links in PDFs
    textDecoration: "none", // Remove underline from links
  },
  threeDImage: {
    flex: 1, // This will take up all the remaining space
    justifyContent: "center", // Center content vertically
    alignItems: "center", // Center content horizontally
    backgroundColor: "#DFDCDC", // Example background color
    marginBottom: 16,
  },
  frontAndSideImage: {
    display: "flex",
    gap: 16,
    flexDirection: "row",
    flex: 1, // This will take up all the remaining space
    justifyContent: "center", // Center content vertically
    alignItems: "center", // Center content horizontally
  },
  frontImage: {
    width: "66%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#DFDCDC",
  },
  sideImage: {
    width: "34%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#DFDCDC",
  },
});

const PAGE_HEIGHT = 297; // A4 page height in mm

// const sectionHeights = [7.1, 12.1, 41.8, 22.8, 9, 7.1];
const sectionHeights = [7.1, 12.1, 80.8, 7.1, 40, 9, 7.1]; // percentages of page height

function formatDate(date) {
  const options = { day: "numeric", month: "long", year: "numeric" };
  const formattedDate = date.toLocaleDateString("en-US", options);

  // Add ordinal suffix to the day
  const day = date.getDate();
  const suffix =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
      ? "nd"
      : day % 10 === 3 && day !== 13
      ? "rd"
      : "th";

  return formattedDate.replace(/(\d+)/, `$&${suffix}`);
}

const PDFDocument = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View
        style={{
          ...styles.section,
          height: `${(sectionHeights[0] * PAGE_HEIGHT) / 100}mm`,
        }}
      >
        <View style={styles.sectionFlexRow}>
          <View style={styles.leftColumn}>
            <Image src={muguLogo} style={styles.logo} />
          </View>
          <View style={styles.rightColumn}>
            <Text style={styles.section1Text}>
              "Modular designs, unique utility in every grid."
            </Text>
          </View>
        </View>
      </View>
      <View
        style={{
          ...styles.section,
          height: `${(sectionHeights[1] * PAGE_HEIGHT) / 100}mm`,
        }}
      >
        <View style={styles.sectionFlexRow}>
          <View style={styles.leftColumn}>
            <Text style={styles.title}>Quote for</Text>
            <Text style={styles.text}>{data.basicInfo.name}</Text>
            <Text style={styles.text}>{data.basicInfo.email}</Text>
            <Text style={styles.text}>
              Postal Code: {data.basicInfo.postcode}
            </Text>
          </View>
          <View style={styles.rightColumn}>
            <Text style={styles.title}>Request for Quotation</Text>
            <Text style={styles.text}>
              You've requested a quote for a customised shelf on{" "}
              {formatDate(new Date())}. Here are the details of your
              configuration.
            </Text>
          </View>
        </View>
      </View>
      <View
        style={{
          ...styles.section,
          height: `${(sectionHeights[2] * PAGE_HEIGHT) / 100}mm`,
          padding: 20,
        }}
      >
        <Text style={styles.title}>Your configuration</Text>
        <View style={styles.threeDImage}>
          <Image
            src={data.images.isometric}
            style={{
              height: "100%",
              objectFit: "contain",
            }}
          />
        </View>
        {/* <View style={styles.frontAndSideImage}>
          <View style={styles.frontImage}>
            <Image
              style={{
                height: "100%",
                objectFit: "contain",
              }}
              src={data.images.front}
            />
          </View>
          <View style={styles.sideImage}>
            <Image
              style={{
                height: "100%",
                objectFit: "contain",
              }}
              src={data.images.side}
            />
          </View>
        </View> */}
      </View>
    </Page>
    <Page size="A4" style={styles.page}>
      <View
        style={{
          ...styles.section,
          height: `${(sectionHeights[3] * PAGE_HEIGHT) / 100}mm`,
        }}
      >
        <View style={styles.sectionFlexRow}>
          <View style={styles.leftColumn}>
            <Image src={muguLogo} style={styles.logo} />
          </View>
          <View style={styles.rightColumn}>
            <Text style={styles.section1Text}>
              "Modular designs, unique utility in every grid."
            </Text>
          </View>
        </View>
      </View>
      <View
        style={{
          ...styles.section,
          height: `${(sectionHeights[4] * PAGE_HEIGHT) / 100}mm`,
        }}
      >
        <View
          style={{
            padding: 20,
          }}
        >
          <Text style={styles.title}>Unit Material info</Text>
          <View style={styles.tableContainer}>
            {data?.materialInfo?.map((item, index) => (
              <View
                style={[
                  styles.tableRow, // Default row style
                  index === data?.materialInfo.length - 1 && styles.lastRow, // Add lastRow style if it's the last row
                ]}
                key={index}
              >
                <View style={[styles.tableCell, styles.leftTableColumn]}>
                  <Text style={styles.tableText}>{item.key}</Text>
                </View>
                <View style={[styles.tableCell, styles.rightTableColumn]}>
                  <Text style={styles.tableText}>{item.value}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>
      <View
        style={{
          ...styles.section,
          height: `${(sectionHeights[5] * PAGE_HEIGHT) / 100}mm`,
        }}
      >
        <View
          style={{
            padding: 20,
          }}
        >
          <Text style={styles.title}>Next Step</Text>
          <Text style={styles.text}>
            Thank you for your submission. Our team will be in touch shortly
            with your quotation.
          </Text>
        </View>
      </View>
      <View
        style={{
          ...styles.sectionWithoutBorder,
          height: `${(sectionHeights[6] * PAGE_HEIGHT) / 100}mm`,
        }}
      >
        <View style={styles.rowContainer}>
          {/* First Column: Website Icon and URL */}
          <View style={styles.rowColumn}>
            <Image src={websiteIcon} style={styles.icon} />
            <Link src="https://mugu.com.au/" style={styles.linkText}>
              https://mugu.com.au/
            </Link>
          </View>

          {/* Second Column: Email Icon and Email Address */}
          <View style={styles.rowColumn}>
            <Image src={emailIcon} style={styles.icon} />
            <Link src="mailto:info@mugu.com.au" style={styles.linkText}>
              info@mugu.com.au
            </Link>
          </View>

          {/* Third Column: Instagram Icon and Instagram Handle */}
          <View style={styles.rowColumn}>
            <Image src={instagramIcon} style={styles.icon} />
            <Link
              src="https://instagram.com/mugu.space"
              style={styles.linkText}
            >
              mugu.space
            </Link>
          </View>
        </View>
      </View>
    </Page>
  </Document>
);

export default PDFDocument;
