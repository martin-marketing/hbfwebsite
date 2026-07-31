import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { supabaseServer } from '@/lib/supabase-server';

export const prerender = false;

function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const ATTRIBUTION_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'gclid',
  'referrer',
  'landing_page',
] as const;

function buildAttributionHtml(attribution: Record<string, unknown> | undefined | null): string {
  if (!attribution || typeof attribution !== 'object') return '';
  const rows = ATTRIBUTION_KEYS
    .map((key) => {
      const raw = attribution[key];
      if (typeof raw !== 'string' || !raw.trim()) return null;
      const value = raw.trim().slice(0, 300);
      return `<tr><td style="padding:2px 0"><strong>${escapeHtml(key)}:</strong> ${escapeHtml(value)}</td></tr>`;
    })
    .filter(Boolean)
    .join('');
  if (!rows) return '';
  return `
      <table style="font-family:sans-serif;font-size:13px;line-height:1.5;color:#444;max-width:600px;margin-top:16px;border-top:1px solid #ddd;padding-top:12px">
        <tr><td style="padding-bottom:4px"><strong>Lead source</strong></td></tr>
        ${rows}
      </table>
    `;
}

export const POST: APIRoute = async ({ request }) => {
  const resendKey = import.meta.env.RESEND_API_KEY;
  const resend = resendKey ? new Resend(resendKey) : null;
  let body: Record<string, any>;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request' }), { status: 400 });
  }

  const { first_name, last_name, email, phone, message, casl_consent, attribution, 'cf-turnstile-response': turnstileToken } = body;

  // Verify Turnstile token
  const turnstileSecret = import.meta.env.TURNSTILE_SECRET_KEY;
  if (turnstileSecret) {
    const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret: turnstileSecret, response: turnstileToken }),
    });
    const verifyData = await verifyRes.json();
    if (!verifyData.success) {
      return new Response(JSON.stringify({ error: 'Bot check failed. Please try again.' }), { status: 400 });
    }
  } else if (import.meta.env.PROD) {
    console.error('Contact form: TURNSTILE_SECRET_KEY not configured in production');
    return new Response(JSON.stringify({ error: 'Server misconfiguration' }), { status: 500 });
  }

  // Basic server-side validation
  if (!first_name?.trim() || !last_name?.trim() || !email?.trim() || !phone?.trim() || !message?.trim()) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return new Response(JSON.stringify({ error: 'Invalid email address' }), { status: 400 });
  }
  if ([first_name, last_name, email, phone].some((v) => typeof v === 'string' && v.length > 200)) {
    return new Response(JSON.stringify({ error: 'Field too long' }), { status: 400 });
  }
  if (typeof message === 'string' && message.length > 5000) {
    return new Response(JSON.stringify({ error: 'Field too long' }), { status: 400 });
  }

  const errors: string[] = [];

  // Store lead in Supabase private schema
  if (supabaseServer) {
    const { error: dbError } = await supabaseServer.rpc('insert_contact_submission', {
      p_first_name: first_name.trim(),
      p_last_name: last_name.trim(),
      p_email: email.trim().toLowerCase(),
      p_phone: phone.trim(),
      p_message: message.trim(),
      p_casl_consent: casl_consent === 'on' || casl_consent === 'true',
    });
    if (dbError) errors.push(`DB: ${dbError.message}`);
  }

  // Send email notification via Resend
  if (!resend) {
    errors.push('Email: RESEND_API_KEY not configured');
  } else {
  const { error: emailError } = await resend.emails.send({
    from: 'Contact Form <noreply@heidiblondin.com>',
    to: 'heidi@heidiblondin.com',
    replyTo: email.trim(),
    subject: `New contact form submission — ${escapeHtml(first_name)} ${escapeHtml(last_name)}`,
    html: `
      <table style="font-family:sans-serif;font-size:15px;line-height:1.6;color:#1a1a2e;max-width:600px">
        <tr><td style="padding:24px 0 8px"><strong>Name:</strong> ${escapeHtml(first_name)} ${escapeHtml(last_name)}</td></tr>
        <tr><td><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
        <tr><td><strong>Phone:</strong> <a href="tel:${escapeHtml(phone)}">${escapeHtml(phone)}</a></td></tr>
        <tr><td style="padding-top:16px"><strong>Message:</strong></td></tr>
        <tr><td style="padding:8px 0 16px;white-space:pre-wrap">${escapeHtml(message)}</td></tr>
        <tr><td style="color:#666;font-size:13px">CASL consent: ${casl_consent === 'on' || casl_consent === 'true' ? 'Yes' : 'No'}</td></tr>
      </table>
      ${buildAttributionHtml(attribution)}
    `,
  });
  if (emailError) errors.push(`Email: ${emailError.message}`);
  }

  // Return 200 as long as at least one succeeded
  if (errors.length === 2) {
    console.error('Contact form errors:', errors);
    return new Response(JSON.stringify({ error: 'Submission failed' }), { status: 500 });
  }

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
};
