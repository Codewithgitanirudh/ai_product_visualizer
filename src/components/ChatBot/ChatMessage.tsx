import { ChatMessage as ChatMessageType } from "../../../types";
import { Bot, User } from "lucide-react";
import { motion } from "framer-motion";

interface ChatMessageProps {
  message: ChatMessageType;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isAi = message.role === "assistant";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-4 ${isAi ? "flex-row" : "flex-row-reverse"}`}
    >
      <div
        className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${
          isAi ? "bg-brand-primary text-white" : "bg-content-200 text-base-100"
        }`}
      >
        {isAi ? <Bot className="w-6 h-6" /> : <User className="w-6 h-6" />}
      </div>

      <div
        className={`flex flex-col max-w-[80%] ${
          isAi ? "items-start" : "items-end"
        }`}
      >
        <div className="flex items-center gap-2 mb-1 px-1">
          <span className="text-xs font-medium text-content-300">
            {isAi ? "Omnexia AI" : "You"}
          </span>
          <span className="text-[10px] text-content-400">
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>

        <div
          className={`p-4 shadow-sm backdrop-blur-sm transition-all hover:shadow-md ${
            isAi
              ? "bg-base-100/80 border border-border-light rounded-2xl rounded-tl-sm text-content-100"
              : "bg-brand-primary text-white rounded-2xl rounded-tr-sm"
          }`}
        >
          {message.content[0].image_url && (
            <div className="mb-3">
              <img
                src={message.content[0].image_url}
                alt="Uploaded content"
                className="max-w-full rounded-lg shadow-sm"
              />
            </div>
          )}

          <div
            className={`leading-relaxed whitespace-pre-wrap ${
              isAi ? "text-content-100" : "text-white/95"
            }`}
          >
            {message.content[0].text}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
