import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import { ApiKey } from './api-key.entity';

@Injectable()
export class KeysService {
  private readonly algorithm = 'aes-256-gcm';
  private readonly ivLength = 16;
  private readonly saltLength = 64;
  private readonly tagLength = 16;
  private readonly encryptionKey = process.env.ENCRYPTION_KEY || 'default-encryption-key-must-be-32-chars-long-!!!';

  constructor(
    @InjectRepository(ApiKey)
    private keysRepository: Repository<ApiKey>,
  ) {}

  async createKey(userId: string, keyName: string, permissions: string[] = []): Promise<ApiKey> {
    const publicKey = this.generatePublicKey();
    const secretKey = this.generateSecretKey();
    const encryptedSecret = this.encryptSecret(secretKey);

    const apiKey = this.keysRepository.create({
      userId,
      keyName,
      publicKey,
      encryptedSecret,
      permissions,
    });

    await this.keysRepository.save(apiKey);

    return {
      ...apiKey,
      encryptedSecret: secretKey,
    };
  }

  async getKeysByUser(userId: string): Promise<ApiKey[]> {
    return this.keysRepository.find({
      where: { userId },
      select: ['id', 'keyName', 'publicKey', 'permissions', 'isActive', 'createdAt', 'updatedAt'],
    });
  }

  async getKeyById(keyId: string, userId: string): Promise<ApiKey> {
    const key = await this.keysRepository.findOne({ where: { id: keyId } });
    if (!key) {
      throw new NotFoundException('API key not found');
    }

    if (key.userId !== userId) {
      throw new ForbiddenException('You do not have permission to access this key');
    }

    return key;
  }

  async revokeKey(keyId: string, userId: string): Promise<void> {
    const key = await this.getKeyById(keyId, userId);
    key.isActive = false;
    await this.keysRepository.save(key);
  }

  private generatePublicKey(): string {
    return 'pk_' + crypto.randomBytes(16).toString('hex');
  }

  private generateSecretKey(): string {
    return 'sk_' + crypto.randomBytes(32).toString('hex');
  }

  private encryptSecret(secret: string): string {
    const iv = crypto.randomBytes(this.ivLength);
    const salt = crypto.randomBytes(this.saltLength);
    const key = crypto.scryptSync(this.encryptionKey, salt, 32);
    
    const cipher = crypto.createCipheriv(this.algorithm, key, iv);
    let encrypted = cipher.update(secret, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const tag = cipher.getAuthTag();
    
    return `${iv.toString('hex')}:${salt.toString('hex')}:${tag.toString('hex')}:${encrypted}`;
  }

  private decryptSecret(encryptedData: string): string {
    const [ivHex, saltHex, tagHex, encrypted] = encryptedData.split(':');
    
    const iv = Buffer.from(ivHex, 'hex');
    const salt = Buffer.from(saltHex, 'hex');
    const tag = Buffer.from(tagHex, 'hex');
    const key = crypto.scryptSync(this.encryptionKey, salt, 32);
    
    const decipher = crypto.createDecipheriv(this.algorithm, key, iv);
    decipher.setAuthTag(tag);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }
}
