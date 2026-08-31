/*
 * Resolve a path that lives under public/ against wherever the site is served
 * from, so /photos/montreal still points at the right file on GitHub Pages.
 * Anything already absolute, or already inlined, is passed straight through.
 */
export function asset(path) {
  if (!path) return path
  if (/^(https?:|data:|blob:|\/\/|\/)/.test(path)) return path
  return import.meta.env.BASE_URL + path
}
