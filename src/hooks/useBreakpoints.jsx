import { useEffect, useState } from "react";

const breakpoints = {
  xs: "0px", // Extra small devices (phones)
  sm: "576px", // Small devices (tablets)
  md: "769px", // Medium devices (desktops)
  lg: "992px", // Large devices (desktops)
  xl: "1200px", // Extra large devices (large desktops)
  "2xl": "1536px", // 2x large devices (larger desktops)
};

const useBreakpoints = () => {
  const [breakpoint, setBreakpoint] = useState("md");

  const getBreakpoint = (width) => {
    if (width < parseInt(breakpoints.sm)) return "xs";
    if (width < parseInt(breakpoints.md)) return "sm";
    if (width < parseInt(breakpoints.lg)) return "md";
    if (width < parseInt(breakpoints.xl)) return "lg";
    if (width < parseInt(breakpoints["2xl"])) return "xl";
    return "2xl";
  };

  useEffect(() => {
    const handleResize = () => {
      setBreakpoint(getBreakpoint(window.innerWidth));
    };

    // Set initial breakpoint
    handleResize();

    // Add event listener for resize
    window.addEventListener("resize", handleResize);

    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return breakpoint;
};

export default useBreakpoints;
