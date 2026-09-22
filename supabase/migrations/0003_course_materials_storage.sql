-- Course content lives as files in Storage, never as rows in Postgres --
-- the instructor's upload workflow is literally "drag .md files into this
-- bucket in the Supabase dashboard." No metadata table: Storage's own
-- object listing already gives filename, size, and upload time, and a
-- simple filename convention ("01-introduction.md") is enough for
-- ordering and titles -- the simpler of the two options requested.
insert into storage.buckets (id, name, public)
values ('course-materials', 'course-materials', false)
on conflict (id) do nothing;

create policy course_materials_read on storage.objects
  for select to authenticated
  using (bucket_id = 'course-materials');
