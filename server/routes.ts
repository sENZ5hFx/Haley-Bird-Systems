import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import notionRoutes from "./routes/notion";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.use("/api/notion", notionRoutes);

  return httpServer;
}
