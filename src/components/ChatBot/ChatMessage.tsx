import { ChatMessage as ChatMessageType } from "../../../types";
import { Bot, User, Copy, Check } from "lucide-react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useState } from "react";

interface ChatMessageProps {
  message: ChatMessageType;
}

const CodeBlock = ({
  language,
  children,
}: {
  language: string;
  children: string;
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-md overflow-hidden my-2 border border-border-light/20">
      <div className="flex items-center justify-between px-4 py-2 bg-[#1e1e1e] border-b border-border-light/10">
        <span className="text-xs text-content-400 font-mono lowercase">
          {language}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-content-400 hover:text-white transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy code</span>
            </>
          )}
        </button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        customStyle={{ margin: 0, borderRadius: 0, fontSize: "13px" }}
        showLineNumbers={true}
        wrapLines={true}
      >
        {children}
      </SyntaxHighlighter>
    </div>
  );
};

export default function ChatMessage({ message }: ChatMessageProps) {
  const isAi = message.role === "assistant";
  const imageBlock = message.content.find((c) => c.type === "input_image");

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
              ? "bg-base-100/80 border border-border-light rounded-2xl rounded-tl-sm text-content-100 w-full"
              : "bg-brand-primary text-white rounded-2xl rounded-tr-sm"
          }`}
        >
          {imageBlock && (
            <div className="mb-3">
              <img
                src={imageBlock.image_url}
                alt="Uploaded content"
                className="max-w-[200px] rounded-lg shadow-sm"
              />
            </div>
          )}

          <div
            className={`leading-relaxed ${
              isAi ? "text-content-100" : "text-white/95"
            }`}
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, inline, className, children, ...props }: any) {
                  const match = /language-(\w+)/.exec(className || "");
                  return !inline && match ? (
                    <CodeBlock language={match[1]}>
                      {String(children).replace(/\n$/, "")}
                    </CodeBlock>
                  ) : (
                    <code
                      className={`${className} ${
                        isAi
                          ? "bg-content-200/50 text-brand-primary px-1.5 py-0.5 rounded text-sm font-mono"
                          : "bg-white/20 text-white px-1.5 py-0.5 rounded text-sm font-mono"
                      }`}
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
                ul: ({ children }) => (
                  <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal pl-4 mb-2 space-y-1">
                    {children}
                  </ol>
                ),
                li: ({ children }) => <li className="mb-0.5">{children}</li>,
                p: ({ children }) => (
                  <p className="mb-2 last:mb-0">{children}</p>
                ),
                a: ({ href, children }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-primary hover:underline"
                  >
                    {children}
                  </a>
                ),
              }}
            >
              {message.content[0].text}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
