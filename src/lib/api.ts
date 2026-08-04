export type Customer = {
  user_id: string;
  name: string;
  email: string;
  address: string;
  zip_code: string;
};

export type KycRecord = {
  id: string;
  user_id: string;
  kyc_status: string;
  document_type: string;
  document_id: string;
  verified_by: string;
};

export type DashboardStats = {
  totalVerifications: number;
  autoApprovalRate: number;
  pendingReview: number;
  highRiskPercent: number;
  riskDistribution: {
    low: number;
    medium: number;
    high: number;
  };
  recentActivity: {
    date: string;
    count: number;
  }[];
};

const BASE_URL = typeof window !== "undefined" ? "" : "http://localhost:3000";

export async function fetchCustomers(): Promise<Customer[]> {
  const res = await fetch(`${BASE_URL}/api/customers`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch customers: ${res.status}`);
  return res.json();
}

export async function fetchKycRecords(
  kyc_status?: string
): Promise<KycRecord[]> {
  const params = kyc_status
    ? `?kyc_status=${encodeURIComponent(kyc_status)}`
    : "";
  const res = await fetch(`${BASE_URL}/api/kyc${params}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Failed to fetch KYC records: ${res.status}`);
  return res.json();
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const res = await fetch(`${BASE_URL}/api/dashboard/stats`, {
    cache: "no-store",
  });
  if (!res.ok)
    throw new Error(`Failed to fetch dashboard stats: ${res.status}`);
  return res.json();
}
