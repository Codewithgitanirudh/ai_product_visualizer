import React from 'react';

interface EditPanelProps {
  prompt: string;
  onPromptChange: (value: string) => void;
  onSubmit: () => void;
  isEditing: boolean;
}

export const EditPanel: React.FC<EditPanelProps> = ({ prompt, onPromptChange, onSubmit, isEditing }) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-base-400 shadow-sm hover:shadow-md transition-shadow duration-200 animate-fadeIn">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-linear-to-br from-brand-secondary to-brand-accent flex items-center justify-center">
          <span className="text-white font-bold text-sm">2</span>
        </div>
        <h3 className="font-semibold text-content-100 text-lg">Edit Selected Image</h3>
      </div>
      <p className="text-sm text-content-200 mb-4 leading-relaxed">
        Describe the change you want to make. For example: "add a retro filter" or "make the background a solid blue color".
      </p>
      <textarea
        value={prompt}
        onChange={(e) => onPromptChange(e.target.value)}
        placeholder="e.g., Add a cat sitting next to the mug"
        rows={4}
        className="w-full p-3 rounded-lg bg-base-200 border-2 border-base-400 focus:border-brand-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all duration-200 text-content-100 placeholder:text-content-300 resize-none"
      />
      <button
        onClick={onSubmit}
        disabled={isEditing || !prompt}
        className="w-full mt-4 bg-linear-to-r from-brand-primary to-brand-secondary hover:from-brand-secondary hover:to-brand-accent text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 disabled:from-base-400 disabled:to-base-400 disabled:cursor-not-allowed disabled:opacity-60 flex items-center justify-center shadow-md hover:shadow-lg disabled:shadow-sm"
      >
        {isEditing ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Applying changes...
          </>
        ) : (
          "Apply Edit"
        )}
      </button>
    </div>
  );
};
