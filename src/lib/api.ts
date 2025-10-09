// API client for Vercel serverless functions
// This replaces Supabase Edge Functions calls

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export async function callAPI<T = any>(
  endpoint: string,
  options: {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    body?: any;
    params?: Record<string, string>;
  } = {}
): Promise<{ data: T | null; error: Error | null }> {
  try {
    const { method = 'GET', body, params } = options;

    // Build URL with query params
    const url = new URL(endpoint, window.location.origin);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    const response = await fetch(url.toString(), {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `API error: ${response.status}`);
    }

    return { data, error: null };
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error);
    return { data: null, error: error as Error };
  }
}

// Convenience wrappers that match Supabase functions.invoke() signature
export const api = {
  invoke: async <T = any>(functionName: string, options?: { body?: any }) => {
    return callAPI<T>(`/api/${functionName}`, {
      method: options?.body ? 'POST' : 'GET',
      body: options?.body,
    });
  },
};
