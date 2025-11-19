import type { GeneratedImage } from "../../types";
import { DownloadIcon, SquarePenIcon, X, XIcon } from "lucide-react";
import { Tooltip } from "@mui/material";
import React, { useState } from "react";

interface GeneratedImageGridProps {
  isLoading: boolean;
  error: string | null;
  images: GeneratedImage[];
  selectedImageId: string | null;
  onImageSelect: (id: string) => void;
}

const ImageCard: React.FC<{
  image: GeneratedImage;
  isSelected: boolean;
  onSelect: (id: string) => void;
}> = ({ image, isSelected, onSelect }) => {
  const selectionClass = isSelected
    ? "ring-4 ring-brand-primary ring-offset-2 ring-offset-white"
    : "ring-2 ring-transparent hover:ring-brand-secondary/50";

  const handleDownload = async () => {
    try {
      const response = await fetch(image.src, { mode: "cors" });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${image.id.split("-")[1]}.${
        image.mimeType.split("/")[1]
      }`;
      link.click();

      // free memory
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download image:", error);
    }
  };

  return (
    <>
      <div
        key={image.id}
        className="relative aspect-square bg-white rounded-xl overflow-hidden group border-2 border-base-400 shadow-sm hover:shadow-lg transition-all duration-300"
      >
        <ImageViewer image={image} selectionClass={selectionClass} />
        {image.isEditing && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-10">
            <div className="text-center">
              <svg
                className="animate-spin h-10 w-10 text-brand-primary mx-auto mb-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <p className="text-sm font-medium text-content-200">Editing...</p>
            </div>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 w-full justify-end items-center gap-2 p-3 bg-linear-to-t from-black/60 via-black/40 to-transparent flex opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Tooltip title="Edit" placement="top">
            <button
              onClick={() => onSelect(image.id)}
              className="text-white p-2 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-sm cursor-pointer transition-all duration-200"
            >
              <SquarePenIcon className="w-5 h-5" />
            </button>
          </Tooltip>
          <Tooltip title="Download" placement="top">
            <button
              onClick={handleDownload}
              className="text-white p-2 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-sm cursor-pointer transition-all duration-200"
            >
              <DownloadIcon className="w-5 h-5" />
            </button>
          </Tooltip>
        </div>
      </div>
    </>
  );
};

export const GeneratedImageGrid: React.FC<GeneratedImageGridProps> = ({
  isLoading,
  error,
  images,
  selectedImageId,
  onImageSelect,
}) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-base-400 shadow-sm min-h-[300px] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-content-100">
          Generated Results
        </h2>
        {images.length > 0 && (
          <span className="text-sm text-content-300 font-medium bg-base-200 px-3 py-1 rounded-full">
            {images.length} {images.length === 1 ? 'image' : 'images'}
          </span>
        )}
      </div>
      {isLoading && (
        <div className="flex flex-col items-center justify-center text-center py-12">
          <div className="relative">
            <svg
              className="animate-spin h-12 w-12 text-brand-primary"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
          <p className="mt-6 text-lg font-semibold text-content-100">
            Generating marketing magic...
          </p>
          <p className="text-content-300 mt-2">This may take a moment.</p>
        </div>
      )}
      {error && !isLoading && (
        <div className="flex items-center justify-center text-center bg-red-50 border-2 border-red-200 text-red-700 p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="font-medium">{error}</p>
          </div>
        </div>
      )}
      {!isLoading && !error && images.length === 0 && (
        <div className="flex flex-col items-center justify-center text-center py-12 px-4">
          <div className="p-6 rounded-full bg-linear-to-br from-base-200 to-base-300 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-content-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <p className="mt-4 text-lg font-semibold text-content-100">
            Your generated images will appear here
          </p>
          <p className="text-sm text-content-300 mt-2 max-w-md">
            Upload a product image and click "Generate Visualizations" to start creating AI-powered marketing visuals.
          </p>
        </div>
      )}
      {!isLoading && images.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {images.map((image) => (
            <ImageCard
              key={image.id}
              image={image}
              isSelected={selectedImageId === image.id}
              onSelect={onImageSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const ImageViewer = ({ image, selectionClass }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <img
        src={image.src}
        alt="thumbnail"
        onClick={() => setOpen(true)}
        className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-[1.02] cursor-pointer bg-base-300 ${selectionClass}`}
      />

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative max-h-[90vh] max-w-[90vw] overflow-auto bg-white rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/90 hover:bg-white text-content-100 shadow-lg hover:shadow-xl transition-all cursor-pointer z-10"
            >
              <XIcon className="w-5 h-5" />
            </button>

            <img
              src={image.src}
              alt="full view"
              className="object-contain h-full w-full rounded-xl select-none"
            />
          </div>
        </div>
      )}
    </>
  );
};
