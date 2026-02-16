import { pgTable, text, serial, bigint, boolean, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const vaults = pgTable("vaults", {
  id: serial("id").primaryKey(),
  userAddress: varchar("user_address").notNull(),
  targetAmount: bigint("target_amount", { mode: "number" }).notNull(), // stored in lovelace
  currentAmount: bigint("current_amount", { mode: "number" }).default(0).notNull(), // stored in lovelace
  isLocked: boolean("is_locked").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertVaultSchema = createInsertSchema(vaults).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true,
  currentAmount: true, // usually updated via sync, not creation
  isLocked: true
});

export type Vault = typeof vaults.$inferSelect;
export type InsertVault = z.infer<typeof insertVaultSchema>;

export type CreateVaultRequest = InsertVault;
export type UpdateVaultRequest = Partial<InsertVault> & {
  currentAmount?: number;
  isLocked?: boolean;
};
