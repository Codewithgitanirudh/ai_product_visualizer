import React, { useState, useRef, useEffect } from "react";
import { Send, Image as ImageIcon, Mic, MicOff, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ChatInputProps {
  onSend: (text: string, image?: File) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [text, setText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (selectedImage) {
      const url = URL.createObjectURL(selectedImage);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [selectedImage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((!text.trim() && !selectedImage) || disabled) return;

    onSend(text, selectedImage || undefined);
    setText("");
    setSelectedImage(null);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const toggleVoiceInput = () => {
    if (isListening) {
      setIsListening(false);
    } else {
      setIsListening(true);
      setTimeout(() => {
        setText((prev) => prev + " Hello, this is a voice message.");
        setIsListening(false);
      }, 2000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative max-w-4xl mx-auto w-full">
      <AnimatePresence>
        {previewUrl && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute bottom-full left-0 mb-4 p-2 bg-base-100/80 backdrop-blur-md rounded-2xl shadow-xl border border-border-light"
          >
            <div className="relative group">
              <img
                src={previewUrl}
                alt="Preview"
                className="h-24 w-auto rounded-xl object-cover"
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                type="button"
                onClick={() => setSelectedImage(null)}
                className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors"
              >
                <X className="w-3 h-3" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-2 bg-base-100/80 backdrop-blur-xl p-2 rounded-4xl border border-border-medium/50 transition-all duration-300 focus-within:border-brand-primary/30 focus-within:ring-4 focus-within:ring-brand-primary/5">
        <motion.button
          whileHover={{ scale: 1.05, backgroundColor: "var(--base-200)" }}
          whileTap={{ scale: 0.95 }}
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="md:p-3 p-2 text-content-300 hover:text-brand-primary rounded-full transition-colors cursor-pointer"
          title="Upload Image"
          disabled={disabled}
        >
          <ImageIcon className="w-5 h-5" />
        </motion.button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageSelect}
          accept="image/*"
          className="hidden"
        />

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="button"
          onClick={toggleVoiceInput}
          className={`md:p-3 p-2 rounded-full transition-all duration-300 ${
            isListening
              ? "text-red-500 bg-red-50 shadow-inner"
              : "text-content-300 hover:text-brand-primary hover:bg-base-200 cursor-pointer"
          }`}
          title="Voice Input"
          disabled={disabled}
        >
          {isListening ? (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <MicOff className="w-5 h-5" />
            </motion.div>
          ) : (
            <Mic className="w-5 h-5" />
          )}
        </motion.button>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={isListening ? "Listening..." : "Type a message..."}
          className="flex-1 max-h-32 min-h-[48px] py-3 px-2 bg-transparent border-none text-content-100 placeholder:text-content-300 focus:outline-none resize-none text-[15px] leading-relaxed"
          rows={1}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          disabled={disabled}
        />

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={(!text.trim() && !selectedImage) || disabled}
          className="p-3 bg-brand-primary text-white rounded-full hover:bg-brand-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg cursor-pointer m-1"
        >
          <Send className="w-5 h-5 ml-0.5" />
        </motion.button>
      </div>
    </form>
  );
}
