alter table "public"."user_plans" add constraint "user_plans_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.users(id) not valid;

alter table "public"."user_plans" validate constraint "user_plans_user_id_fkey";
