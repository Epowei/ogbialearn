// ========================================
// AI Chat API Route - Google Gemini
// ========================================

import { NextRequest, NextResponse } from "next/server";

// Ogbia vocabulary context for the AI
const OGBIA_CONTEXT = `You are an AI language tutor for the Ogbia language, spoken by the Ogbia people of Bayelsa State, Nigeria.

Here is the vocabulary database you know:

BODY PARTS:
- Head = Emù
- Eye = Adien
- Ear = Ato
- Hair = Asiàl
- Hand = Aguo
- Leg = Àlike
- Mouth = Ọnù
- Nose = Izon
- Stomach = Ewunu
- Teeth = Álai
- Tongue = Ànem

HOUSEHOLD ITEMS:
- Bed = Agbàdà
- Bottle = Òlòlò
- Chair = O'bakù
- Knife = O'gya
- Plate = Èfèrè
- Pot = O'gbèlè
- Spoon = Ìngìasì

When users ask about Ogbia words, provide the translation and pronunciation hints. 
If asked about words not in your database, let them know you're still learning and that more words will be added soon.
Provide cultural context about the Ogbia people when relevant.
Keep responses concise and educational.
Be encouraging and supportive of language learning efforts.`;

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    const apiKey = process.env.GOOGLE_API_KEY;

    if (!apiKey) {
      // Fallback: use local knowledge when API key isn't available
      return handleLocalResponse(messages);
    }

    // Use Google Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: OGBIA_CONTEXT }],
            },
            {
              role: "model",
              parts: [
                {
                  text: "I understand. I am an Ogbia language tutor ready to help with vocabulary, pronunciation, and cultural context.",
                },
              ],
            },
            ...messages.map(
              (msg: { role: string; content: string }) => ({
                role: msg.role === "assistant" ? "model" : "user",
                parts: [{ text: msg.content }],
              })
            ),
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500,
          },
        }),
      }
    );

    if (!response.ok) {
      return handleLocalResponse(messages);
    }

    const data = await response.json();
    const aiMessage =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I'm sorry, I couldn't generate a response.";

    return NextResponse.json({ message: aiMessage });
  } catch {
    return handleLocalResponse([]);
  }
}

// Local fallback responses when API is unavailable
function handleLocalResponse(messages: { role: string; content: string }[]) {
  const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || "";

  const vocabulary: Record<string, string> = {
    head: "Emù",
    eye: "Adien",
    ear: "Ato",
    hair: "Asiàl",
    hand: "Aguo",
    leg: "Àlike",
    mouth: "Ọnù",
    nose: "Izon",
    stomach: "Ewunu",
    teeth: "Álai",
    tongue: "Ànem",
    bed: "Agbàdà",
    bottle: "Òlòlò",
    chair: "O'bakù",
    knife: "O'gya",
    plate: "Èfèrè",
    pot: "O'gbèlè",
    spoon: "Ìngìasì",
  };

  // Check if asking about a specific word
  for (const [english, ogbia] of Object.entries(vocabulary)) {
    if (lastMessage.includes(english) || lastMessage.includes(ogbia.toLowerCase())) {
      return NextResponse.json({
        message: `"${english.charAt(0).toUpperCase() + english.slice(1)}" in Ogbia is "${ogbia}". The Ogbia language uses tonal accents, so pay close attention to the accent marks for correct pronunciation!`,
      });
    }
  }

  // General responses
  if (lastMessage.includes("hello") || lastMessage.includes("hi")) {
    return NextResponse.json({
      message:
        "Hello! I'm your Ogbia language tutor. I can help you learn vocabulary related to body parts and household items. What would you like to learn?",
    });
  }

  if (lastMessage.includes("ogbia") && (lastMessage.includes("people") || lastMessage.includes("about"))) {
    return NextResponse.json({
      message:
        "The Ogbia people are an ethnic group in Bayelsa State, Nigeria. They speak the Ogbia language, which is part of the Ijo language family. The Ogbia are known for their rich cultural heritage and traditions. Learning their language helps preserve this important cultural identity!",
    });
  }

  return NextResponse.json({
    message:
      "I can help you with Ogbia vocabulary! Try asking me about specific words like 'head', 'eye', 'pot', or 'spoon'. I know body parts and household items in Ogbia. You can also ask me about the Ogbia people and their culture.",
  });
}
