alter table "public"."notifications" alter column "sent_at" set data type timestamp with time zone using "sent_at"::timestamp with time zone;


