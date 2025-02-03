import acrylic from "../assets/images/structure/acrylic.png";
import stainless from "../assets/images/structure/stainless.png";

import all from "../assets/images/structure/all.png";
import withoutBack from "../assets/images/structure/withoutBack.png";
import withoutShelves from "../assets/images/structure/withoutShelves.png";
import withoutShelvesAndWalls from "../assets/images/structure/withTopAndBottomOnlyAcrylic.png";
import withTopAndBottomOnly from "../assets/images/structure/withTopAndBottomOnly.png";
import withTopAndBottomOnlyAcrylic from "../assets/images/structure/withTopAndBottomOnlyAcrylic.png";

export const shelfTypeOption = [
  {
    label: (
      <div className="flex flex-col items-center justify-center min-h-[131px] h-full w-full text-center">
        <img
          src={acrylic}
          alt="All (no front)"
          className="w-[53px] h-[53px] mix-blend-multiply"
        />
        <div className="text-[12px] leading-4">Acrylic Panel Shelf</div>
        <div className="text-[12px] font-light leading-3">
          *Open shelves only
        </div>
      </div>
    ),
    value: "acrylic",
  },
  {
    label: (
      <div className="flex flex-col items-center justify-center min-h-[131px] h-full w-full text-center">
        <img
          src={stainless}
          alt="All (no front)"
          className="w-[53px] h-[53px] mix-blend-multiply"
        />
        <div className="text-[12px] leading-4">Stainless Panel Shelf</div>
        <div className="text-[12px] font-light leading-3">
          *Open & closed shelves
        </div>
      </div>
    ),
    value: "stainless",
  },
];

export const structureElements = [
  {
    label: (
      <div className="flex flex-col items-center justify-start pt-7 h-full min-h-[131px] w-full px-1">
        <img src={all} alt="All (no front)" className="w-[53px] h-[53px]" />
        <p className="text-xs leading-3">All (no front)</p>
      </div>
    ),
    value: "all",
  },
  {
    label: (
      <div className="flex flex-col items-center justify-start pt-7 h-full min-h-[131px] w-full px-1">
        <img
          src={withoutBack}
          alt="Without Back"
          className="w-[53px] h-[53px]"
        />
        <p className="text-xs leading-3">Without Back</p>
      </div>
    ),
    value: "withoutBack",
  },
  {
    label: (
      <div className="flex flex-col items-center justify-start pt-7 h-full min-h-[131px] w-full px-1">
        <img
          src={withTopAndBottomOnlyAcrylic}
          alt="With top and bottom only"
          className="w-[53px] h-[53px]"
        />
        <p className="text-xs leading-3">With top and bottom only</p>
      </div>
    ),
    value: "withTopAndBottomOnly",
  },
  // {
  //   label: (
  //     <div className="flex flex-col items-center justify-start pt-7 h-full min-h-[131px] w-full px-1">
  //       <img
  //         src={withTopAndBottomOnlyAcrylic}
  //         alt="With top and bottom only"
  //         className="w-[53px] h-[53px]"
  //       />
  //       <p className="text-xs leading-3">With top and bottom only</p>
  //     </div>
  //   ),
  //   value: "withTopAndBottomOnly-a",
  // },
  {
    label: (
      <div className="flex flex-col items-center justify-start pt-7 h-full min-h-[131px] w-full px-1">
        <img
          src={withoutShelves}
          alt="Without Shelves"
          className="w-[53px] h-[53px]"
        />
        <p className="text-xs leading-3">Without Shelves</p>
      </div>
    ),
    value: "withoutShelves",
  },
  {
    label: (
      <div className="flex flex-col items-center justify-start pt-7 h-full min-h-[131px] w-full px-1">
        <img
          src={withoutShelvesAndWalls}
          alt="Without Shelves and walls"
          className="w-[53px] h-[53px]"
        />
        <p className="text-xs leading-3">Without Shelves and walls</p>
      </div>
    ),
    value: "withoutShelvesAndWalls",
  },
];

