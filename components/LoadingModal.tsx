"use client";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import { ClipLoader } from "react-spinners";

const LoadingModal = () => {
  console.log("loading");
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed inset-0 z-[48] bg-black bg-opacity-70"
      >
        <div className="flex relative w-full h-full justify-center items-center">
          <AnimatePresence>
            {" "}
            <ClipLoader color="#fff" />
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LoadingModal;
