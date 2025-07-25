import { pgTable, text, serial, integer, boolean, decimal, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table (keeping existing structure)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Vendors table
export const vendors = pgTable("vendors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  shopNumber: text("shop_number").notNull().unique(),
  contactPerson: text("contact_person").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  category: text("category").notNull(), // vegetables, fruits, grains, spices
  status: text("status").notNull().default("active"), // active, inactive
  dailySales: decimal("daily_sales", { precision: 10, scale: 2 }).default("0"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Customers table
export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull().unique(),
  email: text("email"),
  address: text("address"),
  customerType: text("customer_type").notNull().default("retail"), // retail, wholesale
  totalPurchases: decimal("total_purchases", { precision: 10, scale: 2 }).default("0"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Inventory table
export const inventory = pgTable("inventory", {
  id: serial("id").primaryKey(),
  itemName: text("item_name").notNull(),
  category: text("category").notNull(), // vegetables, fruits, grains, spices
  currentStock: decimal("current_stock", { precision: 10, scale: 3 }).notNull(), // in kg
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(), // per kg
  quality: text("quality").notNull().default("good"), // excellent, good, average, poor
  qualityPercentage: integer("quality_percentage").notNull().default(100),
  vendorId: integer("vendor_id").references(() => vendors.id),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

// Crates table
export const crates = pgTable("crates", {
  id: serial("id").primaryKey(),
  crateNumber: text("crate_number").notNull().unique(),
  status: text("status").notNull().default("available"), // available, in_transit, under_repair
  capacity: decimal("capacity", { precision: 10, scale: 2 }).notNull(), // in kg
  currentLoad: decimal("current_load", { precision: 10, scale: 2 }).default("0"),
  assignedVendor: integer("assigned_vendor").references(() => vendors.id),
  lastLocation: text("last_location"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Cold Storage table
export const coldStorage = pgTable("cold_storage", {
  id: serial("id").primaryKey(),
  unitName: text("unit_name").notNull(),
  temperature: decimal("temperature", { precision: 4, scale: 1 }).notNull(),
  humidity: integer("humidity").notNull(),
  capacity: decimal("capacity", { precision: 10, scale: 2 }).notNull(), // in kg
  currentLoad: decimal("current_load", { precision: 10, scale: 2 }).default("0"),
  status: text("status").notNull().default("optimal"), // optimal, warning, critical
  lastMaintenance: timestamp("last_maintenance"),
  nextMaintenance: timestamp("next_maintenance"),
});

// Transactions table
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  transactionId: text("transaction_id").notNull().unique(),
  vendorId: integer("vendor_id").references(() => vendors.id),
  customerId: integer("customer_id").references(() => customers.id),
  items: text("items").notNull(), // JSON string of items
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("completed"), // completed, pending, cancelled
  paymentMethod: text("payment_method").notNull().default("cash"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Housekeeping table
export const housekeeping = pgTable("housekeeping", {
  id: serial("id").primaryKey(),
  taskName: text("task_name").notNull(),
  description: text("description"),
  area: text("area").notNull(),
  status: text("status").notNull().default("pending"), // completed, active, pending
  priority: text("priority").notNull().default("medium"), // high, medium, low
  assignedTo: text("assigned_to"),
  scheduledTime: timestamp("scheduled_time"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertVendorSchema = createInsertSchema(vendors).omit({
  id: true,
  createdAt: true,
});

export const insertCustomerSchema = createInsertSchema(customers).omit({
  id: true,
  createdAt: true,
});

export const insertInventorySchema = createInsertSchema(inventory).omit({
  id: true,
  lastUpdated: true,
});

export const insertCrateSchema = createInsertSchema(crates).omit({
  id: true,
  createdAt: true,
});

export const insertColdStorageSchema = createInsertSchema(coldStorage).omit({
  id: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true,
});

export const insertHousekeepingSchema = createInsertSchema(housekeeping).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Vendor = typeof vendors.$inferSelect;
export type InsertVendor = z.infer<typeof insertVendorSchema>;

export type Customer = typeof customers.$inferSelect;
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;

export type Inventory = typeof inventory.$inferSelect;
export type InsertInventory = z.infer<typeof insertInventorySchema>;

export type Crate = typeof crates.$inferSelect;
export type InsertCrate = z.infer<typeof insertCrateSchema>;

export type ColdStorage = typeof coldStorage.$inferSelect;
export type InsertColdStorage = z.infer<typeof insertColdStorageSchema>;

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;

export type Housekeeping = typeof housekeeping.$inferSelect;
export type InsertHousekeeping = z.infer<typeof insertHousekeepingSchema>;
