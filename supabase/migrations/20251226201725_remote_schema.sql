alter table "public"."notifications" alter column "sent_at" set data type timestamp without time zone using "sent_at"::timestamp without time zone;

alter table "public"."users" add column "expo_push_token" text;


