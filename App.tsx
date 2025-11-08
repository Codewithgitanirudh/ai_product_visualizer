
import React, { useState, useCallback } from 'react';
import { generateVisualizations, editImage } from './src/services/geminiService';
import type { GeneratedImage, OriginalImage } from './types';
import { fileToBase64 } from './utils/fileUtils';
import { Header } from './src/components/Header';
import { ImageUploader } from './src/components/ImageUploader';
import { GeneratedImageGrid } from './src/components/GeneratedImageGrid';
import { EditPanel } from './src/components/EditPanel';
const imgSrc1 = "https://images.pexels.com/photos/1315655/pexels-photo-1315655.jpeg?auto=compress&cs=tinysrgb&";
const imgSrc2 = "https://images.pexels.com/photos/1315655/pexels-photo-1315655.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<OriginalImage | null>(null);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([ { id: imgSrc1, src: imgSrc1, isEditing: false, mimeType: 'image/jpeg' }, { id: imgSrc2, src: imgSrc2, isEditing: false, mimeType: 'image/jpeg' } ]);
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
    <div className="min-h-screen bg-base-100 flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <aside className="lg:col-span-4 xl:col-span-3 space-y-6">
            <h2 className="text-xl font-bold text-content-100 border-b border-base-300 pb-2">Controls</h2>
            <ImageUploader onImageUpload={handleImageUpload} originalImage={originalImage} />
            
            {originalImage && (
              <button
                onClick={handleGenerateVisualizations}
                disabled={isGenerating}
                className="w-full bg-brand-primary hover:bg-brand-secondary text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 disabled:bg-base-300 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isGenerating ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </>
                ) : "Generate Visualizations"}
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

export default App;
