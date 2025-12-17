
import { NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/admin';
import { setSession } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const { email, otp } = await request.json();

        if (!email || !otp) {
            return NextResponse.json({ error: 'Email and OTP are required' }, { status: 400 });
        }

        const supabaseAdmin = createAdminClient();

        // 1. Verify OTP
        const { data: otpRecord, error: otpError } = await supabaseAdmin
            .from('otp_codes')
            .select('*')
            .eq('email', email)
            .eq('code', otp)
            .gt('expires_at', new Date().toISOString()) // Check expiry
            .single();

        if (otpError || !otpRecord) {
            return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 401 });
        }

        // 2. Delete used OTP (Optional: or mark as used)
        await supabaseAdmin.from('otp_codes').delete().eq('id', otpRecord.id);

        // 3. Find or Create User
        let { data: user, error: userError } = await supabaseAdmin
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (!user) {
            // Create new user
            const { data: newUser, error: createError } = await supabaseAdmin
                .from('users')
                .insert({ email })
                .select()
                .single();

            if (createError) {
                console.error("Error creating user:", createError);
                return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
            }
            user = newUser;

            // Migrate/Create Profile
            // Trigger should handle profile creation if set up, but let's be explicit/safe due to our custom logic
            // Check if profile exists (from potential previous Auth.users)
            const { data: existingProfile } = await supabaseAdmin
                .from('profiles')
                .select('*')
                .eq('email', email) // Assuming email in profiles is populated
                .single();

            if (!existingProfile) {
                await supabaseAdmin.from('profiles').insert({
                    id: user.id, // SAME ID as user
                    email: user.email,
                    full_name: '' // Placeholder
                });
            }
        }

        // 4. Create Session (JWT Cookie)
        await setSession({ id: user.id, email: user.email });

        return NextResponse.json({ success: true, user });

    } catch (error: any) {
        console.error('Verify OTP Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
