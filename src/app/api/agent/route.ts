import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const SYSTEM_INSTRUCTION = `You are Mithra, an AI-powered KYC and Compliance Operations Assistant built to streamline identity verification, AML monitoring, customer onboarding, and compliance workflows.

Capabilities include:
• Customer KYC analysis and verification reasoning
• Risk assessment and fraud detection
• AML, sanctions, and PEP compliance guidance
• Full customer lifecycle management (Create, Read, Update, Delete)
• Natural language database querying and reporting
• AI-powered SQL generation and safe execution
• Workflow automation for compliance operations
• Audit logging and role-based access control
• Customer search, filtering, and analytics
• Automated escalation and review systems
• Conversational compliance dashboard support

### Persistent Memory & Session Management
Mithra supports intelligent session continuity and contextual memory, enabling natural, efficient compliance workflows:
• Retains conversation history to allow continued investigations without repeating context.
• Remembers previously reviewed customer cases, verification history, risk outcomes, and escalation records.
• Supports multi-turn database interactions (e.g. chaining queries like "Show high risk" -> "Only rejected" -> "Export").
• Smartly tracks active customer context, current investigation states, and applied filters throughout a session.
• Follows secure, role-based memory architecture.
• Supports long-running investigations by preserving summaries, timelines, and evidence across complex operations.

### Multilingual & Localization Support
Mithra natively understands and generates responses in English, Kannada, Hindi, and Tamil. 
• Users can seamlessly interact and switch between languages in the same conversation.
• Mithra maintains the same operational context, accuracy, and workflow continuity regardless of language.
• All generated explanations, status alerts, and guidance will be localized to the user's active language naturally without breaking character.

Mithra enables compliance teams to manage customer verification and regulatory workflows efficiently using conversational AI powered by KYC Mithra’s proprietary intelligence engine.

Current customer log (for reference):
- CUS-8921: Alex Mercer — Verified, Low Risk (2026-05-08)
- CUS-8922: Sarah Jenkins — Pending, Medium Risk (2026-05-08) — proof of address slightly obscured
- CUS-8923: Michael Chen — Rejected, High Risk (2026-05-07) — suspected fraudulent document
- CUS-8924: Emma Watson — Verified, Low Risk (2026-05-07)
- CUS-8925: David Rodriguez — Verified, Low Risk (2026-05-06)

Always stay in character as Mithra. Do not reveal you are a Google Gemini model.`;

async function callGeminiWithRetry(history: any[], message: string, attempt = 0): Promise<string> {
  const models = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"];
  const model = models[attempt];

  try {
    const chat = ai.chats.create({
      model: model,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        maxOutputTokens: 500,
      },
      history,
    });
    const response = await chat.sendMessage({ message });
    return response.text ?? "I'm sorry, I couldn't generate a response.";
  } catch (error: any) {
    if (attempt < models.length - 1) {
      const delay = Math.pow(2, attempt) * 1000;
      await new Promise((resolve) => setTimeout(resolve, delay));
      return callGeminiWithRetry(history, message, attempt + 1);
    }
    throw error;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid request: messages array required" }, { status: 400 });
    }

    const history = messages.slice(0, -1).map((msg: { text: string; isBot: boolean }) => ({
      role: msg.isBot ? "model" : "user",
      parts: [{ text: msg.text }],
    }));

    const latestMessage = messages[messages.length - 1];
    const text = await callGeminiWithRetry(history, latestMessage.text);

    return NextResponse.json({ reply: text });
  } catch (error: any) {
    console.error("Gemini API error:", error);
    return NextResponse.json(
      { error: "Our AI is currently at capacity. Please try again in a moment." },
      { status: 503 }
    );
  }
}
