// import React from "react";
// import muguLogo from "../assets/icons/muguLoaderLogo.svg";

// const Loader = ({ loader }) => {
//   if (!loader.isLoading) return null;

//   return (
//     <>
//       <div
//         style={{ zIndex: 9999 }}
//         className="fixed inset-0 flex flex-col space-x-2 justify-center items-center bg-white h-screen"
//       >
//         <span className="sr-only">Loading...</span>
//         <div className="animate-fade-in-out">
//           <img src={muguLogo} alt="Mugu Logo" className="w-24 h-24" />
//         </div>
//         <div className="mt-2 animate-fade-in-out">
//           <span class="ps-1 text-lg font-medium text-theme-primary">
//             {loader.message}
//           </span>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Loader;

import React, { useEffect, useState } from "react";
import muguLogo from "../assets/icons/muguLoaderLogo.svg";

const Loader = ({ loader }) => {
  const [dots, setDots] = useState(""); // State to manage dots

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => {
        // Cycle through dots: "", ".", "..", "..."
        if (prev.length < 3) {
          return prev + ".";
        }
        return ""; // Reset to empty string after three dots
      });
    }, 800); // Adjust timing here (500 ms)

    return () => clearInterval(interval); // Clean up interval on unmount
  }, []);

  if (!loader.isLoading) return null;

  return (
    <div
      style={{ zIndex: 9999 }}
      className="fixed inset-0 flex flex-col justify-center items-center bg-white h-screen"
    >
      <span className="sr-only">Loading...</span>
      <div className="animate-fade-in-out">
        <img src={muguLogo} alt="Mugu Logo" className="w-24 h-24" />
      </div>
      <div className="mt-2 animate-fade-in-out">
        <span className="ps-4 text-lg font-medium text-theme-primary">
          {loader.message.replace(/\.{2,}/g, "")}
          <span style={{ width: "1.5rem", display: "inline-block" }}>
            {dots} {/* Display the loading dots */}
          </span>
        </span>
      </div>
    </div>
  );
};

export default Loader;
