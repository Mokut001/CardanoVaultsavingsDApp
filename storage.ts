import { db } from "./db";
import {
  vaults,
  type InsertVault,
  type UpdateVaultRequest,
  type Vault
} from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  getVaultsByAddress(address: string): Promise<Vault[]>;
  createVault(vault: InsertVault): Promise<Vault>;
  updateVault(id: number, updates: UpdateVaultRequest): Promise<Vault>;
}

export class DatabaseStorage implements IStorage {
  async getVaultsByAddress(address: string): Promise<Vault[]> {
    return await db.select().from(vaults).where(eq(vaults.userAddress, address));
  }

  async createVault(insertVault: InsertVault): Promise<Vault> {
    const [vault] = await db.insert(vaults).values(insertVault).returning();
    return vault;
  }

  async updateVault(id: number, updates: UpdateVaultRequest): Promise<Vault> {
    const [updated] = await db
      .update(vaults)
      .set({
        ...updates,
        updatedAt: new Date()
      })
      .where(eq(vaults.id, id))
      .returning();
    return updated;
  }
}

export const storage = new DatabaseStorage();
