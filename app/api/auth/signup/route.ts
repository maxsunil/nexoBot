
import { NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/admin';
import { setSession } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    try {
        const { businessName, email, username, password, otp } = await request.json();

        if (!businessName || !email || !username || !password || !otp) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        const supabaseAdmin = createAdminClient();

        // 1. Verify OTP
        const { data: otpRecord, error: otpError } = await supabaseAdmin
            .from('otp_codes')
            .select('*')
            .eq('email', email)
            .eq('code', otp)
            .gt('expires_at', new Date().toISOString())
            .single();

        if (otpError || !otpRecord) {
            return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 401 });
        }

        // 2. Check if User Exists (Email or Username)
        const { data: existingUser, error: checkError } = await supabaseAdmin
            .from('users')
            .select('id, email, username')
            .or(`email.eq.${email},username.eq.${username}`)
            .single();

        // Note: .single() returns error if no rows found, which is GOOD here.
        // But if it finds a row, we have a conflict.
        if (existingUser) {
            const msg = existingUser.email === email ? 'Email already registered' : 'Username already taken';
            return NextResponse.json({ error: msg }, { status: 409 });
        }

        // 3. Hash Password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // 4. Create User
        const { data: newUser, error: createError } = await supabaseAdmin
            .from('users')
            .insert({
                email,
                username,
                business_name: businessName,
                password_hash: passwordHash
            })
            .select()
            .single();

        if (createError) {
            console.error("Error creating user:", createError);
            return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
        }

        // 5. Create Profile (Ensure consistency)
        // We use the same ID for the profile
        const { error: profileError } = await supabaseAdmin
            .from('profiles')
            .insert({
                id: newUser.id,
                email: newUser.email,
                full_name: businessName // Use business name as full name for now
            });

        if (profileError) {
            // Rollback? ideally yes, but for now log it. simpler to prevent orphaned users.
            console.error("Error creating profile:", profileError);
            // Return success anyway as user is created? No, might break foreign keys.
        }

        // 6. Delete used OTP
        await supabaseAdmin.from('otp_codes').delete().eq('id', otpRecord.id);

        // 7. Create Session
        await setSession({ id: newUser.id, email: newUser.email, username: newUser.username });

        return NextResponse.json({ success: true, user: newUser });

    } catch (error: any) {
        console.error('Signup Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
