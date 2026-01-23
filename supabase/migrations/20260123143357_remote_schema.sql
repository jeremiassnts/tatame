alter table "public"."users" add column "email" text;

alter table "public"."users" add column "first_name" text;

alter table "public"."users" add column "last_name" text;

alter table "public"."users" add column "migrated_at" timestamp with time zone;

alter table "public"."users" add column "profile_picture" text;

