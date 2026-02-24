import type { EncryptedBlob } from '@wealthnest/shared';

/**
 * Cryptography module implementing AES-256-GCM encryption with PBKDF2 key derivation.
 * Zero-knowledge architecture: the master password never leaves the client.
 */
export const CRY = {
  /**
   * Derive an AES-256-GCM key from a password and salt using PBKDF2
   */
  async deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
    const enc = new TextEncoder().encode(password);
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      enc as BufferSource,
      'PBKDF2',
      false,
      ['deriveKey'] as KeyUsage[],
    );
    return crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt: salt as BufferSource, iterations: 600_000, hash: 'SHA-256' },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt'] as KeyUsage[],
    );
  },

  /**
   * Encrypt data with AES-256-GCM. Returns an encrypted blob with random salt/IV
   * and a SHA-256 integrity hash of the plaintext.
   */
  async encrypt(data: unknown, password: string): Promise<EncryptedBlob> {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const key = await this.deriveKey(password, salt);
    const raw = JSON.stringify(data);
    const ciphertext = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: iv as BufferSource },
      key,
      new TextEncoder().encode(raw) as BufferSource,
    );
    const integrityHash = await crypto.subtle.digest(
      'SHA-256',
      new TextEncoder().encode(raw) as BufferSource,
    );
    return {
      s: [...salt],
      i: [...iv],
      d: [...new Uint8Array(ciphertext)],
      v: 3,
      integrity: [...new Uint8Array(integrityHash)]
        .map(b => b.toString(16).padStart(2, '0'))
        .join(''),
    };
  },

  /**
   * Decrypt an encrypted blob. Verifies integrity hash if present.
   * Throws 'TAMPER_DETECTED' if integrity check fails.
   */
  async decrypt<T = unknown>(blob: EncryptedBlob, password: string): Promise<T> {
    const key = await this.deriveKey(password, new Uint8Array(blob.s));
    const plaintext = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: new Uint8Array(blob.i) as BufferSource },
      key,
      new Uint8Array(blob.d) as BufferSource,
    );
    const raw = new TextDecoder().decode(plaintext);
    if (blob.integrity) {
      const integrityHash = await crypto.subtle.digest(
        'SHA-256',
        new TextEncoder().encode(raw) as BufferSource,
      );
      const check = [...new Uint8Array(integrityHash)]
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
      if (check !== blob.integrity) {
        throw new Error('TAMPER_DETECTED');
      }
    }
    return JSON.parse(raw) as T;
  },

  /**
   * Hash a password with a salt suffix for storage comparison.
   * NOT used for encryption key derivation — only for verifying the correct password.
   */
  async hash(password: string): Promise<string> {
    const hash = await crypto.subtle.digest(
      'SHA-256',
      new TextEncoder().encode(password + '::wealthnest-v3') as BufferSource,
    );
    return [...new Uint8Array(hash)]
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  },
};
