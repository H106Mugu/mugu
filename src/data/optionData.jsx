import structure1 from "../assets/images/structure/structure1.png";
import structure2 from "../assets/images/structure/structure2.png";
import structure3 from "../assets/images/structure/structure3.png";
import structure4 from "../assets/images/structure/structure4.png";
import structure5 from "../assets/images/structure/structure5.png";

export const shelfTypeOption = [
  {
    label: (
      <div className="flex flex-col items-center justify-center h-full max-h-24 w-32 text-center bg-gray-100">
        <img
          src={structure3}
          alt="All (no front)"
          className="w-10 h-10 mix-blend-multiply"
        />
        <p className="text-[12px] leading-4">Acrylic Panel Shelf</p>
        <p className="text-[10px] leading-3">*Open shelves only</p>
      </div>
    ),
    value: "acrylic",
  },
  {
    label: (
      <div className="flex flex-col items-center justify-center h-full max-h-24 w-32 text-center bg-gray-100">
        <img
          src={structure1}
          alt="All (no front)"
          className="w-10 h-10 mix-blend-multiply"
        />
        <p className="text-[12px] leading-4">Stainless Panel Shelf</p>
        <p className="text-[10px] leading-3">*Open & closed shelves</p>
      </div>
    ),
    value: "stainless",
  },
];

export const structureElements = [
  {
    label: (
      <div className="flex flex-col items-center justify-start h-[72px] w-16 text-center">
        <img src={structure1} alt="All (no front)" className="w-8 h-8" />
        <p className="text-[11px] leading-3">All (no front)</p>
      </div>
    ),
    value: "all",
  },
  {
    label: (
      <div className="flex flex-col items-center justify-start h-[72px] w-16 text-center">
        <img src={structure2} alt="Without Back" className="w-8 h-8" />
        <p className="text-[11px] leading-3">Without Back</p>
      </div>
    ),
    value: "withoutBack",
  },
  {
    label: (
      <div className="flex flex-col items-center justify-start h-[72px] w-16 text-center">
        <img
          src={structure3}
          alt="With top and bottom only"
          className="w-8 h-8"
        />
        <p className="text-[11px] leading-3">With top and bottom only</p>
      </div>
    ),
    value: "withTopAndBottomOnly",
  },
  {
    label: (
      <div className="flex flex-col items-center justify-start h-[72px] w-16 text-center">
        <img src={structure4} alt="Without Shelves" className="w-8 h-8" />
        <p className="text-[11px] leading-3">Without Shelves</p>
      </div>
    ),
    value: "withoutShelves",
  },
  {
    label: (
      <div className="flex flex-col items-center justify-start h-[72px] w-16 text-center">
        <img
          src={structure5}
          alt="Without Shelves and walls"
          className="w-8 h-8"
        />
        <p className="text-[11px] leading-3">Without Shelves and walls</p>
      </div>
    ),
    value: "withoutShelvesAndWalls",
  },
];

export const colorOptions = [
  {
    label: (
      <div
        style={{ backgroundColor: "black" }}
        className="w-8 h-8 rounded-full border"
      />
    ),
    value: "black",
  },

  {
    label: (
      <div
        style={{ backgroundColor: "purple" }}
        className="w-8 h-8 rounded-full border"
      />
    ),
    value: "purple",
  },
  {
    label: (
      <div
        style={{ backgroundColor: "orange" }}
        className="w-8 h-8 rounded-full border"
      />
    ),
    value: "orange",
  },

  {
    label: (
      <div
        style={{ backgroundColor: "brown" }}
        className="w-8 h-8 rounded-full border"
      />
    ),
    value: "brown",
  },

  {
    label: (
      <div
        style={{ backgroundColor: "silver" }}
        className="w-8 h-8 rounded-full border"
      />
    ),
    value: "silver",
  },
];

export const widthOptions = [
  { label: "150", value: "150" },
  { label: "313", value: "313" },
  { label: "550", value: "550" },
  { label: "750", value: "750" },
  { label: "1000", value: "1000" },
];

export const heightOptions = [
  { label: "330", value: "330" },
  { label: "550", value: "550" },
  { label: "750", value: "750" },
  { label: "1000", value: "1000" },
];

export const depthOptions = [
  { label: "330", value: "330" },
  { label: "550", value: "550" },
];
