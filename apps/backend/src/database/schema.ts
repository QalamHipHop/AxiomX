import {
  pgTable,
  serial,
  text,
  timestamp,
  boolean,
  integer,
  jsonb,
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  axiomId: text('axiom_id').unique(),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const apiKeys = pgTable('api_keys', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  name: text('name').notNull(),
  publicKey: text('public_key').notNull().unique(),
  encryptedSecret: text('encrypted_secret').notNull(),
  permissions: jsonb('permissions').default({}),
  isActive: boolean('is_active').default(true),
  lastUsedAt: timestamp('last_used_at'),
  ipWhitelist: text('ip_whitelist').array(),
  usageQuota: integer('usage_quota').default(-1), // -1 for unlimited
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const marketData = pgTable('market_data', {
  id: serial('id').primaryKey(),
  symbol: text('symbol').notNull(),
  exchange: text('exchange').notNull(),
  price: text('price').notNull(),
  volume: text('volume').notNull(),
  timestamp: timestamp('timestamp').notNull(),
});
