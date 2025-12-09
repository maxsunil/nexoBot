-- Insert missing profiles for existing auth users
insert into public.profiles (id, email, full_name)
select 
  id, 
  email, 
  raw_user_meta_data->>'full_name'
from auth.users
where id not in (select id from public.profiles);

-- Verify the fix
select count(*) as profiles_count from public.profiles;
