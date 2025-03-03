"use client";

import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { CiCircleRemove } from "react-icons/ci";

interface ISetting {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  image?: boolean;
}

const CustomModal: React.FC<ISetting> = ({
  children,
  isOpen,
  onClose,
  image,
}) => {
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  return (
    <>
      {isOpen && (
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
                <motion.div
                  ref={modalRef}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className={clsx(
                    `w-full bg-gray-200 relative rounded-md p-4 shadow-md dark:bg-gray-600 sm:w-[380px] md:w-[540px]`,
                    image && "sm:w-full md:w-[650px] rounded-full bg-sky-200"
                  )}
                >
                  <div
                    onClick={onClose}
                    className={clsx(
                      `absolute -right-2 -top-2  rounded-full h-12 w-12 hover:bg-gray-100 dark:bg-gray-500 p-1 flex items-center justify-center`,
                      image &&
                        "right-0 top-0 z-[999] bg-sky-300 text-black hover:bg-sky-500"
                    )}
                  >
                    <CiCircleRemove className="hover:scale-105 text-[32px] w-full h-full" />
                  </div>

                  {children}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </>
  );
};

export default CustomModal;
