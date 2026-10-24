-- Private legal documents bucket. No public URLs.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'legal-documents',
  'legal-documents',
  false,
  20971520,
  array[
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
on conflict (id) do nothing;

-- Path convention: {firm_id}/{document_id}/{filename}
create policy legal_documents_select on storage.objects
for select using (
  bucket_id = 'legal-documents'
  and public.is_firm_member((storage.foldername(name))[1]::uuid)
);

create policy legal_documents_insert on storage.objects
for insert with check (
  bucket_id = 'legal-documents'
  and public.has_firm_role(
    (storage.foldername(name))[1]::uuid,
    array['owner', 'office_manager', 'lawyer', 'secretary']::public.user_role[]
  )
);

create policy legal_documents_update on storage.objects
for update using (
  bucket_id = 'legal-documents'
  and public.has_firm_role(
    (storage.foldername(name))[1]::uuid,
    array['owner', 'office_manager', 'lawyer', 'secretary']::public.user_role[]
  )
);

create policy legal_documents_delete on storage.objects
for delete using (
  bucket_id = 'legal-documents'
  and public.has_firm_role(
    (storage.foldername(name))[1]::uuid,
    array['owner', 'office_manager', 'lawyer', 'secretary']::public.user_role[]
  )
);
