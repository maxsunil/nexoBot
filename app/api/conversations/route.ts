import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get('limit') || '10');
        const chatbotId = searchParams.get('chatbot_id');

        const supabase = await createClient();

        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            return new Response('Unauthorized', { status: 401 });
        }

        // Build query
        let query = supabase
            .from('conversations')
            .select(`
        *,
        chatbots (
          id,
          name,
          brand_name
        )
      `)
            .order('created_at', { ascending: false })
            .limit(limit);

        // Filter by chatbot if specified
        if (chatbotId) {
            query = query.eq('chatbot_id', chatbotId);
        }

        const { data: conversations, error } = await query;

        if (error) {
            console.error('Error fetching conversations:', error);
            return new Response('Error fetching conversations', { status: 500 });
        }

        // Filter to only include conversations from user's chatbots
        const userConversations = conversations?.filter(conv =>
            conv.chatbots && 'id' in conv.chatbots
        ) || [];

        return NextResponse.json(userConversations);
    } catch (error) {
        console.error('Error in conversations API:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { chatbot_id, session_id, user_identifier, first_message } = await req.json();

        if (!chatbot_id || !session_id) {
            return new Response('Missing required fields', { status: 400 });
        }

        const supabase = await createClient();

        // Check if conversation already exists
        const { data: existing } = await supabase
            .from('conversations')
            .select('id')
            .eq('session_id', session_id)
            .single();

        if (existing) {
            return NextResponse.json(existing);
        }

        // Create new conversation
        const { data: conversation, error } = await supabase
            .from('conversations')
            .insert({
                chatbot_id,
                session_id,
                user_identifier,
                first_message,
                message_count: 1,
            })
            .select()
            .single();

        if (error) {
            console.error('Error creating conversation:', error);
            return new Response('Error creating conversation', { status: 500 });
        }

        return NextResponse.json(conversation);
    } catch (error) {
        console.error('Error in conversations API:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const { session_id, message_count, summary } = await req.json();

        if (!session_id) {
            return new Response('Missing session_id', { status: 400 });
        }

        const supabase = await createClient();

        const updateData: any = {};
        if (message_count !== undefined) updateData.message_count = message_count;
        if (summary !== undefined) updateData.summary = summary;

        const { data: conversation, error } = await supabase
            .from('conversations')
            .update(updateData)
            .eq('session_id', session_id)
            .select()
            .single();

        if (error) {
            console.error('Error updating conversation:', error);
            return new Response('Error updating conversation', { status: 500 });
        }

        return NextResponse.json(conversation);
    } catch (error) {
        console.error('Error in conversations API:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
}
