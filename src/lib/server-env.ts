/** Read at request time. A direct process.env.NAME is frozen when Amplify builds. */
export function serverEnv(name: string) {
  const value = process.env[name];
  if (typeof value !== "string") return "";
  return value.trim().replace(/^['"]|['"]$/g, "");
}