export const acrylicColorOptions = [
  {
    label: (
      <div className="w-full h-[70px] flex flex-col justify-start items-center">
        <div
          style={{ backgroundColor: "#f7531d" }}
          className="w-8 h-8 rounded-full border mt-1 hover:border-theme-primary transition-all duration-300 ease-in-out opacity-60"
        />
        <div className="text-[12px] text-center font-normal leading-3 mt-1">
          Transparent Orange
        </div>
      </div>
    ),
    value: "#C36F0C",
  },
  {
    label: (
      <div className="w-full h-[70px] flex flex-col justify-start items-center">
        <div
          style={{ backgroundColor: "#000000" }}
          className="w-8 h-8 rounded-full border mt-1 hover:border-theme-primary transition-all duration-300 ease-in-out opacity-60"
        />
        <div className="text-[12px] text-center font-normal leading-3 mt-1">
          Transparent Black
        </div>
      </div>
    ),
    value: "#4D5461",
  },
  {
    label: (
      <div className="w-full h-[70px] flex flex-col justify-start items-center">
        <div
          style={{ backgroundColor: "#ffffff" }}
          className="w-8 h-8 rounded-full border mt-1 hover:border-theme-primary transition-all duration-300 ease-in-out"
        />
        <div className="text-[12px] text-center font-normal leading-3 mt-1">
          Solid White
        </div>
      </div>
    ),
    value: "#ffffff",
  },
  {
    label: (
      <div className="w-full h-[70px] flex flex-col justify-start items-center">
        <div
          style={{ backgroundColor: "#FFFFFF00" }}
          className="w-8 h-8 rounded-full border mt-1 hover:border-theme-primary transition-all duration-300 ease-in-out"
        />
        <div className="text-[12px] text-center font-normal leading-3 mt-1">
          Clear
        </div>
      </div>
    ),
    value: "#FFFFFF00",
  },
];

export const stainlessColorOptions = [
  {
    label: (
      <div className="w-full h-[70px] flex flex-col justify-start items-center">
        <div
          style={{ backgroundColor: "#EB5300" }}
          className="w-8 h-8 rounded-full border mt-1 hover:border-theme-primary transition-all duration-300 ease-in-out"
        />
        <div className="text-[12px] text-center font-normal leading-3 mt-1">
          Orange
        </div>
      </div>
    ),
    value: "#EB5300",
  },
  {
    label: (
      <div className="w-full h-[70px] flex flex-col justify-start items-center">
        <div
          style={{ backgroundColor: "#FFC525" }}
          className="w-8 h-8 rounded-full border mt-1 hover:border-theme-primary transition-all duration-300 ease-in-out"
        />
        <div className="text-[12px] text-center font-normal leading-3 mt-1">
          Yellow
        </div>
      </div>
    ),
    value: "#dd961b",
  },
  {
    label: (
      <div className="w-full h-[70px] flex flex-col justify-start items-center">
        <div
          style={{ backgroundColor: "#ffffff" }}
          className="w-8 h-8 rounded-full border mt-1 hover:border-theme-primary transition-all duration-300 ease-in-out"
        />
        <div className="text-[12px] text-center font-normal leading-3 mt-1">
          White
        </div>
      </div>
    ),
    value: "#ffffff",
  },
  {
    label: (
      <div className="w-full h-[70px] flex flex-col justify-start items-center">
        <div
          style={{ backgroundColor: "#000000" }}
          className="w-8 h-8 rounded-full border mt-1 hover:border-theme-primary transition-all duration-300 ease-in-out"
        />
        <div className="text-[12px] text-center font-normal leading-3 mt-1">
          Black
        </div>
      </div>
    ),
    value: "#000000",
  },
  {
    label: (
      <div className="w-full h-[70px] flex flex-col justify-start items-center">
        <div
          style={{ backgroundColor: "#F2D8D7" }}
          className="w-8 h-8 rounded-full border mt-1 hover:border-theme-primary transition-all duration-300 ease-in-out"
        />
        <div className="text-[12px] text-center font-normal leading-3 mt-1">
          Pink
        </div>
      </div>
    ),
    value: "#F2D8D7",
  },
  {
    label: (
      <div className="w-full h-[70px] flex flex-col justify-start items-center">
        <div
          style={{ backgroundColor: "#B0D0E7" }}
          className="w-8 h-8 rounded-full border mt-1 hover:border-theme-primary transition-all duration-300 ease-in-out"
        />
        <div className="text-[12px] text-center font-normal leading-3 mt-1">
          Sky
        </div>
      </div>
    ),
    value: "#B0D0E7",
  },
  {
    label: (
      <div className="w-full h-[70px] flex flex-col justify-start items-center">
        <div
          style={{ backgroundColor: "#6C7E41" }}
          className="w-8 h-8 rounded-full border mt-1 hover:border-theme-primary transition-all duration-300 ease-in-out"
        />
        <div className="text-[12px] text-center font-normal leading-3 mt-1">
          Matt Olive
        </div>
      </div>
    ),
    value: "#6C7E41",
  },
];

export const widthOptions = [
  { label: "270", value: "270" },
  { label: "370", value: "370" },
];

export const heightOptions = [
  { label: "121", value: "121" },
  { label: "180", value: "180" },
  { label: "200", value: "200" },
  { label: "270", value: "270" },
  { label: "313", value: "313" },
  { label: "370", value: "370" },
  { label: "483", value: "483" },
  { label: "603", value: "603" },
];

export const depthOptions = [
  { label: "270", value: "270" },
  { label: "370", value: "370" },
];
