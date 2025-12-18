-- Create FAQs table
CREATE TABLE IF NOT EXISTS public.faqs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    chatbot_id UUID REFERENCES public.chatbots(id) ON DELETE CASCADE NOT NULL,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for FAQs
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

-- FAQ Policies
CREATE POLICY "Users can view FAQs for their chatbots."
    ON faqs FOR SELECT
    USING ( EXISTS ( SELECT 1 FROM chatbots WHERE id = faqs.chatbot_id AND user_id = auth.uid() ) );

CREATE POLICY "Users can insert FAQs for their chatbots."
    ON faqs FOR INSERT
    WITH CHECK ( EXISTS ( SELECT 1 FROM chatbots WHERE id = faqs.chatbot_id AND user_id = auth.uid() ) );

CREATE POLICY "Users can update FAQs for their chatbots."
    ON faqs FOR UPDATE
    USING ( EXISTS ( SELECT 1 FROM chatbots WHERE id = faqs.chatbot_id AND user_id = auth.uid() ) );

CREATE POLICY "Users can delete FAQs for their chatbots."
    ON faqs FOR DELETE
    USING ( EXISTS ( SELECT 1 FROM chatbots WHERE id = faqs.chatbot_id AND user_id = auth.uid() ) );

-- Public read access for FAQs (for the chat widget)
CREATE POLICY "FAQs are viewable by public_id."
    ON faqs FOR SELECT
    USING ( EXISTS ( SELECT 1 FROM chatbots WHERE id = faqs.chatbot_id ) );

-- Update messages table to link to conversations
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE;

-- Create index for conversation lookup
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON public.messages (conversation_id);

-- Update trigger for faqs updated_at
CREATE TRIGGER update_faqs_updated_at
    BEFORE UPDATE ON faqs
    FOR EACH ROW
    EXECUTE FUNCTION update_conversations_updated_at();

-- Function to increment message count safely
CREATE OR REPLACE FUNCTION public.increment_message_count(conv_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.conversations
  SET message_count = message_count + 1
  WHERE id = conv_id;
END;
$$;
