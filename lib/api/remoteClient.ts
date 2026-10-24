/**
 * Remote API Client for CaseBridge AI / CaseSense
 * Connects Next.js frontend to FastAPI backend and Supabase infrastructure.
 * Automatically falls back to offline CaseBridgeStore if backend is unavailable.
 */

import { CaseBridgeStore } from "./store";
import { ComplaintCase, OverlapPair, UserProfile } from "./types";
import { SEED_USERS, SEED_INSTITUTION_ACCOUNTS } from "./seedData";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_FASTAPI_BACKEND_URL || "http://localhost:8000/api/v1";

export async function isBackendHealthy(): Promise<boolean> {
  try {
    const res = await fetch(`${BACKEND_URL}/health`, {
      method: "GET",
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(2000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function getLiveDashboardOverview() {
  try {
    const res = await fetch(`${BACKEND_URL}/dashboard/overview`, {
      method: "GET",
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(3000),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.debug("Backend unavailable, using local store for dashboard overview:", e);
  }
  return CaseBridgeStore.getDashboardMetrics();
}

export async function fetchLiveComplaints(params?: Record<string, string>): Promise<ComplaintCase[]> {
  try {
    const query = new URLSearchParams(params || {}).toString();
    const url = `${BACKEND_URL}/complaints${query ? `?${query}` : ""}`;
    const res = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(3000),
    });
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (e) {
    console.debug("Backend unavailable, using local store for complaints:", e);
  }
  return CaseBridgeStore.getCases();
}

export async function submitPublicComplaintApi(payload: {
  institution_id: string;
  category: string;
  subject: string;
  statement: string;
  complainant_name: string;
  complainant_email?: string;
  complainant_phone?: string;
  is_whistleblower?: boolean;
}) {
  try {
    const res = await fetch(`${BACKEND_URL}/complaints/public`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(4000),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.debug("Backend unavailable, registering via local store:", e);
  }

  // Fallback to local store
  const result = CaseBridgeStore.createPublicComplaint({
    institutionId: payload.institution_id,
    category: payload.category as any,
    subject: payload.subject,
    description: payload.statement,
    complainantName: payload.is_whistleblower ? "Whistleblower (Identity Protected)" : payload.complainant_name,
    complainantType: payload.is_whistleblower ? "Anonymous Whistleblower" : "Student",
    complainantEmail: payload.complainant_email || "",
    complainantPhone: payload.complainant_phone || "",
    isAnonymous: Boolean(payload.is_whistleblower),
  });

  return {
    success: true,
    case_id: result.newCase.id,
    ref_number: result.refNumber,
    tracking_code: result.trackingCode,
    institution_name: result.newCase.institutionName,
    received_date: result.newCase.receivedDate,
    sla_deadline: result.newCase.slaDeadline,
    message: "Grievance successfully cataloged into CaseBridge AI. Retain your Reference Number and Tracking Code.",
  };
}

export async function trackComplaintApi(refNumber: string, verificationInput: string) {
  try {
    const res = await fetch(`${BACKEND_URL}/complaints/track`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ref_number: refNumber,
        verification_input: verificationInput,
      }),
      signal: AbortSignal.timeout(3000),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.debug("Backend unavailable, tracking via local store:", e);
  }

  // Fallback to local store
  return CaseBridgeStore.trackComplaint(refNumber, verificationInput);
}

export async function fetchLiveOverlapCandidates(): Promise<OverlapPair[]> {
  try {
    const res = await fetch(`${BACKEND_URL}/overlap/candidates`, {
      method: "GET",
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(3000),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.debug("Backend unavailable, using local store for overlaps:", e);
  }
  return CaseBridgeStore.getOverlaps();
}

export async function submitOverlapDecisionApi(
  pairId: string,
  action: "CONFIRMED_LINKED" | "REJECTED_DISTINCT" | "DEFERRED" | "MERGED",
  reviewerNotes: string,
  leadBureau?: string,
  token?: string
) {
  try {
    const res = await fetch(`${BACKEND_URL}/overlap/candidates/${pairId}/decision`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        action,
        reviewer_notes: reviewerNotes,
        lead_bureau: leadBureau,
      }),
      signal: AbortSignal.timeout(4000),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.debug("Backend unavailable, resolving overlap in local store:", e);
  }

  // Fallback to local store
  return CaseBridgeStore.resolveOverlap(pairId, action as any, reviewerNotes, leadBureau || "REGULATION");
}

export function getStoredAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("casebridge_jwt_token");
}

export function clearStoredAuth(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("casebridge_jwt_token");
  localStorage.removeItem("casebridge_current_user_v1");
  localStorage.removeItem("casebridge_inst_token");
  document.cookie = "casebridge_auth_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  document.cookie = "casebridge_inst_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  window.dispatchEvent(new CustomEvent("casebridge_store_updated", { detail: { auth: false } }));
}

export async function loginOfficialApi(
  email: string,
  password: string
): Promise<{ success: boolean; token?: string; user?: UserProfile; error?: string }> {
  try {
    const res = await fetch(`${BACKEND_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      signal: AbortSignal.timeout(4000),
    });
    if (res.ok) {
      const data = await res.json();
      const userProfile: UserProfile = {
        id: data.user_id,
        name: data.full_name || "Official User",
        designation: data.role === "ADMIN" ? "Chief Vigilance & Compliance Director" : "Administrative Review Officer",
        role: data.role as any,
        bureau: (data.bureau_id || "PGRC") as any,
        email: email.trim().toLowerCase(),
        avatarInitials: (data.full_name || "OU").substring(0, 2).toUpperCase(),
      };
      if (typeof window !== "undefined") {
        localStorage.setItem("casebridge_jwt_token", data.access_token);
        localStorage.setItem("casebridge_current_user_v1", JSON.stringify(userProfile));
        document.cookie = `casebridge_auth_session=${data.access_token}; path=/; max-age=86400; SameSite=Lax`;
        window.dispatchEvent(new CustomEvent("casebridge_store_updated", { detail: { auth: true } }));
      }
      return { success: true, token: data.access_token, user: userProfile };
    } else {
      const err = await res.json().catch(() => ({}));
      return { success: false, error: err.detail || "Authentication failed. Incorrect email or password." };
    }
  } catch (e) {
    // Offline / fallback support
    const seed = SEED_USERS.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (seed) {
      const mockToken = "mock_jwt_" + seed.id;
      if (typeof window !== "undefined") {
        localStorage.setItem("casebridge_jwt_token", mockToken);
        localStorage.setItem("casebridge_current_user_v1", JSON.stringify(seed));
        document.cookie = `casebridge_auth_session=${mockToken}; path=/; max-age=86400; SameSite=Lax`;
        window.dispatchEvent(new CustomEvent("casebridge_store_updated", { detail: { auth: true } }));
      }
      return { success: true, token: mockToken, user: seed };
    }
    return { success: false, error: "Invalid credentials. Use official password or choose a pre-configured persona." };
  }
}

export async function loginInstitutionApi(
  email: string,
  accessKey: string,
  institutionId?: string
): Promise<{ success: boolean; token?: string; error?: string }> {
  try {
    const res = await fetch(`${BACKEND_URL}/auth/institution-login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        access_key: accessKey,
        institution_id: institutionId || "1-10492811",
      }),
      signal: AbortSignal.timeout(4000),
    });
    if (res.ok) {
      const data = await res.json();
      if (typeof window !== "undefined") {
        localStorage.setItem("casebridge_inst_token", data.access_token);
        document.cookie = `casebridge_inst_session=${data.access_token}; path=/; max-age=86400; SameSite=Lax`;
      }
      return { success: true, token: data.access_token };
    }
  } catch (e) {
    console.debug("Backend unavailable, using local store for institution authentication");
  }
  const acc = CaseBridgeStore.authenticateInstitution(email, accessKey);
  if (acc) {
    const mockToken = "mock_inst_token";
    if (typeof window !== "undefined") {
      localStorage.setItem("casebridge_inst_token", mockToken);
      document.cookie = `casebridge_inst_session=${mockToken}; path=/; max-age=86400; SameSite=Lax`;
    }
    return { success: true, token: mockToken };
  }
  return { success: false, error: "Invalid institutional credentials or unauthorized access key." };
}
