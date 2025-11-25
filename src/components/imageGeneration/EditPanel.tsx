import { ButtonLoader } from '../Loader';

interface EditPanelProps {
  prompt: string;
  onPromptChange: (value: string) => void;
  onSubmit: () => void;
  isEditing: boolean;
}

export default function EditPanel({ prompt, onPromptChange, onSubmit, isEditing }: EditPanelProps) {
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
            <ButtonLoader className="-ml-1 mr-3" />
            Applying changes...
          </>
        ) : (
          "Apply Edit"
        )}
      </button>
    </div>
  );
};
