-- 1. Create lead_submissions table
create table public.lead_submissions (
    id uuid primary key default gen_random_uuid(),
    created_at timestamptz default now(),
    name text not null,
    email text not null,
    service_slug text not null,
    tier text not null,
    message text,
    status text default 'new'
);

-- 2. Grant permissions
grant select, insert, update, delete on public.lead_submissions to authenticated;
grant all on public.lead_submissions to service_role;
grant insert on public.lead_submissions to anon;

-- 3. Enable RLS
alter table public.lead_submissions enable row level security;

-- 4. Policies
create policy "Authenticated users can read all leads"
on public.lead_submissions for select to authenticated using (true);

create policy "Authenticated users can update leads"
on public.lead_submissions for update to authenticated using (true);

create policy "Anyone can insert a lead"
on public.lead_submissions for insert to anon with check (true);
