import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const TAG_LENGTH = 16;

function getSecret(): Buffer {
  const secret = process.env.ENCRYPTION_SECRET;
  if (!secret || secret.length !== 64) {
    throw new Error(
      "ENCRYPTION_SECRET must be a 64-char hex string (32 bytes)"
    );
  }
  return Buffer.from(secret, "hex");
}

export function encryptApiKey(raw: string): string {
  const key = getSecret();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([
    cipher.update(raw, "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  // iv + tag + ciphertext, base64url encoded
  return Buffer.concat([iv, tag, encrypted]).toString("base64url");
}

export function decryptApiKey(encoded: string): string {
  const key = getSecret();
  const buf = Buffer.from(encoded, "base64url");
  const iv = buf.subarray(0, IV_LENGTH);
  const tag = buf.subarray(IV_LENGTH, IV_LENGTH + TAG_LENGTH);
  const ciphertext = buf.subarray(IV_LENGTH + TAG_LENGTH);
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(tag);
  return decipher.update(ciphertext) + decipher.final("utf8");
}
