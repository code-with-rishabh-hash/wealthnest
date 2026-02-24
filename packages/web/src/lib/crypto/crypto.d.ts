import type { EncryptedBlob } from '@wealthnest/shared';
/**
 * Cryptography module implementing AES-256-GCM encryption with PBKDF2 key derivation.
 * Zero-knowledge architecture: the master password never leaves the client.
 */
export declare const CRY: {
    /**
     * Derive an AES-256-GCM key from a password and salt using PBKDF2
     */
    deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey>;
    /**
     * Encrypt data with AES-256-GCM. Returns an encrypted blob with random salt/IV
     * and a SHA-256 integrity hash of the plaintext.
     */
    encrypt(data: unknown, password: string): Promise<EncryptedBlob>;
    /**
     * Decrypt an encrypted blob. Verifies integrity hash if present.
     * Throws 'TAMPER_DETECTED' if integrity check fails.
     */
    decrypt<T = unknown>(blob: EncryptedBlob, password: string): Promise<T>;
    /**
     * Hash a password with a salt suffix for storage comparison.
     * NOT used for encryption key derivation — only for verifying the correct password.
     */
    hash(password: string): Promise<string>;
};
//# sourceMappingURL=crypto.d.ts.map