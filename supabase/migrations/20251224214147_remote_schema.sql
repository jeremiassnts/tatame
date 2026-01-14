
  create policy "Enable insert for authenticated users only"
  on "public"."notifications"
  as permissive
  for insert
  to authenticated
with check (true);



  create policy "Enable read access for all users"
  on "public"."notifications"
  as permissive
  for select
  to public
using (true);



  create policy "Enable update for authenticated users only"
  on "public"."notifications"
  as permissive
  for update
  to authenticated
using (true)
with check (true);



