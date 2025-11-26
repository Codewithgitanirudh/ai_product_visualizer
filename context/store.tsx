import { create } from "zustand";
import { ChatMessage, ChatRole, Content } from "../types";
import { openRouterChat } from "../src/services/openRouter";
import { fileToBase64 } from "../utils/fileUtils";

interface ChatState {
  messages: ChatMessage[];
  isTyping: boolean;
  addMessage: (message: ChatMessage) => void;
  setTyping: (isTyping: boolean) => void;
  sendMessage: (text: string, image?: File) => Promise<void>;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [
    {
      id: "1",
      role: "assistant",
      content: [
        {
          type: "text",
          text: "Hello! I'm your AI assistant. I can help you visualize products, answer questions, or just chat. You can also upload images or use voice input!",
        },
      ],
      timestamp: Date.now(),
    },
  ],
  isTyping: false,

  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),

  setTyping: (isTyping) => set({ isTyping }),

  sendMessage: async (text: string, image?: File) => {
    const addMessage = get().addMessage;
    const setTyping = get().setTyping;

    // Build user message
    const userMessage: ChatMessage = {
      id: (Date.now() + Math.random()).toString(),
      role: "user",
      content: [
        {
          type: "text",
          text,
        } as Content,
      ],
      timestamp: Date.now(),
    };

    // If there is an image, convert it to data URL and push as additional content block
    if (image) {
      try {
        const { base64, mimeType } = await fileToBase64(image);
        userMessage.content.push({
          type: "input_image",
          image_url: `data:${mimeType};base64,${base64}`,
        } as unknown as Content);
      } catch (err) {
        console.error("Failed to convert image:", err);
        // still continue without image
      }
    }

    // Optimistically add the user message to UI
    addMessage(userMessage);

    // Ask the model and add assistant reply
    setTyping(true);
    try {
      // Prepare api-friendly messages: we only send role + content
      const apiMessages = get().messages.map(({ role, content }) => ({
        role,
        content,
      }));

      // call your openRouter wrapper
      const { assistantMessage, reasoningDetails } = await openRouterChat({
        messages: apiMessages,
      });

      if (assistantMessage) {
        // assistantMessage may have different shapes:
        // - assistantMessage.content could be an array of content blocks (preferred)
        // - or it could be a plain string (older/other formats)
        let assistantContent: Content[];

        if (Array.isArray(assistantMessage.content)) {
          assistantContent = assistantMessage.content as Content[];
        } else if (typeof assistantMessage.content === "string") {
          assistantContent = [{ type: "text", text: assistantMessage.content }];
        } else {
          // Fallback: try to stringify
          assistantContent = [
            { type: "text", text: String(assistantMessage.content) },
          ];
        }

        // attach reasoning_details to the assistant message if available
        const assistantChatMessage: ChatMessage = {
          id: (Date.now() + Math.random()).toString(),
          role: "assistant",
          content: assistantContent,
          timestamp: Date.now(),
          // @ts-expect-error optional field - add if your ChatMessage supports metadata
          reasoning_details: reasoningDetails ?? undefined,
        };

        addMessage(assistantChatMessage);
      }
    } catch (err) {
      console.error("Error calling AI:", err);
      // Optionally add an error message to the chat
      addMessage({
        id: (Date.now() + Math.random()).toString(),
        role: "assistant",
        content: [
          { type: "text", text: "Sorry — I couldn't reach the AI service." },
        ],
        timestamp: Date.now(),
      });
    } finally {
      setTyping(false);
    }
  },
}));
