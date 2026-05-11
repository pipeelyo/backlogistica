import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { RealtimeClientOptions } from '@supabase/realtime-js';
import WebSocket from 'ws';

/** Cliente con **service_role** (admin: crear usuarios en Auth). */
export function createSupabaseServiceClient(url: string, serviceRoleKey: string): SupabaseClient {
  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    realtime: {
      transport: WebSocket as unknown as NonNullable<RealtimeClientOptions['transport']>,
    },
  });
}

/** Cliente **anon** (login `signInWithPassword`). */
export function createSupabaseAnonClient(url: string, anonKey: string): SupabaseClient {
  return createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    realtime: {
      transport: WebSocket as unknown as NonNullable<RealtimeClientOptions['transport']>,
    },
  });
}
