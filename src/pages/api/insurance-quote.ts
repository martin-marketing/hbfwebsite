import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { supabaseServer } from '@/lib/supabase-server';

export const prerender = false;

const INSURANCE_TYPE_LABELS: Record<string, string> = {
  life: 'Life Insurance',
  life_ci: 'Life + Critical Illness Insurance',
  ci: 'Critical Illness Insurance',
  disability: 'Disability Insurance',
  life_no_medical: 'Life Insurance (No Medical)',
  combination: 'Combination (multiple types)',
};

export const POST: APIRoute = async ({ request }) => {
  const resendKey = import.meta.env.RESEND_API_KEY;
  const resend = resendKey ? new Resend(resendKey) : null;

  let body: Record<string, string>;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request' }), { status: 400 });
  }

  const {
    first_name, last_name, email, phone,
    insurance_type, dob, sex, health, smoker, coverage_amount, comments,
    casl_consent, 'cf-turnstile-response': turnstileToken,
  } = body;

  // Verify Turnstile token when secret is configured
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
  }

  if (!first_name?.trim() || !last_name?.trim() || !email?.trim() || !phone?.trim() || !insurance_type?.trim()) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return new Response(JSON.stringify({ error: 'Invalid email address' }), { status: 400 });
  }

  const typeLabel = INSURANCE_TYPE_LABELS[insurance_type] ?? insurance_type;

  // Build a plain-text summary for Supabase storage
  const messageSummary = [
    `Insurance Type: ${typeLabel}`,
    dob ? `Date of Birth: ${dob}` : null,
    sex ? `Sex: ${sex}` : null,
    health ? `Health: ${health}` : null,
    smoker ? `Smoker: ${smoker}` : null,
    coverage_amount ? `Coverage Amount: ${coverage_amount}` : null,
    comments?.trim() ? `Notes: ${comments.trim()}` : null,
  ].filter(Boolean).join('\n');

  const errors: string[] = [];

  if (supabaseServer) {
    const { error: dbError } = await supabaseServer.rpc('insert_contact_submission', {
      p_first_name: first_name.trim(),
      p_last_name: last_name.trim(),
      p_email: email.trim().toLowerCase(),
      p_phone: phone.trim(),
      p_message: messageSummary,
      p_casl_consent: casl_consent === 'on' || casl_consent === 'true',
    });
    if (dbError) errors.push(`DB: ${dbError.message}`);
  }

  if (!resend) {
    errors.push('Email: RESEND_API_KEY not configured');
  } else {
    const { error: emailError } = await resend.emails.send({
      from: 'Insurance Quote Form <noreply@heidiblondin.com>',
      to: ['angela@heidiblondin.com', 'jack@heidiblondin.com'],
      replyTo: email.trim(),
      subject: `New insurance quote request — ${first_name} ${last_name}`,
      html: `
        <table style="font-family:sans-serif;font-size:15px;line-height:1.6;color:#1a1a2e;max-width:600px">
          <tr><td style="padding:24px 0 8px"><strong>Name:</strong> ${first_name} ${last_name}</td></tr>
          <tr><td><strong>Email:</strong> <a href="mailto:${email}">${email}</a></td></tr>
          <tr><td><strong>Phone:</strong> <a href="tel:${phone}">${phone}</a></td></tr>
          <tr><td style="padding-top:12px"><strong>Insurance Type:</strong> ${typeLabel}</td></tr>
          ${dob ? `<tr><td><strong>Date of Birth:</strong> ${dob}</td></tr>` : ''}
          ${sex ? `<tr><td><strong>Sex:</strong> ${sex}</td></tr>` : ''}
          ${health ? `<tr><td><strong>Health:</strong> ${health}</td></tr>` : ''}
          ${smoker ? `<tr><td><strong>Smoker:</strong> ${smoker}</td></tr>` : ''}
          ${coverage_amount ? `<tr><td><strong>Coverage Amount:</strong> ${coverage_amount}</td></tr>` : ''}
          ${comments?.trim() ? `<tr><td style="padding-top:16px"><strong>Additional Notes:</strong></td></tr><tr><td style="white-space:pre-wrap;padding-bottom:12px">${comments.trim()}</td></tr>` : ''}
          <tr><td style="color:#666;font-size:13px">CASL consent: ${casl_consent === 'on' || casl_consent === 'true' ? 'Yes' : 'No'}</td></tr>
        </table>
      `,
    });
    if (emailError) errors.push(`Email: ${emailError.message}`);
  }

  if (errors.length === 2) {
    console.error('Insurance quote errors:', errors);
    return new Response(JSON.stringify({ error: 'Submission failed' }), { status: 500 });
  }

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
};
