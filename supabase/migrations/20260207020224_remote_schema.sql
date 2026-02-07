revoke delete on table "public"."user_plans" from "anon";

revoke insert on table "public"."user_plans" from "anon";

revoke references on table "public"."user_plans" from "anon";

revoke select on table "public"."user_plans" from "anon";

revoke trigger on table "public"."user_plans" from "anon";

revoke truncate on table "public"."user_plans" from "anon";

revoke update on table "public"."user_plans" from "anon";

revoke delete on table "public"."user_plans" from "authenticated";

revoke insert on table "public"."user_plans" from "authenticated";

revoke references on table "public"."user_plans" from "authenticated";

revoke select on table "public"."user_plans" from "authenticated";

revoke trigger on table "public"."user_plans" from "authenticated";

revoke truncate on table "public"."user_plans" from "authenticated";

revoke update on table "public"."user_plans" from "authenticated";

revoke delete on table "public"."user_plans" from "service_role";

revoke insert on table "public"."user_plans" from "service_role";

revoke references on table "public"."user_plans" from "service_role";

revoke select on table "public"."user_plans" from "service_role";

revoke trigger on table "public"."user_plans" from "service_role";

revoke truncate on table "public"."user_plans" from "service_role";

revoke update on table "public"."user_plans" from "service_role";

alter table "public"."user_plans" drop constraint "user_plans_user_id_fkey";

alter table "public"."user_plans" drop constraint "user_plans_pkey";

drop index if exists "public"."user_plans_pkey";

drop table "public"."user_plans";

alter table "public"."users" add column "customer_id" text;

alter table "public"."users" add column "subscription_id" text;

CREATE TRIGGER objects_delete_delete_prefix AFTER DELETE ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.delete_prefix_hierarchy_trigger();

CREATE TRIGGER objects_insert_create_prefix BEFORE INSERT ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.objects_insert_prefix_trigger();

CREATE TRIGGER objects_update_create_prefix BEFORE UPDATE ON storage.objects FOR EACH ROW WHEN (((new.name <> old.name) OR (new.bucket_id <> old.bucket_id))) EXECUTE FUNCTION storage.objects_update_prefix_trigger();

CREATE TRIGGER prefixes_create_hierarchy BEFORE INSERT ON storage.prefixes FOR EACH ROW WHEN ((pg_trigger_depth() < 1)) EXECUTE FUNCTION storage.prefixes_insert_trigger();

CREATE TRIGGER prefixes_delete_hierarchy AFTER DELETE ON storage.prefixes FOR EACH ROW EXECUTE FUNCTION storage.delete_prefix_hierarchy_trigger();


