import { create } from "zustand";
import { ChatMessage, ChatRole } from "../types";
import { openRouterChat } from "../src/services/openRouter";

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
    const { messages, addMessage, setTyping } = get();

    const newMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: "user",
      content: [
        {
          type: "text",
          text,
        },
      ],
      timestamp: Date.now(),
    };

    // Optimistically add user message
    // We need to handle the image async conversion if present,
    // but for the store logic, we can do it inside here.

    if (image) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        newMessage.content.push({
          type: "input_image",
          image_url: reader.result as string,
        });

        // Add message with image
        addMessage(newMessage);

        // Trigger AI response
        await handleAIResponse();
      };
      reader.readAsDataURL(image);
    } else {
      addMessage(newMessage);
      await handleAIResponse();
    }

    async function handleAIResponse() {
      setTyping(true);
      try {
        // Get latest messages from state after the update
        const currentMessages = get().messages;

        const apiMessages = currentMessages.map(({ role, content }) => ({
          role,
          content,
        }));

        const response = await openRouterChat({ messages: apiMessages });

        if (response.choices && response.choices[0]) {
          const aiMessage: ChatMessage = {
            id: (Date.now() + 2).toString(),
            role: "assistant",
            content: [
              {
                type: "text",
                text: response.choices[0].message.content,
              },
            ],
            timestamp: Date.now(),
          };
          addMessage(aiMessage);
        }
      } catch (error) {
        console.error("Error calling AI:", error);
        // Optionally add an error message to the chat
      } finally {
        setTyping(false);
      }
    }
  },
}));
