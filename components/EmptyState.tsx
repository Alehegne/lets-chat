import React from "react";

const EmptyState = () => {
  return (
    <div className="h-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-50 w-full flex items-center justify-center px-4 py-10 sm:px-6 lg:px-8 ">
      <div className="flex text-center items-center justify-center">
        <h3 className="font-semibold mt-2 text-3xl">
          select a chat or start a new conversation,
        </h3>
      </div>
    </div>
  );
};

export default EmptyState;
