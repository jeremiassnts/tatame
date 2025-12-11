export function sanitizeEnvValue(value: string | undefined) {
  if (!value) return value;
  return value
    .trim()
    .replace(/^"+|"+$/g, "") 
    .replace(/^'+|'+$/g, "");
}
