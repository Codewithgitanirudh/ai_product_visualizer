// export async function openRouterChat({ messages }: { messages: any }) {
//   // First API call with reasoning
//   const initialResponse = await fetch(
//     "https://openrouter.ai/api/v1/chat/completions",
//     {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         model: "x-ai/grok-4.1-fast:free",
//         messages: messages,
//         reasoning: { enabled: true },
//       }),
//     }
//   );

//   if (!initialResponse.ok) {
//     throw new Error(`OpenRouter API error: ${initialResponse.statusText}`);
//   }

//   // Extract the assistant message with reasoning_details and save it
//   const initialResult = await initialResponse.json();
//   const firstAssistantMessage = initialResult.choices[0].message;

//   // Preserve the assistant message with reasoning_details for the next turn
//   const reasoningStack = [
//     {
//       role: "user",
//       content: messages[messages.length - 1].content,
//     },
//     {
//       role: "assistant",
//       content: firstAssistantMessage.content,
//       reasoning_details: firstAssistantMessage.reasoning_details, // Pass back unmodified
//     },
//     {
//       role: "user",
//       content: messages[messages.length - 1].content,
//     },
//   ];

//   // Second API call - model continues reasoning from where it left off
//   const followUpResponse = await fetch(
//     "https://openrouter.ai/api/v1/chat/completions",
//     {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         model: "x-ai/grok-4.1-fast:free",
//         messages: reasoningStack, // Includes preserved reasoning_details
//         reasoning: { enabled: true }, // Re-enable reasoning for the follow-up
//       }),
//     }
//   );

//   if (!followUpResponse.ok) {
//     throw new Error(`OpenRouter API error: ${followUpResponse.statusText}`);
//   }

//   return await followUpResponse.json();
// }

export async function openRouterChat({ messages }: { messages: any[] }) {
  // 1) Initial call with reasoning enabled
  const initialResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "x-ai/grok-4.1-fast:free",
      messages,
      reasoning: { enabled: true },
    }),
  });

  if (!initialResponse.ok) {
    throw new Error(`OpenRouter API error: ${initialResponse.status} ${initialResponse.statusText}`);
  }

  const initialResult = await initialResponse.json();

  // 2) Extract assistant message and reasoning_details correctly
  const choice = initialResult.choices && initialResult.choices[0];
  if (!choice) throw new Error("No choice returned from OpenRouter");

  const assistantMessage = choice.message ?? { role: "assistant", content: "" };
  const reasoningDetails = choice.reasoning_details ?? assistantMessage.reasoning_details ?? null;

  // 3) Persist reasoningDetails somewhere durable (DB / server state) if multi-turn
  // For demo we keep it in-memory variable; in production store it server-side linked to the conversation ID.
  // e.g., await saveReasoning(conversationId, reasoningDetails);

  // 4) Build the next messages array for continuation.
  // Typical pattern: previous messages + assistant (with reasoning_details) + (new) user message
  // Here I assume `messages` already contains the user's latest message.
  const preservedAssistant = {
    role: "assistant" as const,
    content: assistantMessage.content,
    // attach reasoning exactly as returned so model can continue
    reasoning_details: reasoningDetails,
  };

  // Option A: send full history (recommended)
  const continueMessages = [
    ...messages,                // entire prior history (including the user message you just sent)
    preservedAssistant,         // assistant response + reasoning_details
    // optionally you can append a follow-up user message here if you need the model to continue immediately
  ];

  // 5) Make follow-up request, re-enabling reasoning
  const followUpResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "x-ai/grok-4.1-fast:free",
      messages: continueMessages,
      reasoning: { enabled: true },
    }),
  });

  if (!followUpResponse.ok) {
    throw new Error(`OpenRouter API error (follow-up): ${followUpResponse.status} ${followUpResponse.statusText}`);
  }

  return await followUpResponse.json();
}

