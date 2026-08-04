const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080";

const FALLBACK_CUSTOMERS = [
  {
    user_id: "CUS-8921",
    name: "Alex Mercer",
    email: "alex.m@example.com",
    address: "742 Evergreen Terrace, Springfield",
    zip_code: "62704",
  },
  {
    user_id: "CUS-8922",
    name: "Sarah Jenkins",
    email: "sarah.j@example.com",
    address: "221B Baker Street, London",
    zip_code: "NW1 6XE",
  },
  {
    user_id: "CUS-8923",
    name: "Michael Chen",
    email: "m.chen@example.com",
    address: "10 Anson Road, Singapore",
    zip_code: "079903",
  },
  {
    user_id: "CUS-8924",
    name: "Emma Watson",
    email: "emma.w@example.com",
    address: "15 Oxford Street, London",
    zip_code: "W1D 1BS",
  },
  {
    user_id: "CUS-8925",
    name: "David Rodriguez",
    email: "d.rod@example.com",
    address: "Av. Reforma 222, Mexico City",
    zip_code: "06600",
  },
];

export async function GET(request: Request) {
  try {
    const backendRes = await fetch(`${BACKEND_URL}/customer/`, {
      signal: AbortSignal.timeout(5000),
    });

    if (!backendRes.ok) {
      throw new Error(`Backend responded with ${backendRes.status}`);
    }

    const data = await backendRes.json();
    return Response.json(data);
  } catch (error) {
    console.warn(
      "Backend unreachable, returning fallback customers:",
      error instanceof Error ? error.message : error
    );
    return Response.json(FALLBACK_CUSTOMERS);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const backendRes = await fetch(`${BACKEND_URL}/customer/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(5000),
    });

    if (!backendRes.ok) {
      const errorText = await backendRes.text();
      return Response.json(
        { error: `Backend error: ${errorText}` },
        { status: backendRes.status }
      );
    }

    const data = await backendRes.json();
    return Response.json(data, { status: 201 });
  } catch (error) {
    console.error("Failed to create customer:", error);
    return Response.json(
      {
        error:
          "Backend service is currently unavailable. Please try again later.",
      },
      { status: 503 }
    );
  }
}
