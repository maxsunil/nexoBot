
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
            html: `
                <div style="background:#f1f5f9;padding:40px 0;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto;">
                <div style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:16px;box-shadow:0 20px 40px rgba(0,0,0,0.08);overflow:hidden">

                    <!-- Header -->
                    <div style="background:linear-gradient(135deg,#4f46e5,#6366f1);padding:24px;text-align:center">
                    <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:600">
                        Verify your login
                    </h1>
                    </div>

                    <!-- Body -->
                    <div style="padding:32px;color:#334155;font-size:15px;line-height:1.6">
                    <p style="margin-top:0">Hi 👋</p>

                    <p>
                        Use the following One-Time Password (OTP) to complete your login.
                        This OTP is valid for <strong>10 minutes</strong>.
                    </p>

                    <!-- OTP Box -->
                    <div style="margin:28px 0;padding:20px;text-align:center;background:#f8fafc;border-radius:12px;border:1px dashed #c7d2fe">
                        <div style="font-size:32px;font-weight:700;letter-spacing:10px;color:#111827">
                        ${otp}
                        </div>
                        <div style="margin-top:10px;font-size:13px;color:#64748b">
                        Do not share this code with anyone
                        </div>
                    </div>

                    <p>
                        If you didn’t request this login, you can safely ignore this email.
                    </p>

                    <p style="margin-bottom:0">
                        Thanks,<br />
                        <strong>AI Chatbot Team</strong>
                    </p>
                    </div>

                    <!-- Footer -->
                    <div style="background:#f8fafc;padding:16px;text-align:center;font-size:12px;color:#94a3b8">
                    © ${new Date().getFullYear()} AI Chatbot. All rights reserved.
                    </div>

                </div>
                </div>
                `,
        });

        console.log('Message sent: %s', info.messageId);

        return NextResponse.json({ success: true, message: 'OTP sent successfully' });

    } catch (error: any) {
        console.error('Error sending OTP:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
