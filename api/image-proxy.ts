import { IncomingMessage, ServerResponse } from 'http';

// Vercel Node serverless handler (simple express-less handler)
export default async function handler(req: any, res: any) {
  try {
    const url = (req.query && req.query.url) || (req.url && new URL(req.url, 'http://localhost').searchParams.get('url'));
    if (!url) {
      res.statusCode = 400;
      res.setHeader('content-type', 'text/plain');
      res.end('Missing url parameter');
      return;
    }

    // Basic validation
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch (e) {
      res.statusCode = 400;
      res.setHeader('content-type', 'text/plain');
      res.end('Invalid image URL');
      return;
    }

    // Use global fetch (Node 18+ / Vercel runtime). Follow redirects.
    const headers = {
      'User-Agent': 'IndianConstitutionalDirectory/1.0 (contact: aviralsu1996@gmail.com) Node.js/fetch',
      'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9'
    } as Record<string, string>;

    const response = await fetch(parsedUrl.toString(), { method: 'GET', headers, redirect: 'follow' });
    if (!response.ok) {
      res.statusCode = response.status || 500;
      res.setHeader('content-type', 'text/plain');
      res.end(`Failed to fetch image: ${response.statusText}`);
      return;
    }

    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    const cacheControl = response.headers.get('cache-control') || 'public, max-age=86400';

    // Read as buffer and forward
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', cacheControl);
    res.setHeader('Content-Length', String(buffer.length));

    // Vercel expects statusCode to be set before writing
    res.statusCode = 200;
    res.end(buffer);
  } catch (err: any) {
    console.error('Vercel image-proxy error:', err?.message || err);
    res.statusCode = 500;
    res.setHeader('content-type', 'text/plain');
    res.end('Internal Server Error');
  }
}
