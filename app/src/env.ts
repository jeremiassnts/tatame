import { z } from "zod";

const envSchema = z.object({
  EXPO_PUBLIC_TATAME_API_URL: z.string().url(),
  EXPO_PUBLIC_STRIPE_PUBLISH_KEY: z.string(),
  EXPO_PUBLIC_R2_URL: z.string().url(),
});

export const env = envSchema.parse(process.env);
