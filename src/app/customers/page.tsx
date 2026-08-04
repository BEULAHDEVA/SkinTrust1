"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import BackgroundVideo from "@/components/BackgroundVideo";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { useRole } from "@/lib/useRole";

type Status = "Verified" | "Pending" | "Rejected";
type Risk = "Low" | "Medium" | "High";

interface Customer {
  id: string;
  name: string;
  email: string;
  status: Status;
  risk: Risk;
  date: string;
  country: string;
}

interface ApiCustomer {
  user_id: string;
  name: string;
  email: string;
  address: string;
  zip_code: string;
}

interface ApiKycRecord {
  id: string;
  user_id: string;
  kyc_status: string;
  document_type: string;
  document_id: string;
  verified_by: string;
}

function mapKycStatusToRisk(status: string): Risk {
  switch (status) {
    case "Verified":
      return "Low";
    case "Pending":
      return "Medium";
    case "Rejected":
      return "High";
    default:
      return "Medium";
  }
}

function inferCountry(address: string, zip: string): string {
  if (/london|oxford|baker/i.test(address)) return "GB";
  if (/singapore|anson/i.test(address)) return "SG";
  if (/mexico/i.test(address)) return "MX";
  if (/india|mumbai|delhi|bangalore|chennai/i.test(address)) return "IN";
  if (/terrace|springfield/i.test(address)) return "US";
  if (zip.match(/^[A-Z]{1,2}\d/)) return "GB";
  return "US";
}

const STATUS_FILTERS: (Status | "All")[] = [
  "All",
  "Verified",
  "Pending",
  "Rejected",
];
const RISK_FILTERS: (Risk | "All")[] = ["All", "Low", "Medium", "High"];

function SkeletonRow() {
  return (
    <div className="flex flex-col md:grid md:grid-cols-7 gap-2 md:gap-4 px-4 py-4">
      <div className="h-4 w-20 bg-white/10 rounded animate-pulse" />
      <div className="col-span-2 flex flex-col gap-1.5">
        <div className="h-4 w-32 bg-white/10 rounded animate-pulse" />
        <div className="h-3 w-44 bg-white/5 rounded animate-pulse" />
      </div>
      <div>
        <div className="h-6 w-16 bg-white/10 rounded-full animate-pulse" />
      </div>
      <div>
        <div className="h-4 w-12 bg-white/10 rounded animate-pulse" />
      </div>
      <div>
        <div className="h-6 w-16 bg-white/10 rounded-lg animate-pulse" />
      </div>
      <div className="flex justify-end">
        <div className="h-4 w-20 bg-white/10 rounded animate-pulse" />
      </div>
    </div>
  );
}

