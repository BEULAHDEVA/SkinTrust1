import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080";

const BASE_SYSTEM_INSTRUCTION = `You are Mithra, an AI-powered KYC and Compliance Operations Assistant built to streamline identity verification, AML monitoring, customer onboarding, and compliance workflows.

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

Mithra enables compliance teams to manage customer verification and regulatory workflows efficiently using conversational AI powered by KYC Mithra's proprietary intelligence engine.`;

const FALLBACK_CUSTOMER_LOG = `Current customer log (for reference):
- CUS-8921: Alex Mercer — Verified, Low Risk
- CUS-8922: Sarah Jenkins — Pending, Medium Risk — proof of address slightly obscured
- CUS-8923: Michael Chen — Rejected, High Risk — suspected fraudulent document
- CUS-8924: Emma Watson — Verified, Low Risk
- CUS-8925: David Rodriguez — Verified, Low Risk`;

interface CustomerData {
  user_id: string;
  name: string;
  email: string;
  address: string;
  zip_code: string;
}

interface KycData {
  id: string;
  user_id: string;
  kyc_status: string;
  document_type: string;
  document_id: string;
  verified_by: string;
}

function mapKycStatusToRisk(status: string): string {
  switch (status) {
    case "Verified":
      return "Low";
    case "Pending":
      return "Medium";
    case "Rejected":
      return "High";
    default:
      return "Unknown";
  }
}

async function buildCustomerContext(): Promise<string> {
  try {
    const [customersRes, kycRes] = await Promise.all([
      fetch(`${BACKEND_URL}/customer/`, { signal: AbortSignal.timeout(3000) }),
      fetch(`${BACKEND_URL}/kyc/`, { signal: AbortSignal.timeout(3000) }),
    ]);

    if (!customersRes.ok || !kycRes.ok) {
      throw new Error("Backend returned non-OK status");
    }

    const customers: CustomerData[] = await customersRes.json();
    const kycRecords: KycData[] = await kycRes.json();

    // Build a map of user_id -> KYC record
    const kycMap = new Map<string, KycData>();
    for (const record of kycRecords) {
      kycMap.set(record.user_id, record);
    }

    // Build customer log lines
    const lines = customers.map((c) => {
      const kyc = kycMap.get(c.user_id);
      const status = kyc?.kyc_status ?? "Unknown";
      const risk = mapKycStatusToRisk(status);
      const docInfo = kyc
        ? ` — ${kyc.document_type}: ${kyc.document_id}`
        : "";
      return `- ${c.user_id}: ${c.name} (${c.email}) — ${status}, ${risk} Risk${docInfo}`;
    });

    if (lines.length === 0) {
      return FALLBACK_CUSTOMER_LOG;
    }

    return `Current customer log (live data, ${lines.length} records):\n${lines.join("\n")}`;
  } catch (error) {
    console.warn(
      "Could not fetch live customer data for agent context, using fallback:",
      error instanceof Error ? error.message : error
    );
    return FALLBACK_CUSTOMER_LOG;
  }
}

async function callGeminiWithRetry(
  systemInstruction: string,
  history: any[],
  message: string,
  attempt = 0
): Promise<string> {
  const models = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"];
  const model = models[attempt];

  try {
    const chat = ai.chats.create({
      model: model,
      config: {
        systemInstruction: systemInstruction,
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
      return callGeminiWithRetry(systemInstruction, history, message, attempt + 1);
    }
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return Response.json(
        { error: "Invalid request: messages array required" },
        { status: 400 }
      );
    }

    // Fetch real customer/KYC data to inject into system instruction
    const customerContext = await buildCustomerContext();

    const fullSystemInstruction = `${BASE_SYSTEM_INSTRUCTION}

${customerContext}

Always stay in character as Mithra. Do not reveal you are a Google Gemini model.`;

    const history = messages
      .slice(0, -1)
      .map((msg: { text: string; isBot: boolean }) => ({
        role: msg.isBot ? "model" : "user",
        parts: [{ text: msg.text }],
      }));

    const latestMessage = messages[messages.length - 1];
    const text = await callGeminiWithRetry(
      fullSystemInstruction,
      history,
      latestMessage.text
    );

    return Response.json({ reply: text });
  } catch (error: any) {
    console.error("Gemini API error:", error);
    return Response.json(
      {
        error:
          "Our AI is currently at capacity. Please try again in a moment.",
      },
      { status: 503 }
    );
  }
}
