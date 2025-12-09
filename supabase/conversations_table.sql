-- Create conversations table for tracking chat sessions
create table public.conversations (
  id uuid default gen_random_uuid() primary key,
  chatbot_id uuid references public.chatbots(id) on delete cascade not null,
  session_id text not null unique,
  user_identifier text,
  message_count integer default 0,
  first_message text,
  summary text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.conversations enable row level security;

-- Conversations policies
create policy "Users can view conversations for their chatbots."
  on conversations for select
  using ( exists ( select 1 from chatbots where id = conversations.chatbot_id and user_id = auth.uid() ) );

create policy "Anyone can insert conversations."
  on conversations for insert
  with check ( true );

create policy "Anyone can update conversations."
  on conversations for update
  using ( true );

create policy "Users can delete conversations for their chatbots."
  on conversations for delete
  using ( exists ( select 1 from chatbots where id = conversations.chatbot_id and user_id = auth.uid() ) );

-- Create index for faster queries
create index conversations_chatbot_id_idx on conversations(chatbot_id);
create index conversations_session_id_idx on conversations(session_id);
create index conversations_created_at_idx on conversations(created_at desc);

-- Function to update updated_at timestamp
create or replace function update_conversations_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

-- Trigger to automatically update updated_at
create trigger update_conversations_updated_at
  before update on conversations
  for each row
  execute function update_conversations_updated_at();
