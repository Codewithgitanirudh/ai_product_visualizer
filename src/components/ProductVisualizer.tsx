import React, { useState, useCallback } from 'react';
import { generateVisualizations, editImage } from '../services/geminiService';
import type { GeneratedImage, OriginalImage } from '../../types';
import { fileToBase64 } from '../../utils/fileUtils';
import { ImageUploader } from './ImageUploader';
import { GeneratedImageGrid } from './GeneratedImageGrid';
import { EditPanel } from './EditPanel';
import { ButtonLoader } from './Loader';

export const ProductVisualizer: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<OriginalImage | null>(null);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [editPrompt, setEditPrompt] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);

  const handleImageUpload = useCallback(async (file: File) => {
    setError(null);
    setGeneratedImages([]);
    setSelectedImageId(null);
    try {
      const { base64, mimeType } = await fileToBase64(file);
      setOriginalImage({ file, base64, mimeType });
    } catch (err) {
      setError('Failed to read image file. Please try another one.');
      setOriginalImage(null);
    }
  }, []);

  const handleGenerateVisualizations = useCallback(async () => {
    if (!originalImage) return;

    setIsGenerating(true);
    setError(null);
    setGeneratedImages([]);
    setSelectedImageId(null);

    try {
      const results = await generateVisualizations(originalImage);
      const newImages: GeneratedImage[] = results.map((src, index) => ({
        id: `gen-${index}-${Date.now()}`,
        src,
        isEditing: false,
        mimeType: 'image/png', // Gemini Flash Image generates PNGs
      }));
      setGeneratedImages(newImages);
    } catch (err) {
      console.error(err);
      setError('Failed to generate visualizations. Please check your API key and try again.');
    } finally {
      setIsGenerating(false);
    }
  }, [originalImage]);

  const handleEditImage = useCallback(async () => {
    if (!editPrompt || !selectedImageId) return;

    const imageToEdit = generatedImages.find(img => img.id === selectedImageId);
    if (!imageToEdit) return;
    
    setError(null);

    setGeneratedImages(prev => prev.map(img => img.id === selectedImageId ? { ...img, isEditing: true } : img));

    try {
      const editedSrc = await editImage({ base64: imageToEdit.src, mimeType: imageToEdit.mimeType }, editPrompt);
      setGeneratedImages(prev => prev.map(img => 
        img.id === selectedImageId ? { ...img, src: editedSrc, isEditing: false } : img
      ));
      setEditPrompt('');
    } catch (err) {
      console.error(err);
      setError('Failed to edit the image. Please try again.');
       setGeneratedImages(prev => prev.map(img => img.id === selectedImageId ? { ...img, isEditing: false } : img));
    }
  }, [editPrompt, selectedImageId, generatedImages]);

  const selectedImage = generatedImages.find(img => img.id === selectedImageId);
  const isEditing = selectedImage?.isEditing || false;
  
  return (
    <div className="min-h-screen bg-base-200 flex flex-col animate-fadeIn">
      <main className="container mx-auto flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          <aside className="lg:col-span-4 xl:col-span-3 space-y-6">
            <div className="bg-white p-5 rounded-xl border border-base-400 shadow-sm">
              <h2 className="text-xl font-bold text-content-100">Controls</h2>
              <p className="text-sm text-content-300 mt-1">Upload and generate AI visualizations</p>
            </div>
            <ImageUploader onImageUpload={handleImageUpload} originalImage={originalImage} />
            
            {originalImage && (
              <button
                onClick={handleGenerateVisualizations}
                disabled={isGenerating}
                className="w-full bg-linear-to-r from-brand-primary to-brand-secondary hover:from-brand-secondary hover:to-brand-accent text-white font-semibold py-3.5 px-4 rounded-xl transition-all duration-300 disabled:from-base-400 disabled:to-base-400 disabled:cursor-not-allowed disabled:opacity-60 flex items-center justify-center shadow-md hover:shadow-lg disabled:shadow-sm"
              >
                {isGenerating ? (
                  <>
                    <ButtonLoader className="-ml-1 mr-3" />
                    Generating...
                  </>
                ) : generatedImages.length > 0 ? "Re-generate Visualizations" : "Generate Visualizations"}
              </button>
            )}

            {selectedImageId && (
              <EditPanel
                prompt={editPrompt}
                onPromptChange={setEditPrompt}
                onSubmit={handleEditImage}
                isEditing={isEditing}
              />
            )}
          </aside>
          
          <div className="lg:col-span-8 xl:col-span-9">
             <GeneratedImageGrid
                isLoading={isGenerating}
                error={error}
                images={generatedImages}
                selectedImageId={selectedImageId}
                onImageSelect={setSelectedImageId}
              />
          </div>
        </div>
      </main>
    </div>
  );
};

