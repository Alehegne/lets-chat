"use client";

import React, { useEffect, useRef, useState } from "react";
import CustomModal from "./CustomDialog";
import Image from "next/image";
import Button from "./shared/Button";
import { motion } from "framer-motion";

interface IImage {
  isOpen: boolean;
  onClose: () => void;
  image?: string;
}

const ImageModal: React.FC<IImage> = ({ isOpen, onClose, image }) => {
  const [scale, setScale] = useState(1);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const handleDownload = async () => {
    try {
      if (image) {
        const currentImage = await fetch(image);
        const blob = await currentImage.blob();
        const type = blob.type; //"image/png"
        const extension = type.split("/")[1];
        const blobUrl = window.URL.createObjectURL(blob);
        //create anchor tag
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = `download-image.${extension}`;
        document.body.appendChild(link);
        link.click();

        //remove anchor
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl); // releases an existing object URL which was previously created by calling URL.createObjectURL().
      }
    } catch (error) {
      console.log("failed to save image", error);
    }
  };
  const handleWheel = (event: WheelEvent) => {
    if (!imageContainerRef.current?.contains(event.target as Node)) return;
    event.preventDefault();
    setScale((prev) => {
      const newScale = prev + (event.deltaY > 0 ? -0.01 : 0.01);
      return Math.min(Math.max(newScale, 1), 4);
    });
  };

  useEffect(() => {
    document.addEventListener("wheel", handleWheel, { passive: false });
    return () => document.removeEventListener("wheel", handleWheel);
  });

  return (
    <>
      {image && (
        <CustomModal image isOpen={isOpen} onClose={onClose}>
          <div className="flex overflow-hidden items-center flex-col justify-center">
            <div
              ref={imageContainerRef}
              className="relative  group rounded-full h-[500px] w-full md:-[650px] bg-white"
            >
              <Image
                style={{
                  transform: `scale(${scale})`, // Apply zoom effect
                  transition: "transform 0.4s ease-in-out", // Smooth zoom transition
                  cursor: scale > 1 ? "zoom-in" : "zoom-out", // Change cursor depending on zoom level
                }}
                src={image}
                fill
                alt="image"
                className="rounded-xl"
              />
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute bottom-6 right-[47%] hidden group-hover:flex"
              >
                <Button onClick={handleDownload}>Save the image</Button>
              </motion.div>
            </div>
          </div>
        </CustomModal>
      )}
    </>
  );
};

export default ImageModal;
