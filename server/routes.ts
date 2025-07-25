import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertVendorSchema, insertCustomerSchema, insertInventorySchema,
  insertCrateSchema, insertColdStorageSchema, insertTransactionSchema,
  insertHousekeepingSchema
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Vendors routes
  app.get("/api/vendors", async (req, res) => {
    try {
      const vendors = await storage.getAllVendors();
      res.json(vendors);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch vendors" });
    }
  });

  app.get("/api/vendors/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const vendor = await storage.getVendor(id);
      if (!vendor) {
        return res.status(404).json({ message: "Vendor not found" });
      }
      res.json(vendor);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch vendor" });
    }
  });

  app.post("/api/vendors", async (req, res) => {
    try {
      const validatedData = insertVendorSchema.parse(req.body);
      const vendor = await storage.createVendor(validatedData);
      res.status(201).json(vendor);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create vendor" });
    }
  });

  app.put("/api/vendors/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertVendorSchema.partial().parse(req.body);
      const vendor = await storage.updateVendor(id, validatedData);
      if (!vendor) {
        return res.status(404).json({ message: "Vendor not found" });
      }
      res.json(vendor);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update vendor" });
    }
  });

  // Customers routes
  app.get("/api/customers", async (req, res) => {
    try {
      const customers = await storage.getAllCustomers();
      res.json(customers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch customers" });
    }
  });

  app.post("/api/customers", async (req, res) => {
    try {
      const validatedData = insertCustomerSchema.parse(req.body);
      const customer = await storage.createCustomer(validatedData);
      res.status(201).json(customer);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create customer" });
    }
  });

  // Inventory routes
  app.get("/api/inventory", async (req, res) => {
    try {
      const category = req.query.category as string;
      const inventory = category 
        ? await storage.getInventoryByCategory(category)
        : await storage.getAllInventory();
      res.json(inventory);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch inventory" });
    }
  });

  app.get("/api/inventory/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const item = await storage.getInventoryItem(id);
      if (!item) {
        return res.status(404).json({ message: "Inventory item not found" });
      }
      res.json(item);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch inventory item" });
    }
  });

  app.post("/api/inventory", async (req, res) => {
    try {
      const validatedData = insertInventorySchema.parse(req.body);
      const item = await storage.createInventoryItem(validatedData);
      res.status(201).json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create inventory item" });
    }
  });

  app.put("/api/inventory/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertInventorySchema.partial().parse(req.body);
      const item = await storage.updateInventoryItem(id, validatedData);
      if (!item) {
        return res.status(404).json({ message: "Inventory item not found" });
      }
      res.json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update inventory item" });
    }
  });

  // Crates routes
  app.get("/api/crates", async (req, res) => {
    try {
      const status = req.query.status as string;
      const crates = status 
        ? await storage.getCratesByStatus(status)
        : await storage.getAllCrates();
      res.json(crates);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch crates" });
    }
  });

  app.post("/api/crates", async (req, res) => {
    try {
      const validatedData = insertCrateSchema.parse(req.body);
      const crate = await storage.createCrate(validatedData);
      res.status(201).json(crate);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create crate" });
    }
  });

  app.put("/api/crates/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertCrateSchema.partial().parse(req.body);
      const crate = await storage.updateCrate(id, validatedData);
      if (!crate) {
        return res.status(404).json({ message: "Crate not found" });
      }
      res.json(crate);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update crate" });
    }
  });

  // Cold Storage routes
  app.get("/api/cold-storage", async (req, res) => {
    try {
      const units = await storage.getAllColdStorageUnits();
      res.json(units);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cold storage units" });
    }
  });

  app.post("/api/cold-storage", async (req, res) => {
    try {
      const validatedData = insertColdStorageSchema.parse(req.body);
      const unit = await storage.createColdStorageUnit(validatedData);
      res.status(201).json(unit);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create cold storage unit" });
    }
  });

  app.put("/api/cold-storage/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertColdStorageSchema.partial().parse(req.body);
      const unit = await storage.updateColdStorageUnit(id, validatedData);
      if (!unit) {
        return res.status(404).json({ message: "Cold storage unit not found" });
      }
      res.json(unit);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update cold storage unit" });
    }
  });

  // Transactions routes
  app.get("/api/transactions", async (req, res) => {
    try {
      const vendorId = req.query.vendorId as string;
      const transactions = vendorId 
        ? await storage.getTransactionsByVendor(parseInt(vendorId))
        : await storage.getAllTransactions();
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  app.post("/api/transactions", async (req, res) => {
    try {
      const validatedData = insertTransactionSchema.parse(req.body);
      const transaction = await storage.createTransaction(validatedData);
      res.status(201).json(transaction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create transaction" });
    }
  });

  // Housekeeping routes
  app.get("/api/housekeeping", async (req, res) => {
    try {
      const status = req.query.status as string;
      const tasks = status 
        ? await storage.getHousekeepingTasksByStatus(status)
        : await storage.getAllHousekeepingTasks();
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch housekeeping tasks" });
    }
  });

  app.post("/api/housekeeping", async (req, res) => {
    try {
      const validatedData = insertHousekeepingSchema.parse(req.body);
      const task = await storage.createHousekeepingTask(validatedData);
      res.status(201).json(task);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create housekeeping task" });
    }
  });

  app.put("/api/housekeeping/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertHousekeepingSchema.partial().parse(req.body);
      const task = await storage.updateHousekeepingTask(id, validatedData);
      if (!task) {
        return res.status(404).json({ message: "Housekeeping task not found" });
      }
      res.json(task);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update housekeeping task" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
