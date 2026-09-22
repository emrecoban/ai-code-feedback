export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

export function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

export interface EdgeError {
  error: string;
  message: string;
  retryAfterSeconds?: number;
}

export function errorResponse(error: string, message: string, status: number, retryAfterSeconds?: number): Response {
  const body: EdgeError = { error, message, ...(retryAfterSeconds ? { retryAfterSeconds } : {}) };
  return json(body, status);
}
