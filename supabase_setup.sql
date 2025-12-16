-- Create the table
create table research_papers (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  author text not null,
  date date not null,
  abstract text not null,
  tags text[] default '{}',
  image_url text,
  pdf_url text,
  video_url text
);

-- Enable Row Level Security (RLS)
alter table research_papers enable row level security;

-- Policy: Everyone can view papers
create policy "Public papers are viewable by everyone"
  on research_papers for select
  to public
  using (true);

-- Policy: Only signed in users (Admins) can insert/delete
create policy "Admins can insert papers"
  on research_papers for insert
  to authenticated
  with check (true);

create policy "Admins can delete papers"
  on research_papers for delete
  to authenticated
  using (true);

-- Policy: Admins can update papers
create policy "Admins can update papers"
  on research_papers for update
  to authenticated
  using (true);

-- Create the global_conferences table
create table global_conferences (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  date date not null,
  location text not null,
  description text,
  link text
);

-- Enable Row Level Security (RLS) for global_conferences
alter table global_conferences enable row level security;

-- Policy: Everyone can view global_conferences
create policy "Public global_conferences are viewable by everyone"
  on global_conferences for select
  to public
  using (true);

-- Policy: Admins can insert global_conferences
create policy "Admins can insert global_conferences"
  on global_conferences for insert
  to authenticated
  with check (true);

-- Policy: Admins can update global_conferences
create policy "Admins can update global_conferences"
  on global_conferences for update
  to authenticated
  using (true);

-- Policy: Admins can delete global_conferences
create policy "Admins can delete global_conferences"
  on global_conferences for delete
  to authenticated
  using (true);

-- Create the events table
create table events (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  date date not null,
  location text not null,
  description text
);

-- Enable Row Level Security (RLS) for events
alter table events enable row level security;

-- Policy: Everyone can view events
create policy "Public events are viewable by everyone"
  on events for select
  to public
  using (true);

-- Policy: Admins can insert events
create policy "Admins can insert events"
  on events for insert
  to authenticated
  with check (true);

-- Policy: Admins can update events
create policy "Admins can update events"
  on events for update
  to authenticated
  using (true);

-- Policy: Admins can delete events
create policy "Admins can delete events"
  on events for delete
  to authenticated
  using (true);

-- Create the faqs table
create table faqs (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  question text not null,
  answer text not null
);

-- Enable Row Level Security (RLS) for faqs
alter table faqs enable row level security;

-- Policy: Everyone can view faqs
create policy "Public faqs are viewable by everyone"
  on faqs for select
  to public
  using (true);

-- Policy: Admins can insert faqs
create policy "Admins can insert faqs"
  on faqs for insert
  to authenticated
  with check (true);

-- Policy: Admins can update faqs
create policy "Admins can update faqs"
  on faqs for update
  to authenticated
  using (true);

-- Policy: Admins can delete faqs
create policy "Admins can delete faqs"
  on faqs for delete
  to authenticated
  using (true);