import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

const resend = new Resend(process.env.RESEND_API_KEY);

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { email } = req.body ?? {};

    if (!email || typeof email !== 'string' || !isValidEmail(email)) {
        return res.status(400).json({ error: 'Invalid email address.' });
    }

    const normalised = email.trim().toLowerCase();

    const { error: dbError } = await supabase
        .from('subscribers')
        .insert({ email: normalised });

    if (dbError) {
        // unique violation — already subscribed, return success to avoid enumeration
        if (dbError.code === '23505') {
            return res.status(200).json({ ok: true });
        }
        console.error('Supabase insert error:', dbError);
        return res.status(500).json({ error: 'Could not save subscription.' });
    }

    const { error: emailError } = await resend.emails.send({
        from: 'Chandan Joshi <hello@chandanjoshi.dev>',
        to: normalised,
        subject: "You're subscribed to Chandan's logs",
        html: `
            <p style="font-family: monospace; color: #111; line-height: 1.8;">
                Hey — you're in.<br/><br/>
                I write postmortems, engineering notes, and the occasional opinion
                at <a href="${process.env.VITE_SITE_URL}/blog">${process.env.VITE_SITE_URL}/blog</a>.<br/><br/>
                You'll hear from me when I publish something new. No newsletters,
                no cadence — just posts.<br/><br/>
                — Chandan
            </p>
        `,
    });

    if (emailError) {
        // subscriber saved — failed welcome email is non-fatal
        console.error('Resend welcome email error:', emailError);
    }

    return res.status(200).json({ ok: true });
}
