-- Create profiles table
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  full_name text,
  email text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Profiles policies
create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Create chatbots table
create table public.chatbots (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  brand_name text not null,
  description text,
  system_prompt text,
  public_id uuid default gen_random_uuid() not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.chatbots enable row level security;

-- Chatbots policies
create policy "Users can view their own chatbots."
  on chatbots for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own chatbots."
  on chatbots for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own chatbots."
  on chatbots for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own chatbots."
  on chatbots for delete
  using ( auth.uid() = user_id );

-- Public read access for widget (by public_id)
create policy "Chatbots are viewable by public_id."
  on chatbots for select
  using ( true );

-- Create messages table
create table public.messages (
  id uuid default gen_random_uuid() primary key,
  chatbot_id uuid references public.chatbots(id) on delete cascade not null,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.messages enable row level security;

-- Messages policies
create policy "Users can view messages for their chatbots."
  on messages for select
  using ( exists ( select 1 from chatbots where id = messages.chatbot_id and user_id = auth.uid() ) );

-- Trigger to handle new user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
