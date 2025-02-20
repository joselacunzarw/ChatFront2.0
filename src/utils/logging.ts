/**
 * @author Jose Lacunza Kobs
 * @description Utility functions for logging and formatting debug information
 */

export function formatRequestLog(request: any): string {
  const timestamp = new Date().toISOString();
  const headers = request.headers || {};
  const method = request.method || 'GET';
  const url = request.url || '';
  
  let body = '';
  if (request.body) {
    try {
      body = JSON.stringify(JSON.parse(request.body), null, 2);
    } catch {
      body = request.body;
    }
  }

  const parts = [
    `Timestamp: ${timestamp}`,
    `URL: ${url}`,
    `Method: ${method}`,
    'Headers:',
    ...Object.entries(headers).map(([key, value]) => `  ${key}: ${value}`),
  ];

  if (body) {
    parts.push('', 'Body:', body);
  }

  return parts.join('\n');
}

export function formatError(error: any): string {
  if (error instanceof Error) {
    return `${error.name}: ${error.message}\n${error.stack || ''}`;
  }
  return String(error);
}