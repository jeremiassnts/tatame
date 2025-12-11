alter table "public"."users" add column "gym_id" bigint;

alter table "public"."users" add constraint "users_gym_id_fkey" FOREIGN KEY (gym_id) REFERENCES public.gyms(id) not valid;

alter table "public"."users" validate constraint "users_gym_id_fkey";


