// ========================================
// AI Chat API Route - Google Gemini + RAG
// ========================================

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// --- RAG Configuration ---
const EMBEDDING_MODEL = "gemini-embedding-001";
const RAG_MATCH_THRESHOLD = 0.3;
const RAG_MATCH_COUNT = 5;

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

// --- RAG Helper Functions ---

async function generateQueryEmbedding(text: string, apiKey: string): Promise<number[] | null> {
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${EMBEDDING_MODEL}:embedContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: `models/${EMBEDDING_MODEL}`,
        content: { parts: [{ text }] },
        taskType: "RETRIEVAL_QUERY",
        outputDimensionality: 768,
      }),
    });

    if (!response.ok) return null;
    const data = await response.json();
    return data.embedding?.values || null;
  } catch {
    return null;
  }
}

async function searchKnowledgeBase(queryEmbedding: number[]): Promise<string[]> {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) return [];

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data, error } = await supabase.rpc("match_documents", {
      query_embedding: JSON.stringify(queryEmbedding),
      match_threshold: RAG_MATCH_THRESHOLD,
      match_count: RAG_MATCH_COUNT,
    });

    if (error || !data) return [];
    return data.map((doc: { content: string; similarity: number }) => doc.content);
  } catch {
    return [];
  }
}

async function getRAGContext(userMessage: string, apiKey: string): Promise<string> {
  // Generate embedding for user's query
  const embedding = await generateQueryEmbedding(userMessage, apiKey);
  if (!embedding) return "";

  // Search knowledge base
  const relevantChunks = await searchKnowledgeBase(embedding);
  if (relevantChunks.length === 0) return "";

  return `\n\nRELEVANT EXCERPTS FROM THE OGBIA GRAMMAR BOOK:
${relevantChunks.map((chunk, i) => `--- Excerpt ${i + 1} ---\n${chunk}`).join("\n\n")}

Use these excerpts to provide detailed, accurate answers about Ogbia grammar, vocabulary, pronunciation, and culture. Cite the grammar book when relevant.`;
}

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    const apiKey = process.env.GOOGLE_API_KEY;

    if (!apiKey) {
      return handleLocalResponse(messages);
    }

    // Get the latest user message for RAG search
    const lastUserMessage = messages
      .filter((m: { role: string }) => m.role === "user")
      .pop()?.content || "";

    // Retrieve relevant context from knowledge base
    const ragContext = await getRAGContext(lastUserMessage, apiKey);

    // Build system context with RAG augmentation
    const fullContext = OGBIA_CONTEXT + ragContext;

    // Use Google Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: fullContext }],
            },
            {
              role: "model",
              parts: [
                {
                  text: "I understand. I am an Ogbia language tutor with deep knowledge from the Ogbia Grammar Book. I'm ready to help with vocabulary, grammar, pronunciation, and cultural context.",
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
            maxOutputTokens: 800,
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
