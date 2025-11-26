export async function openRouterChat({
  messages,
}: {
  messages: any[];
}) {
  // Call your backend (which forwards to OpenRouter)
  const response = await fetch(
    `${import.meta.env.VITE_APP_URL}/api/generate-chat`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages,
        reasoning: { enabled: true }, // optional
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      `OpenRouter API error: ${response.status} ${response.statusText}`
    );
  }

  const result = await response.json();

  // Extract assistant + reasoning
  const choice = result.choices?.[0];
  if (!choice) throw new Error("No choice returned from OpenRouter");

  const assistantMessage = choice.message;
  const reasoningDetails =
    choice.reasoning_details ?? assistantMessage?.reasoning_details ?? null;

  // Return everything you need
  return {
    assistantMessage,
    reasoningDetails,
    raw: result,
  };
}
