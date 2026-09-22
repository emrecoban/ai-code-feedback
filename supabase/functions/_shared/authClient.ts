import { createClient, type SupabaseClient } from 'jsr:@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

let adminClient: SupabaseClient | null = null;

/** Service-role client -- bypasses RLS. Used for every write the client
 * itself isn't allowed to make directly (base spec §5.3). */
export function getAdminClient(): SupabaseClient {
  if (!adminClient) {
    adminClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
  }
  return adminClient;
}

export class UnauthenticatedError extends Error {}

/** Verifies the caller's JWT and returns their user id. Never trusts a
 * userId supplied in the request body. */
export async function verifyUser(req: Request): Promise<{ userId: string }> {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) throw new UnauthenticatedError('Missing Authorization header');

  const token = authHeader.replace('Bearer ', '');
  const { data, error } = await getAdminClient().auth.getUser(token);
  if (error || !data?.user) throw new UnauthenticatedError('Invalid or expired session');

  return { userId: data.user.id };
}
