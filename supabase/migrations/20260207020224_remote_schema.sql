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

-- Storage triggers (objects_delete_delete_prefix, objects_insert_create_prefix, etc.) are
-- managed by Supabase and reference internal functions not available in the shadow DB.
-- They are not included here so that supabase db pull can run successfully.

