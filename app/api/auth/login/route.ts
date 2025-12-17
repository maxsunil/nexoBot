
import { NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/admin';
import { setSession } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    try {
        const { username, password } = await request.json();

        if (!username || !password) {
            return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
        }

        const supabaseAdmin = createAdminClient();

        // 1. Find User by Username
        const { data: user, error: userError } = await supabaseAdmin
            .from('users')
            .select('*')
            .eq('username', username)
            .single();

        if (userError || !user) {
            return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
        }

        // 2. Verify Password
        if (!user.password_hash) {
            // Handle migration case or legacy users without password
            return NextResponse.json({ error: 'Please login via OTP or reset password' }, { status: 401 });
        }

        const validPassword = await bcrypt.compare(password, user.password_hash);

        if (!validPassword) {
            return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
        }

        // 3. Create Session
        await setSession({ id: user.id, email: user.email, username: user.username });

        return NextResponse.json({ success: true, user });

    } catch (error: any) {
        console.error('Login Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
