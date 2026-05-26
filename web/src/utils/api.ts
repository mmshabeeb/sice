/**
 * A wrapper around fetch that automatically prefixes relative paths with the NEXT_PUBLIC_BASE_PATH.
 * This is useful for deploying the application under a sub-URI (like /testing) on Hostinger.
 */
export function apiFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  let url = input;
  
  if (typeof input === 'string' && input.startsWith('/')) {
    url = `${basePath}${input}`;
  } else if (input instanceof URL && input.pathname.startsWith('/')) {
    url = new URL(`${basePath}${input.pathname}${input.search}${input.hash}`, input.origin);
  }
  
  return fetch(url, init);
}
