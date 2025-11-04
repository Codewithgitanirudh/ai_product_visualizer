
import React from 'react';
import type { GeneratedImage } from '../../types';

interface GeneratedImageGridProps {
  isLoading: boolean;
  error: string | null;
  images: GeneratedImage[];
  selectedImageId: string | null;
  onImageSelect: (id: string) => void;
}

const ImageCard: React.FC<{ image: GeneratedImage; isSelected: boolean; onSelect: (id: string) => void; }> = ({ image, isSelected, onSelect }) => {
  const selectionClass = isSelected ? 'ring-4 ring-brand-primary' : 'ring-2 ring-transparent hover:ring-brand-secondary';
  
  // Use URL directly if it starts with http, otherwise treat as base64
  const imageSrc = image.src.startsWith('http') 
    ? image.src 
    : `data:${image.mimeType};base64,${image.src}`;
  
  return (
    <div 
        key={image.id}
        className="relative aspect-square bg-base-200 rounded-lg overflow-hidden cursor-pointer group"
        onClick={() => onSelect(image.id)}
    >
      <img 
        src={imageSrc}
        alt="Generated visualization"
        className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-105 ${selectionClass}`}
      />
      {image.isEditing && (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
            <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        </div>
      )}
       <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
         <p className="text-white text-sm font-semibold">Select to Edit</p>
       </div>
    </div>
  );
};


export const GeneratedImageGrid: React.FC<GeneratedImageGridProps> = ({ isLoading, error, images, selectedImageId, onImageSelect }) => {
  return (
    <div className="bg-base-200 p-4 rounded-lg min-h-[300px] flex flex-col">
        <h2 className="text-xl font-bold text-content-100 border-b border-base-300 pb-2 mb-4">Results</h2>
        {isLoading && (
            <div className="flex-grow flex flex-col items-center justify-center text-center">
                <svg className="animate-spin h-10 w-10 text-brand-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="mt-4 text-lg font-semibold">Generating marketing magic...</p>
                <p className="text-content-200">This may take a moment.</p>
            </div>
        )}
        {error && !isLoading && (
            <div className="flex-grow flex items-center justify-center text-center bg-red-900/20 border border-red-500/50 text-red-300 p-4 rounded-lg">
                <p>{error}</p>
            </div>
        )}
        {!isLoading && !error && images.length === 0 && (
            <div className="flex-grow flex flex-col items-center justify-center text-center text-content-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-base-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="mt-4 text-lg">Your generated images will appear here.</p>
                <p className="text-sm">Upload a product and click "Generate Visualizations" to start.</p>
            </div>
        )}
        {!isLoading && images.length > 0 && (
             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {images.map(image => (
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
