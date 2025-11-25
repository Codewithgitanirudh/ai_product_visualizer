import React, { useRef } from 'react';
import { UploadIcon } from 'lucide-react';
import { OriginalImage } from '@/types';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  originalImage: OriginalImage | null;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, originalImage }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onImageUpload(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-base-400 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-linear-to-br from-brand-primary to-brand-secondary flex items-center justify-center">
          <span className="text-white font-bold text-sm">1</span>
        </div>
        <h3 className="font-semibold text-content-100 text-lg">Upload Product Image</h3>
      </div>
      {originalImage ? (
        <div className="space-y-4">
          <div className="aspect-square w-full rounded-xl overflow-hidden border-2 border-base-400 shadow-inner bg-base-300">
            <img 
              src={URL.createObjectURL(originalImage.file)} 
              alt="Original product" 
              className="w-full h-full object-contain"
            />
          </div>
          <button
            onClick={triggerFileInput}
            className="w-full bg-base-300 hover:bg-base-400 text-content-100 font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md border border-base-400"
          >
            Change Image
          </button>
        </div>
      ) : (
        <div
          onClick={triggerFileInput}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="aspect-square w-full border-2 border-dashed border-base-400 rounded-xl flex flex-col items-center justify-center text-center p-8 cursor-pointer hover:border-brand-primary hover:bg-base-200 transition-all duration-200 bg-base-300 group"
        >
          <div className="mb-4 p-4 flex items-center justify-center rounded-full bg-linear-to-br from-brand-primary/10 to-brand-secondary/10 group-hover:from-brand-primary/20 group-hover:to-brand-secondary/20 transition-all duration-200">
            <UploadIcon className="h-10 w-10 text-brand-primary" />
          </div>
          <p className="text-content-200 font-medium mb-1">
            <span className="font-semibold text-brand-primary">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-content-300">PNG, JPG, WEBP up to 10MB</p>
        </div>
      )}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/jpeg, image/webp"
      />
    </div>
  );
};
