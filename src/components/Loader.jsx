import React from "react";

const Loader = ({ loader }) => {
  if (!loader.isLoading) return null;

  return (
    <>
      <div
        style={{ zIndex: 9999 }}
        class="fixed inset-0 flex flex-col space-x-2 justify-center items-center bg-white h-screen"
      >
        <span class="sr-only">Loading...</span>
        <div className="flex space-x-2">
          <div class="h-6 w-6 bg-theme-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div class="h-6 w-6 bg-theme-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div class="h-6 w-6 bg-theme-primary rounded-full animate-bounce"></div>
        </div>
        <div className="mt-2">
          <span class="text-sm text-theme-primary">{loader.message}</span>
        </div>
      </div>
    </>
  );
};

export default Loader;
