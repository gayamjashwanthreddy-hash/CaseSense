import { getSupabaseClient, isSupabaseConfigured } from "./client";
import { UserProfile, UserRole } from "@/lib/api/types";
import { SEED_USERS } from "@/lib/api/seedData";

export const SupabaseAuthService = {
  isConfigured(): boolean {
    return isSupabaseConfigured();
  },

  async signInWithEmail(email: string, password: string) {
    const supabase = getSupabaseClient();
    if (!supabase || !this.isConfigured()) {
      return { data: null, error: new Error("Supabase is not configured.") };
    }
    return await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });
  },

  async signUp(email: string, password: string, metadata?: { fullName: string; role?: string; institutionId?: string }) {
    const supabase = getSupabaseClient();
    if (!supabase || !this.isConfigured()) {
      return { data: null, error: new Error("Supabase is not configured.") };
    }
    return await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        data: metadata,
      },
    });
  },

  async signOut() {
    const supabase = getSupabaseClient();
    if (supabase && this.isConfigured()) {
      await supabase.auth.signOut();
    }
  },

  async getSession() {
    const supabase = getSupabaseClient();
    if (!supabase || !this.isConfigured()) {
      return null;
    }
    const { data } = await supabase.auth.getSession();
    return data.session;
  },

  onAuthStateChange(callback: (session: any) => void) {
    const supabase = getSupabaseClient();
    if (!supabase || !this.isConfigured()) {
      return { unsubscribe: () => {} };
    }
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      callback(session);
    });
    return subscription;
  },

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    const supabase = getSupabaseClient();
    if (!supabase || !this.isConfigured()) {
      return null;
    }
    try {
      const { data, error } = await supabase
        .from("users_profile")
        .select("*")
        .eq("id", userId)
        .single();

      if (!error && data) {
        return {
          id: data.id,
          name: data.full_name || "Official User",
          designation: data.designation || data.role || "Officer",
          role: (data.role as UserRole) || "REVIEWER",
          bureau: data.bureau_id || "PGRC",
          email: data.email,
          avatarInitials: (data.full_name || "OU").substring(0, 2).toUpperCase(),
        };
      }
    } catch (e) {
      console.warn("Could not fetch user profile from Supabase:", e);
    }
    return null;
  },
};
