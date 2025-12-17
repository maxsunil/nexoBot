
import { NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/admin';
import { getSession } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { name, brandName, description, systemPrompt } = body;

        if (!name || !brandName || !description) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const supabase = createAdminClient();

        const { data, error } = await supabase
            .from('chatbots')
            .insert({
                user_id: session.id,
                name,
                brand_name: brandName,
                description,
                system_prompt: systemPrompt
            })
            .select() // return the created row
            .single();

        if (error) {
            console.error('Error creating chatbot:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, chatbot: data });
    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
