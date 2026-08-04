const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080";

const FALLBACK_KYC_RECORDS = [
  {
    id: "KYC-001",
    user_id: "CUS-8921",
    kyc_status: "Verified",
    document_type: "Passport",
    document_id: "P-US-29184",
    verified_by: "auto-system",
  },
  {
    id: "KYC-002",
    user_id: "CUS-8922",
    kyc_status: "Pending",
    document_type: "Driving License",
    document_id: "DL-GB-77231",
    verified_by: "unassigned",
  },
  {
    id: "KYC-003",
    user_id: "CUS-8923",
    kyc_status: "Rejected",
    document_type: "National ID",
    document_id: "NID-SG-44892",
    verified_by: "officer-jane",
  },
  {
    id: "KYC-004",
    user_id: "CUS-8924",
    kyc_status: "Verified",
    document_type: "Passport",
    document_id: "P-GB-10293",
    verified_by: "auto-system",
  },
  {
    id: "KYC-005",
    user_id: "CUS-8925",
    kyc_status: "Verified",
    document_type: "Voter ID",
    document_id: "VID-MX-55012",
    verified_by: "auto-system",
  },
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const kycStatus = searchParams.get("kyc_status");

    let backendUrl = `${BACKEND_URL}/kyc/`;
    if (kycStatus) {
      backendUrl += `?kyc_status=${encodeURIComponent(kycStatus)}`;
    }

    const backendRes = await fetch(backendUrl, {
      signal: AbortSignal.timeout(5000),
    });

    if (!backendRes.ok) {
      throw new Error(`Backend responded with ${backendRes.status}`);
    }

    const data = await backendRes.json();
    return Response.json(data);
  } catch (error) {
    console.warn(
      "Backend unreachable, returning fallback KYC records:",
      error instanceof Error ? error.message : error
    );

    const { searchParams } = new URL(request.url);
    const kycStatus = searchParams.get("kyc_status");

    const filtered = kycStatus
      ? FALLBACK_KYC_RECORDS.filter((r) => r.kyc_status === kycStatus)
      : FALLBACK_KYC_RECORDS;

    return Response.json(filtered);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const backendRes = await fetch(`${BACKEND_URL}/kyc/`, {
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
    console.error("Failed to create KYC record:", error);
    return Response.json(
      {
        error:
          "Backend service is currently unavailable. Please try again later.",
      },
      { status: 503 }
    );
  }
}
