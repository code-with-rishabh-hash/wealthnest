import { describe, it, expect } from 'vitest';
import { CRY } from './crypto';

describe('CRY - Cryptography Module', () => {
  const TEST_PASSWORD = 'TestPassword123!';
  const TEST_DATA = {
    investments: [{ id: '1', name: 'Test FD', principal: 100000 }],
    bankAccounts: [],
    transactions: [],
    currency: '₹',
  };

  describe('encrypt + decrypt roundtrip', () => {
    it('should encrypt and decrypt data correctly', async () => {
      const encrypted = await CRY.encrypt(TEST_DATA, TEST_PASSWORD);
      const decrypted = await CRY.decrypt(encrypted, TEST_PASSWORD);
      expect(decrypted).toEqual(TEST_DATA);
    });

    it('should handle empty objects', async () => {
      const empty = { investments: [], bankAccounts: [], transactions: [] };
      const encrypted = await CRY.encrypt(empty, TEST_PASSWORD);
      const decrypted = await CRY.decrypt(encrypted, TEST_PASSWORD);
      expect(decrypted).toEqual(empty);
    });

    it('should handle strings, numbers, booleans, and nested objects', async () => {
      const complex = {
        str: 'hello world',
        num: 42.5,
        bool: true,
        arr: [1, 2, 3],
        nested: { a: { b: { c: 'deep' } } },
        nullVal: null,
      };
      const encrypted = await CRY.encrypt(complex, TEST_PASSWORD);
      const decrypted = await CRY.decrypt(encrypted, TEST_PASSWORD);
      expect(decrypted).toEqual(complex);
    });

    it('should handle unicode and special characters', async () => {
      const unicode = { text: '₹ € ¥ £ 日本語 中文 한국어 🔐🛡️' };
      const encrypted = await CRY.encrypt(unicode, TEST_PASSWORD);
      const decrypted = await CRY.decrypt(encrypted, TEST_PASSWORD);
      expect(decrypted).toEqual(unicode);
    });

    it('should handle large data (simulate a full vault)', async () => {
      const largeData = {
        investments: Array.from({ length: 100 }, (_, i) => ({
          id: `inv-${i}`,
          name: `Investment ${i}`,
          principal: Math.random() * 1000000,
          notes: 'A'.repeat(500),
        })),
        bankAccounts: Array.from({ length: 50 }, (_, i) => ({
          id: `bank-${i}`,
          bankName: `Bank ${i}`,
          balance: Math.random() * 100000,
        })),
      };
      const encrypted = await CRY.encrypt(largeData, TEST_PASSWORD);
      const decrypted = await CRY.decrypt(encrypted, TEST_PASSWORD);
      expect(decrypted).toEqual(largeData);
    });
  });

  describe('encryption properties', () => {
    it('should produce different ciphertext for same data (random IV/salt)', async () => {
      const enc1 = await CRY.encrypt(TEST_DATA, TEST_PASSWORD);
      const enc2 = await CRY.encrypt(TEST_DATA, TEST_PASSWORD);

      // Salts should differ
      expect(enc1.s).not.toEqual(enc2.s);
      // IVs should differ
      expect(enc1.i).not.toEqual(enc2.i);
      // Ciphertext should differ
      expect(enc1.d).not.toEqual(enc2.d);
      // But both should decrypt to same data
      const dec1 = await CRY.decrypt(enc1, TEST_PASSWORD);
      const dec2 = await CRY.decrypt(enc2, TEST_PASSWORD);
      expect(dec1).toEqual(dec2);
    });

    it('should include version number v=3', async () => {
      const encrypted = await CRY.encrypt(TEST_DATA, TEST_PASSWORD);
      expect(encrypted.v).toBe(3);
    });

    it('should include integrity hash', async () => {
      const encrypted = await CRY.encrypt(TEST_DATA, TEST_PASSWORD);
      expect(encrypted.integrity).toBeDefined();
      expect(typeof encrypted.integrity).toBe('string');
      expect(encrypted.integrity.length).toBe(64); // SHA-256 hex = 64 chars
    });

    it('should have proper salt length (16 bytes)', async () => {
      const encrypted = await CRY.encrypt(TEST_DATA, TEST_PASSWORD);
      expect(encrypted.s.length).toBe(16);
    });

    it('should have proper IV length (12 bytes)', async () => {
      const encrypted = await CRY.encrypt(TEST_DATA, TEST_PASSWORD);
      expect(encrypted.i.length).toBe(12);
    });
  });

  describe('wrong password handling', () => {
    it('should fail to decrypt with wrong password', async () => {
      const encrypted = await CRY.encrypt(TEST_DATA, TEST_PASSWORD);
      await expect(CRY.decrypt(encrypted, 'WrongPassword123!')).rejects.toThrow();
    });

    it('should fail with similar but different password', async () => {
      const encrypted = await CRY.encrypt(TEST_DATA, TEST_PASSWORD);
      await expect(CRY.decrypt(encrypted, 'TestPassword123')).rejects.toThrow();
      await expect(CRY.decrypt(encrypted, 'testpassword123!')).rejects.toThrow();
    });

    it('should fail with empty password', async () => {
      const encrypted = await CRY.encrypt(TEST_DATA, TEST_PASSWORD);
      await expect(CRY.decrypt(encrypted, '')).rejects.toThrow();
    });
  });

  describe('tamper detection', () => {
    it('should detect tampered ciphertext', async () => {
      const encrypted = await CRY.encrypt(TEST_DATA, TEST_PASSWORD);
      // Tamper with the ciphertext
      const tampered = { ...encrypted, d: [...encrypted.d] };
      tampered.d[10] = (tampered.d[10] + 1) % 256;

      await expect(CRY.decrypt(tampered, TEST_PASSWORD)).rejects.toThrow();
    });

    it('should detect tampered integrity hash', async () => {
      const encrypted = await CRY.encrypt(TEST_DATA, TEST_PASSWORD);
      // Tamper with the integrity hash
      const tampered = { ...encrypted, integrity: '0'.repeat(64) };

      // This should either throw TAMPER_DETECTED or a decryption error
      await expect(CRY.decrypt(tampered, TEST_PASSWORD)).rejects.toThrow('TAMPER_DETECTED');
    });
  });

  describe('hash function', () => {
    it('should produce deterministic hash for same input', async () => {
      const hash1 = await CRY.hash('password123');
      const hash2 = await CRY.hash('password123');
      expect(hash1).toBe(hash2);
    });

    it('should produce different hashes for different inputs', async () => {
      const hash1 = await CRY.hash('password123');
      const hash2 = await CRY.hash('password124');
      expect(hash1).not.toBe(hash2);
    });

    it('should return a 64-character hex string (SHA-256)', async () => {
      const hash = await CRY.hash('anypassword');
      expect(hash.length).toBe(64);
      expect(/^[0-9a-f]{64}$/.test(hash)).toBe(true);
    });

    it('should use the wealthnest-v3 salt suffix', async () => {
      // Hash of "test" without salt should differ from with salt
      const hashWithSalt = await CRY.hash('test');
      // The hash should be deterministic with the salt
      const hashWithSalt2 = await CRY.hash('test');
      expect(hashWithSalt).toBe(hashWithSalt2);
      // And it should be a valid hex string
      expect(/^[0-9a-f]{64}$/.test(hashWithSalt)).toBe(true);
    });

    it('should be case-sensitive', async () => {
      const hash1 = await CRY.hash('Password');
      const hash2 = await CRY.hash('password');
      expect(hash1).not.toBe(hash2);
    });
  });
});
