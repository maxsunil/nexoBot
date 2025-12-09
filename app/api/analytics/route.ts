import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    try {
        const supabase = await createClient();

        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            return new Response('Unauthorized', { status: 401 });
        }

        // Get user's chatbots
        const { data: chatbots, error: chatbotsError } = await supabase
            .from('chatbots')
            .select('id, name')
            .eq('user_id', user.id);

        if (chatbotsError) {
            console.error('Error fetching chatbots:', chatbotsError);
            return new Response('Error fetching chatbots', { status: 500 });
        }

        if (!chatbots || chatbots.length === 0) {
            return NextResponse.json({
                totalChatbots: 0,
                totalConversations: 0,
                totalMessages: 0,
                chatbotStats: [],
                recentActivity: []
            });
        }

        const chatbotIds = chatbots.map(bot => bot.id);

        // Get conversations for user's chatbots
        const { data: conversations, error: conversationsError } = await supabase
            .from('conversations')
            .select('chatbot_id, message_count, created_at')
            .in('chatbot_id', chatbotIds);

        if (conversationsError) {
            console.error('Error fetching conversations:', conversationsError);
            return new Response('Error fetching conversations', { status: 500 });
        }

        // Get messages count
        const { data: messages, error: messagesError } = await supabase
            .from('messages')
            .select('chatbot_id, created_at')
            .in('chatbot_id', chatbotIds);

        if (messagesError) {
            console.error('Error fetching messages:', messagesError);
        }

        // Calculate statistics
        const totalConversations = conversations?.length || 0;
        const totalMessages = conversations?.reduce((sum, conv) => sum + (conv.message_count || 0), 0) || 0;

        // Calculate per-chatbot stats
        const chatbotStats = chatbots.map(bot => {
            const botConversations = conversations?.filter(conv => conv.chatbot_id === bot.id) || [];
            const botMessages = botConversations.reduce((sum, conv) => sum + (conv.message_count || 0), 0);

            return {
                chatbotId: bot.id,
                chatbotName: bot.name,
                conversationCount: botConversations.length,
                messageCount: botMessages
            };
        }).filter(stat => stat.conversationCount > 0);

        // Get recent activity (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const recentConversations = conversations?.filter(conv =>
            new Date(conv.created_at) >= sevenDaysAgo
        ) || [];

        const dailyStats = Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (6 - i));
            date.setHours(0, 0, 0, 0);

            const nextDate = new Date(date);
            nextDate.setDate(nextDate.getDate() + 1);

            const dayConversations = recentConversations.filter(conv => {
                const convDate = new Date(conv.created_at);
                return convDate >= date && convDate < nextDate;
            });

            return {
                label: date.toLocaleDateString('en-US', { weekday: 'short' }),
                value: dayConversations.length
            };
        });

        return NextResponse.json({
            totalChatbots: chatbots.length,
            totalConversations,
            totalMessages,
            chatbotStats,
            dailyStats,
            recentActivity: recentConversations.slice(0, 10)
        });
    } catch (error) {
        console.error('Error in analytics API:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
}
