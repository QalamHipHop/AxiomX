import { Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class IdentityVaultService {
  private readonly logger = new Logger(IdentityVaultService.name);

  /**
   * Encrypts and stores identity field fragments in the decentralized vault.
   */
  async storeInVault(userId: string, fragment: any, userKey: string): Promise<string> {
    const iv = crypto.randomBytes(16);
    const key = crypto.scryptSync(userKey, 'salt', 32);
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    
    let encrypted = cipher.update(JSON.stringify(fragment), 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag().toString('hex');

    const vaultPath = `vault/${userId}/${crypto.randomBytes(8).toString('hex')}.enc`;
    this.logger.log(`Stored fragment in vault: ${vaultPath}`);
    
    return `${iv.toString('hex')}:${authTag}:${encrypted}`;
  }

  /**
   * Retrieves and decrypts identity fragments from the vault.
   */
  async retrieveFromVault(encryptedData: string, userKey: string): Promise<any> {
    const [ivHex, authTagHex, encrypted] = encryptedData.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    const key = crypto.scryptSync(userKey, 'salt', 32);
    
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return JSON.parse(decrypted);
  }
}
