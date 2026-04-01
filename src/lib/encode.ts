export function encodeInput(pronoun: "she" | "he", message: string): string {
  const payload = `${pronoun === "she" ? "s" : "h"}|${message}`;
  // Unicode-safe base64url
  const bytes = new TextEncoder().encode(payload);
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function decodeInput(encoded: string): {
  pronoun: "she" | "he";
  message: string;
} | null {
  try {
    const base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const binary = atob(base64);
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    const payload = new TextDecoder().decode(bytes);
    const sep = payload.indexOf("|");
    if (sep === -1) return null;
    const flag = payload.slice(0, sep);
    const message = payload.slice(sep + 1);
    if (flag !== "s" && flag !== "h") return null;
    return { pronoun: flag === "s" ? "she" : "he", message };
  } catch {
    return null;
  }
}
