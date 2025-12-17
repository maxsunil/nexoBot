
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { createAdminClient } from '@/utils/supabase/admin';

const port = parseInt(process.env.SMTP_PORT || '587');
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.unosend.com',
    port: port,
    secure: port === 465, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
});

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit OTP
        // Expires in 10 minutes
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

        const supabaseAdmin = createAdminClient();

        // Store OTP in Database (using service role to bypass RLS)
        const { error: dbError } = await supabaseAdmin
            .from('otp_codes')
            .insert({
                email,
                code: otp,
                expires_at: expiresAt,
            });

        if (dbError) {
            console.error('Database Error:', dbError);
            return NextResponse.json({ error: 'Failed to generate OTP' }, { status: 500 });
        }

        // Send Email via Nodemailer
        const info = await transporter.sendMail({
            from: process.env.SMTP_FROM || '"AI Chatbot" <noreply@ai-chatbot.com>',
            to: email,
            subject: 'Your Login OTP',
            text: `Your login OTP is: ${otp}. It expires in 10 minutes.`,
            html: `<p>Your login OTP is: <strong>${otp}</strong></p><p>It expires in 10 minutes.</p>`,
        });

        console.log('Message sent: %s', info.messageId);

        return NextResponse.json({ success: true, message: 'OTP sent successfully' });

    } catch (error: any) {
        console.error('Error sending OTP:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
