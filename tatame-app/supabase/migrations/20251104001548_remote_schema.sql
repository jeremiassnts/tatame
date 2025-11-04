
  create policy "Enable insert for authenticated users only"
  on "public"."class"
  as permissive
  for insert
  to authenticated
with check (true);



  create policy "Enable read access for all users"
  on "public"."class"
  as permissive
  for select
  to public
using (true);



