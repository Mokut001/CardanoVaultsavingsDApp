import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.get(api.vaults.getByAddress.path, async (req, res) => {
    const address = req.params.address;
    const vaults = await storage.getVaultsByAddress(address);
    res.json(vaults);
  });

  app.post(api.vaults.create.path, async (req, res) => {
    try {
      const input = api.vaults.create.input.parse(req.body);
      const vault = await storage.createVault(input);
      res.status(201).json(vault);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.patch(api.vaults.update.path, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const input = api.vaults.update.input.parse(req.body);
      const vault = await storage.updateVault(id, input);
      res.json(vault);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  return httpServer;
}
