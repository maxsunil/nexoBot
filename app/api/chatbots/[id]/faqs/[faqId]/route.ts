import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string; faqId: string }> }
) {
    try {
        const { faqId } = await params;
        const { question, answer } = await req.json();

        const supabase = await createClient();

        const updateData: any = {};
        if (question !== undefined) updateData.question = question;
        if (answer !== undefined) updateData.answer = answer;

        const { data: faq, error } = await supabase
            .from('faqs')
            .update(updateData)
            .eq('id', faqId)
            .select()
            .single();

        if (error) {
            console.error('Error updating FAQ:', error);
            return new Response('Error updating FAQ', { status: 500 });
        }

        return NextResponse.json(faq);
    } catch (error) {
        console.error('Error in FAQ PATCH API:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string; faqId: string }> }
) {
    try {
        const { faqId } = await params;
        const supabase = await createClient();

        const { error } = await supabase
            .from('faqs')
            .delete()
            .eq('id', faqId);

        if (error) {
            console.error('Error deleting FAQ:', error);
            return new Response('Error deleting FAQ', { status: 500 });
        }

        return new Response(null, { status: 204 });
    } catch (error) {
        console.error('Error in FAQ DELETE API:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
}
