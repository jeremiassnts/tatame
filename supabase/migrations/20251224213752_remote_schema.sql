alter table "public"."notifications" alter column "recipients" set data type text[] using "recipients"::text[];

alter table "public"."notifications" alter column "viewed_by" set data type text[] using "viewed_by"::text[];


