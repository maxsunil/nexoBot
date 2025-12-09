import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        if (!id) {
            return new Response('Conversation ID is required', { status: 400 });
        }

        const supabase = await createClient();

        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            return new Response('Unauthorized', { status: 401 });
        }

        // First, verify that this conversation belongs to a chatbot owned by the user
        const { data: conversation, error: fetchError } = await supabase
            .from('conversations')
            .select(`
        id,
        chatbot_id,
        chatbots (
          user_id
        )
      `)
            .eq('id', id)
            .single();

        if (fetchError || !conversation) {
            return new Response('Conversation not found', { status: 404 });
        }

        // Check if the chatbot belongs to the current user
        const chatbot = conversation.chatbots as any;
        if (!chatbot || chatbot.user_id !== user.id) {
            return new Response('Forbidden: You do not own this conversation', { status: 403 });
        }

        // Delete the conversation (messages will cascade delete due to DB constraints)
        const { error: deleteError } = await supabase
            .from('conversations')
            .delete()
            .eq('id', id);

        if (deleteError) {
            console.error('Error deleting conversation:', deleteError);
            return new Response('Error deleting conversation', { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: 'Conversation deleted successfully'
        });
    } catch (error) {
        console.error('Error in conversation delete API:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
}
