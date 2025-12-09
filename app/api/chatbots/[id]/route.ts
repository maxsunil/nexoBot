import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        if (!id) {
            return new Response('Chatbot ID is required', { status: 400 });
        }

        const supabase = await createClient();

        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            return new Response('Unauthorized', { status: 401 });
        }

        // Verify that this chatbot belongs to the user
        const { data: chatbot, error: fetchError } = await supabase
            .from('chatbots')
            .select('id, user_id, name')
            .eq('id', id)
            .single();

        if (fetchError || !chatbot) {
            return new Response('Chatbot not found', { status: 404 });
        }

        // Check if the chatbot belongs to the current user
        if (chatbot.user_id !== user.id) {
            return new Response('Forbidden: You do not own this chatbot', { status: 403 });
        }

        // Delete the chatbot (conversations and messages will cascade delete)
        const { error: deleteError } = await supabase
            .from('chatbots')
            .delete()
            .eq('id', id);

        if (deleteError) {
            console.error('Error deleting chatbot:', deleteError);
            return new Response('Error deleting chatbot', { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: 'Chatbot deleted successfully',
            chatbotName: chatbot.name
        });
    } catch (error) {
        console.error('Error in chatbot delete API:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
}
