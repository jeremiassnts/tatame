import { useSession } from "@clerk/clerk-expo";
import { createClient } from "@supabase/supabase-js";
import { sanitizeEnvValue } from "../utils/sanitize";

export function useSupabase() {
  const { session } = useSession();
  const supabaseUrl = sanitizeEnvValue(process.env.EXPO_PUBLIC_SUPABASE_URL!);
  const supabasePubKey = sanitizeEnvValue(
    process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );

  return createClient(
    supabaseUrl!,
    supabasePubKey!,
    {
      accessToken: async () => session?.getToken() ?? null,
    }
  );
}
