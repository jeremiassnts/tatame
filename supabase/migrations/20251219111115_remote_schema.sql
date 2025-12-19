alter table "public"."users" add column "approved_at" date;

alter table "public"."users" add column "denied_at" date;


  create policy "Enable delete for authenticated users only"
  on "public"."checkins"
  as permissive
  for delete
  to authenticated
using (true);