export default function CustomersLogPage() {
  const router = useRouter();
  const [role] = useRole();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status | "All">("All");
  const [riskFilter, setRiskFilter] = useState<Risk | "All">("All");
  const [exporting, setExporting] = useState(false);

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const [customersRes, kycRes] = await Promise.all([
          fetch("/api/customers"),
          fetch("/api/kyc"),
        ]);

        if (!customersRes.ok || !kycRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const apiCustomers: ApiCustomer[] = await customersRes.json();
        const kycRecords: ApiKycRecord[] = await kycRes.json();

        // Build KYC map by user_id
        const kycMap = new Map<string, ApiKycRecord>();
        for (const record of kycRecords) {
          kycMap.set(record.user_id, record);
        }

        // Join customer data with KYC records
        const merged: Customer[] = apiCustomers.map((c) => {
          const kyc = kycMap.get(c.user_id);
          const status = (kyc?.kyc_status ?? "Pending") as Status;
          return {
            id: c.user_id,
            name: c.name,
            email: c.email,
            status,
            risk: mapKycStatusToRisk(status),
            date: new Date().toISOString().slice(0, 10),
            country: inferCountry(c.address, c.zip_code),
          };
        });

        setCustomers(merged);
      } catch (err) {
        console.error("Failed to load customer data:", err);
        setError(
          "Unable to load customer data. Please check your connection and try again."
        );
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const filtered = useMemo(() => {
    return customers.filter((c) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q);
      const matchStatus = statusFilter === "All" || c.status === statusFilter;
      const matchRisk = riskFilter === "All" || c.risk === riskFilter;
      return matchSearch && matchStatus && matchRisk;
    });
  }, [search, statusFilter, riskFilter, customers]);

  const exportToCSV = useCallback(() => {
    setExporting(true);

    const headers = [
      "Customer ID",
      "Name",
      "Email",
      "Status",
      "Risk Level",
      "Country",
      "Date Added",
    ];
    const rows = filtered.map((c) => [
      c.id,
      c.name,
      c.email,
      c.status,
      c.risk,
      c.country,
      c.date,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row
          .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const timestamp = new Date().toISOString().slice(0, 10);
    link.href = url;
    link.download = `kyc-mithra-customers-${timestamp}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setTimeout(() => setExporting(false), 1500);
  }, [filtered]);

  const statusColors: Record<Status, string> = {
    Verified: "bg-emerald-500/20 text-emerald-400 border-emerald-500/20",
    Pending: "bg-amber-500/20 text-amber-400 border-amber-500/20",
    Rejected: "bg-rose-500/20 text-rose-400 border-rose-500/20",
  };

  const riskColors: Record<Risk, string> = {
    Low: "text-emerald-400",
    Medium: "text-amber-400",
    High: "text-rose-400",
  };

  const actionLabel: Record<Status, string> = {
    Pending: "Review ID",
    Rejected: "Escalate",
    Verified: "View File",
  };

  return (
    <main className="relative min-h-screen flex flex-col bg-background text-foreground overflow-hidden">
      <BackgroundVideo />
      <Navbar />

      <div className="relative z-10 flex-1 flex flex-col p-6 md:p-8 max-w-6xl mx-auto w-full gap-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold font-['General_Sans'] tracking-tight">
              Customer Verification Log
            </h1>
            <p className="text-white/40 text-sm mt-1">
              {loading
                ? "Loading customers..."
                : `${filtered.length} of ${customers.length} customers`}
            </p>
          </div>
          {role === "admin" && (
            <Button
              id="export-report"
              variant="heroSecondary"
              onClick={exportToCSV}
              disabled={exporting || filtered.length === 0 || loading}
              className={`rounded-lg px-4 py-2 self-start md:self-auto flex items-center gap-2 transition-all ${
                exporting
                  ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                  : ""
              }`}
            >
              {exporting ? (
                <>
                  <svg
                    className="w-4 h-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      d="M21 12a9 9 0 1 1-6.219-8.56"
                      strokeLinecap="round"
                    />
                  </svg>
                  Exporting…
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Export CSV
                </>
              )}
            </Button>
          )}
        </div>

        {/* Search + Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <svg
              viewBox="0 0 24 24"
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              id="customer-search"
              type="text"
              placeholder="Search by name, email, or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
            />
          </div>

          {/* Status Filter */}
          <div className="flex gap-1.5 flex-wrap">
            {STATUS_FILTERS.map((s) => (
              <button
                key={s}
                id={`filter-status-${s.toLowerCase()}`}
                onClick={() => setStatusFilter(s as any)}
                className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                  statusFilter === s
                    ? "bg-indigo-500/30 border-indigo-500/50 text-indigo-200"
                    : "bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Risk Filter */}
          <div className="flex gap-1.5 flex-wrap">
            {RISK_FILTERS.map((r) => (
              <button
                key={r}
                id={`filter-risk-${r.toLowerCase()}`}
                onClick={() => setRiskFilter(r as any)}
                className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                  riskFilter === r
                    ? "bg-purple-500/30 border-purple-500/50 text-purple-200"
                    : "bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="liquid-glass rounded-2xl p-6 border border-rose-500/20 text-center">
            <svg
              className="w-10 h-10 text-rose-400 mx-auto mb-3"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <p className="text-rose-300 text-sm font-medium">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 text-xs text-indigo-400 hover:text-indigo-300 underline transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Table */}
        <div className="liquid-glass rounded-2xl w-full border border-white/5 overflow-hidden flex flex-col">
          {/* Table Header */}
          <div className="hidden md:grid grid-cols-7 gap-4 px-4 py-3 border-b border-white/10 bg-white/[0.03] text-xs font-semibold text-white/50 uppercase tracking-wider">
            <div>Customer ID</div>
            <div className="col-span-2">Name & Email</div>
            <div>Status</div>
            <div>Risk</div>
            <div>Action</div>
            <div className="text-right">Date</div>
          </div>

          <div className="flex flex-col overflow-y-auto divide-y divide-white/5">
            {loading ? (
              <>
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
              </>
            ) : filtered.length === 0 ? (
              <div className="py-16 text-center text-white/30 text-sm">
                No customers match your search or filters.
              </div>
            ) : (
              filtered.map((customer) => (
                <div
                  key={customer.id}
                  className="flex flex-col md:grid md:grid-cols-7 gap-2 md:gap-4 px-4 py-4 hover:bg-white/5 transition-colors cursor-pointer group"
                  onClick={() => router.push(`/customers/${customer.id}`)}
                >
                  <div className="font-mono text-xs text-white/50 group-hover:text-indigo-400 transition-colors">
                    {customer.id}
                  </div>
                  <div className="col-span-2 flex flex-col">
                    <span className="font-medium text-white text-sm">
                      {customer.name}
                    </span>
                    <span className="text-xs text-white/40">
                      {customer.email}
                    </span>
                  </div>
                  <div>
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[customer.status]}`}
                    >
                      {customer.status}
                    </span>
                  </div>
                  <div>
                    <span
                      className={`inline-flex items-center gap-1.5 text-sm ${riskColors[customer.risk]}`}
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-current" />
                      {customer.risk}
                    </span>
                  </div>
                  <div>
                    <span
                      className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20 hover:bg-indigo-500/20 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {customer.status === "Rejected" && role !== "admin"
                        ? "View File"
                        : actionLabel[customer.status]}
                    </span>
                  </div>
                  <div className="text-white/40 text-xs text-right">
                    {customer.date}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
