-- Alteração do schema da aplicação (o restante eram triggers internos do storage já gerenciados pelo Supabase)
alter table "public"."users" add column "plan" text;

