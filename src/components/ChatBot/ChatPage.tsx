import { useRef, useEffect } from "react";
import { MessageSquare } from "lucide-react";
import ChatInput from "./ChatInput";
import ChatMessage from "./ChatMessage";
import { useChatStore } from "../../../context/store";
import { motion } from "framer-motion";

export default function ChatPage() {
  const { messages, isTyping, sendMessage } = useChatStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  return (
    <div className="w-full md:max-w-5xl mx-auto md:h-[calc(100vh-6rem)] h-[calc(100vh-8rem)] flex flex-col bg-base-50/50 backdrop-blur-sm rounded-2xl md:shadow-md md:border border-border-light overflow-hidden md:mt-0 -mt-5">
      <div className="bg-base-100/90 backdrop-blur-md p-4 md:flex items-center gap-4 border-b border-border-light z-10 shadow-sm hidden">
        <div className="p-2.5 bg-brand-primary/10 rounded-xl">
          <MessageSquare className="w-6 h-6 text-brand-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-content-100">Chat With AI</h1>
        </div>
      </div>

      <div className="flex-1  overflow-y-auto w-full px-4 md:p-8 space-y-6 scroll-smooth custom-scrollbar">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}

        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-4 p-4 rounded-2xl bg-base-100/80 border border-border-light w-fit shadow-sm"
          >
            <div className="w-10 h-10 rounded-full bg-brand-primary text-white flex items-center justify-center shadow-sm">
              <BotIcon />
            </div>
            <div className="flex items-center gap-1.5 px-2">
              <motion.span
                className="w-2 h-2 bg-content-300 rounded-full"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
              />
              <motion.span
                className="w-2 h-2 bg-content-300 rounded-full"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
              />
              <motion.span
                className="w-2 h-2 bg-content-300 rounded-full"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
              />
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="md:p-4 md:bg-base-100/90 backdrop-blur-md md:border-t md:border-border-light">
        <ChatInput onSend={sendMessage} disabled={isTyping} />
      </div>
    </div>
  );
}

function BotIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 8V4H8" />
      <rect width="16" height="12" x="4" y="8" rx="2" />
      <path d="M2 14h2" />
      <path d="M20 14h2" />
      <path d="M15 13v2" />
      <path d="M9 13v2" />
    </svg>
  );
}
