import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import { ApiKey } from './api-key.entity';

@Injectable()
export class KeysService {
  private encryptionKey = process.env.ENCRYPTION_KEY || 'default-encryption-key-change-in-production';

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

    // Return the secret only once
    return {
      ...apiKey,
      encryptedSecret: secretKey, // Return plain secret only on creation
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

  async validateKey(publicKey: string, signature: string): Promise<boolean> {
    const key = await this.keysRepository.findOne({ where: { publicKey, isActive: true } });
    if (!key) {
      return false;
    }

    // Implement signature validation logic here
    return true;
  }

  private generatePublicKey(): string {
    return 'pk_' + crypto.randomBytes(16).toString('hex');
  }

  private generateSecretKey(): string {
    return 'sk_' + crypto.randomBytes(32).toString('hex');
  }

  private encryptSecret(secret: string): string {
    const cipher = crypto.createCipher('aes-256-cbc', this.encryptionKey);
    let encrypted = cipher.update(secret, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }

  private decryptSecret(encrypted: string): string {
    const decipher = crypto.createDecipher('aes-256-cbc', this.encryptionKey);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
}
