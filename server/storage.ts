import { 
  users, vendors, customers, inventory, crates, coldStorage, transactions, housekeeping,
  type User, type InsertUser, type Vendor, type InsertVendor, type Customer, type InsertCustomer,
  type Inventory, type InsertInventory, type Crate, type InsertCrate, type ColdStorage, type InsertColdStorage,
  type Transaction, type InsertTransaction, type Housekeeping, type InsertHousekeeping
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Vendors
  getAllVendors(): Promise<Vendor[]>;
  getVendor(id: number): Promise<Vendor | undefined>;
  createVendor(vendor: InsertVendor): Promise<Vendor>;
  updateVendor(id: number, vendor: Partial<InsertVendor>): Promise<Vendor | undefined>;
  deleteVendor(id: number): Promise<boolean>;

  // Customers
  getAllCustomers(): Promise<Customer[]>;
  getCustomer(id: number): Promise<Customer | undefined>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  updateCustomer(id: number, customer: Partial<InsertCustomer>): Promise<Customer | undefined>;
  deleteCustomer(id: number): Promise<boolean>;

  // Inventory
  getAllInventory(): Promise<Inventory[]>;
  getInventoryItem(id: number): Promise<Inventory | undefined>;
  getInventoryByCategory(category: string): Promise<Inventory[]>;
  createInventoryItem(item: InsertInventory): Promise<Inventory>;
  updateInventoryItem(id: number, item: Partial<InsertInventory>): Promise<Inventory | undefined>;
  deleteInventoryItem(id: number): Promise<boolean>;

  // Crates
  getAllCrates(): Promise<Crate[]>;
  getCrate(id: number): Promise<Crate | undefined>;
  getCratesByStatus(status: string): Promise<Crate[]>;
  createCrate(crate: InsertCrate): Promise<Crate>;
  updateCrate(id: number, crate: Partial<InsertCrate>): Promise<Crate | undefined>;
  deleteCrate(id: number): Promise<boolean>;

  // Cold Storage
  getAllColdStorageUnits(): Promise<ColdStorage[]>;
  getColdStorageUnit(id: number): Promise<ColdStorage | undefined>;
  createColdStorageUnit(unit: InsertColdStorage): Promise<ColdStorage>;
  updateColdStorageUnit(id: number, unit: Partial<InsertColdStorage>): Promise<ColdStorage | undefined>;
  deleteColdStorageUnit(id: number): Promise<boolean>;

  // Transactions
  getAllTransactions(): Promise<Transaction[]>;
  getTransaction(id: number): Promise<Transaction | undefined>;
  getTransactionsByVendor(vendorId: number): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  updateTransaction(id: number, transaction: Partial<InsertTransaction>): Promise<Transaction | undefined>;

  // Housekeeping
  getAllHousekeepingTasks(): Promise<Housekeeping[]>;
  getHousekeepingTask(id: number): Promise<Housekeeping | undefined>;
  getHousekeepingTasksByStatus(status: string): Promise<Housekeeping[]>;
  createHousekeepingTask(task: InsertHousekeeping): Promise<Housekeeping>;
  updateHousekeepingTask(id: number, task: Partial<InsertHousekeeping>): Promise<Housekeeping | undefined>;
  deleteHousekeepingTask(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private vendors: Map<number, Vendor>;
  private customers: Map<number, Customer>;
  private inventory: Map<number, Inventory>;
  private crates: Map<number, Crate>;
  private coldStorage: Map<number, ColdStorage>;
  private transactions: Map<number, Transaction>;
  private housekeeping: Map<number, Housekeeping>;
  private currentIds: { [key: string]: number };

  constructor() {
    this.users = new Map();
    this.vendors = new Map();
    this.customers = new Map();
    this.inventory = new Map();
    this.crates = new Map();
    this.coldStorage = new Map();
    this.transactions = new Map();
    this.housekeeping = new Map();
    this.currentIds = {
      users: 1,
      vendors: 1,
      customers: 1,
      inventory: 1,
      crates: 1,
      coldStorage: 1,
      transactions: 1,
      housekeeping: 1,
    };

    this.initializeData();
  }

  private initializeData() {
    // Initialize with sample vendors
    const sampleVendors: InsertVendor[] = [
      {
        name: "Raj Singh Vegetables",
        shopNumber: "A-15",
        contactPerson: "Raj Singh",
        phone: "+91-9876543210",
        email: "raj.vegetables@gmail.com",
        category: "vegetables",
        status: "active",
        dailySales: "45680"
      },
      {
        name: "Mohan Kumar Fruits",
        shopNumber: "B-22",
        contactPerson: "Mohan Kumar",
        phone: "+91-9876543211",
        email: "mohan.fruits@gmail.com",
        category: "fruits",
        status: "active",
        dailySales: "38420"
      },
      {
        name: "Arun Spices & Grains",
        shopNumber: "C-08",
        contactPerson: "Arun Sharma",
        phone: "+91-9876543212",
        email: "arun.spices@gmail.com",
        category: "grains",
        status: "active",
        dailySales: "32150"
      }
    ];

    sampleVendors.forEach(vendor => this.createVendor(vendor));

    // Initialize inventory
    const sampleInventory: InsertInventory[] = [
      {
        itemName: "Tomatoes",
        category: "vegetables",
        currentStock: "1200.5",
        unitPrice: "45.00",
        quality: "excellent",
        qualityPercentage: 98,
        vendorId: 1
      },
      {
        itemName: "Onions",
        category: "vegetables",
        currentStock: "890.2",
        unitPrice: "32.00",
        quality: "good",
        qualityPercentage: 95,
        vendorId: 1
      },
      {
        itemName: "Potatoes",
        category: "vegetables",
        currentStock: "1580.7",
        unitPrice: "28.00",
        quality: "good",
        qualityPercentage: 100,
        vendorId: 1
      },
      {
        itemName: "Apples",
        category: "fruits",
        currentStock: "650.3",
        unitPrice: "120.00",
        quality: "excellent",
        qualityPercentage: 95,
        vendorId: 2
      },
      {
        itemName: "Bananas",
        category: "fruits",
        currentStock: "420.8",
        unitPrice: "60.00",
        quality: "good",
        qualityPercentage: 92,
        vendorId: 2
      },
      {
        itemName: "Rice",
        category: "grains",
        currentStock: "2500.0",
        unitPrice: "55.00",
        quality: "excellent",
        qualityPercentage: 100,
        vendorId: 3
      },
      {
        itemName: "Wheat",
        category: "grains",
        currentStock: "1800.0",
        unitPrice: "48.00",
        quality: "excellent",
        qualityPercentage: 100,
        vendorId: 3
      }
    ];

    sampleInventory.forEach(item => this.createInventoryItem(item));

    // Initialize crates
    const sampleCrates: InsertCrate[] = [
      {
        crateNumber: "CRT-001",
        status: "available",
        capacity: "50.0",
        currentLoad: "0.0"
      },
      {
        crateNumber: "CRT-002",
        status: "in_transit",
        capacity: "50.0",
        currentLoad: "45.5",
        assignedVendor: 1,
        lastLocation: "Loading Bay A"
      },
      {
        crateNumber: "CRT-003",
        status: "under_repair",
        capacity: "50.0",
        currentLoad: "0.0",
        lastLocation: "Maintenance Area"
      }
    ];

    sampleCrates.forEach(crate => this.createCrate(crate));

    // Initialize cold storage
    const sampleColdStorage: InsertColdStorage[] = [
      {
        unitName: "Storage Unit A",
        temperature: "4.0",
        humidity: 85,
        capacity: "3000.0",
        currentLoad: "2450.0",
        status: "optimal"
      },
      {
        unitName: "Storage Unit B",
        temperature: "7.0",
        humidity: 92,
        capacity: "3500.0",
        currentLoad: "3200.0",
        status: "warning"
      }
    ];

    sampleColdStorage.forEach(unit => this.createColdStorageUnit(unit));

    // Initialize transactions
    const sampleTransactions: InsertTransaction[] = [
      {
        transactionId: "TXN001245",
        vendorId: 1,
        items: JSON.stringify([
          { name: "Tomatoes", quantity: 50, price: 45 },
          { name: "Onions", quantity: 30, price: 32 }
        ]),
        totalAmount: "2450.00",
        status: "completed",
        paymentMethod: "cash"
      },
      {
        transactionId: "TXN001244",
        vendorId: 2,
        items: JSON.stringify([
          { name: "Apples", quantity: 15, price: 120 },
          { name: "Bananas", quantity: 5, price: 60 }
        ]),
        totalAmount: "1850.00",
        status: "pending",
        paymentMethod: "digital"
      },
      {
        transactionId: "TXN001243",
        vendorId: 3,
        items: JSON.stringify([
          { name: "Rice", quantity: 50, price: 55 },
          { name: "Wheat", quantity: 10, price: 48 }
        ]),
        totalAmount: "3200.00",
        status: "completed",
        paymentMethod: "cash"
      }
    ];

    sampleTransactions.forEach(transaction => this.createTransaction(transaction));

    // Initialize housekeeping tasks
    const sampleHousekeeping: InsertHousekeeping[] = [
      {
        taskName: "Market Floor Cleaning",
        description: "Clean sections A, B, C",
        area: "Market Floor",
        status: "completed",
        priority: "high",
        assignedTo: "Cleaning Team A"
      },
      {
        taskName: "Waste Collection",
        description: "Collect waste from all vendor stalls",
        area: "All Vendor Stalls",
        status: "active",
        priority: "medium",
        assignedTo: "Waste Management Team"
      },
      {
        taskName: "Storage Area Maintenance",
        description: "Maintenance of cold storage units",
        area: "Cold Storage",
        status: "pending",
        priority: "high",
        assignedTo: "Maintenance Team"
      }
    ];

    sampleHousekeeping.forEach(task => this.createHousekeepingTask(task));
  }

  // Users implementation
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentIds.users++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Vendors implementation
  async getAllVendors(): Promise<Vendor[]> {
    return Array.from(this.vendors.values());
  }

  async getVendor(id: number): Promise<Vendor | undefined> {
    return this.vendors.get(id);
  }

  async createVendor(insertVendor: InsertVendor): Promise<Vendor> {
    const id = this.currentIds.vendors++;
    const vendor: Vendor = { 
      ...insertVendor, 
      id,
      createdAt: new Date()
    };
    this.vendors.set(id, vendor);
    return vendor;
  }

  async updateVendor(id: number, vendorUpdate: Partial<InsertVendor>): Promise<Vendor | undefined> {
    const vendor = this.vendors.get(id);
    if (!vendor) return undefined;
    
    const updatedVendor = { ...vendor, ...vendorUpdate };
    this.vendors.set(id, updatedVendor);
    return updatedVendor;
  }

  async deleteVendor(id: number): Promise<boolean> {
    return this.vendors.delete(id);
  }

  // Customers implementation
  async getAllCustomers(): Promise<Customer[]> {
    return Array.from(this.customers.values());
  }

  async getCustomer(id: number): Promise<Customer | undefined> {
    return this.customers.get(id);
  }

  async createCustomer(insertCustomer: InsertCustomer): Promise<Customer> {
    const id = this.currentIds.customers++;
    const customer: Customer = {
      ...insertCustomer,
      id,
      createdAt: new Date()
    };
    this.customers.set(id, customer);
    return customer;
  }

  async updateCustomer(id: number, customerUpdate: Partial<InsertCustomer>): Promise<Customer | undefined> {
    const customer = this.customers.get(id);
    if (!customer) return undefined;
    
    const updatedCustomer = { ...customer, ...customerUpdate };
    this.customers.set(id, updatedCustomer);
    return updatedCustomer;
  }

  async deleteCustomer(id: number): Promise<boolean> {
    return this.customers.delete(id);
  }

  // Inventory implementation
  async getAllInventory(): Promise<Inventory[]> {
    return Array.from(this.inventory.values());
  }

  async getInventoryItem(id: number): Promise<Inventory | undefined> {
    return this.inventory.get(id);
  }

  async getInventoryByCategory(category: string): Promise<Inventory[]> {
    return Array.from(this.inventory.values()).filter(item => item.category === category);
  }

  async createInventoryItem(insertItem: InsertInventory): Promise<Inventory> {
    const id = this.currentIds.inventory++;
    const item: Inventory = {
      ...insertItem,
      id,
      lastUpdated: new Date()
    };
    this.inventory.set(id, item);
    return item;
  }

  async updateInventoryItem(id: number, itemUpdate: Partial<InsertInventory>): Promise<Inventory | undefined> {
    const item = this.inventory.get(id);
    if (!item) return undefined;
    
    const updatedItem = { ...item, ...itemUpdate, lastUpdated: new Date() };
    this.inventory.set(id, updatedItem);
    return updatedItem;
  }

  async deleteInventoryItem(id: number): Promise<boolean> {
    return this.inventory.delete(id);
  }

  // Crates implementation
  async getAllCrates(): Promise<Crate[]> {
    return Array.from(this.crates.values());
  }

  async getCrate(id: number): Promise<Crate | undefined> {
    return this.crates.get(id);
  }

  async getCratesByStatus(status: string): Promise<Crate[]> {
    return Array.from(this.crates.values()).filter(crate => crate.status === status);
  }

  async createCrate(insertCrate: InsertCrate): Promise<Crate> {
    const id = this.currentIds.crates++;
    const crate: Crate = {
      ...insertCrate,
      id,
      createdAt: new Date()
    };
    this.crates.set(id, crate);
    return crate;
  }

  async updateCrate(id: number, crateUpdate: Partial<InsertCrate>): Promise<Crate | undefined> {
    const crate = this.crates.get(id);
    if (!crate) return undefined;
    
    const updatedCrate = { ...crate, ...crateUpdate };
    this.crates.set(id, updatedCrate);
    return updatedCrate;
  }

  async deleteCrate(id: number): Promise<boolean> {
    return this.crates.delete(id);
  }

  // Cold Storage implementation
  async getAllColdStorageUnits(): Promise<ColdStorage[]> {
    return Array.from(this.coldStorage.values());
  }

  async getColdStorageUnit(id: number): Promise<ColdStorage | undefined> {
    return this.coldStorage.get(id);
  }

  async createColdStorageUnit(insertUnit: InsertColdStorage): Promise<ColdStorage> {
    const id = this.currentIds.coldStorage++;
    const unit: ColdStorage = { ...insertUnit, id };
    this.coldStorage.set(id, unit);
    return unit;
  }

  async updateColdStorageUnit(id: number, unitUpdate: Partial<InsertColdStorage>): Promise<ColdStorage | undefined> {
    const unit = this.coldStorage.get(id);
    if (!unit) return undefined;
    
    const updatedUnit = { ...unit, ...unitUpdate };
    this.coldStorage.set(id, updatedUnit);
    return updatedUnit;
  }

  async deleteColdStorageUnit(id: number): Promise<boolean> {
    return this.coldStorage.delete(id);
  }

  // Transactions implementation
  async getAllTransactions(): Promise<Transaction[]> {
    return Array.from(this.transactions.values());
  }

  async getTransaction(id: number): Promise<Transaction | undefined> {
    return this.transactions.get(id);
  }

  async getTransactionsByVendor(vendorId: number): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).filter(transaction => transaction.vendorId === vendorId);
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = this.currentIds.transactions++;
    const transaction: Transaction = {
      ...insertTransaction,
      id,
      createdAt: new Date()
    };
    this.transactions.set(id, transaction);
    return transaction;
  }

  async updateTransaction(id: number, transactionUpdate: Partial<InsertTransaction>): Promise<Transaction | undefined> {
    const transaction = this.transactions.get(id);
    if (!transaction) return undefined;
    
    const updatedTransaction = { ...transaction, ...transactionUpdate };
    this.transactions.set(id, updatedTransaction);
    return updatedTransaction;
  }

  // Housekeeping implementation
  async getAllHousekeepingTasks(): Promise<Housekeeping[]> {
    return Array.from(this.housekeeping.values());
  }

  async getHousekeepingTask(id: number): Promise<Housekeeping | undefined> {
    return this.housekeeping.get(id);
  }

  async getHousekeepingTasksByStatus(status: string): Promise<Housekeeping[]> {
    return Array.from(this.housekeeping.values()).filter(task => task.status === status);
  }

  async createHousekeepingTask(insertTask: InsertHousekeeping): Promise<Housekeeping> {
    const id = this.currentIds.housekeeping++;
    const task: Housekeeping = {
      ...insertTask,
      id,
      createdAt: new Date()
    };
    this.housekeeping.set(id, task);
    return task;
  }

  async updateHousekeepingTask(id: number, taskUpdate: Partial<InsertHousekeeping>): Promise<Housekeeping | undefined> {
    const task = this.housekeeping.get(id);
    if (!task) return undefined;
    
    const updatedTask = { ...task, ...taskUpdate };
    this.housekeeping.set(id, updatedTask);
    return updatedTask;
  }

  async deleteHousekeepingTask(id: number): Promise<boolean> {
    return this.housekeeping.delete(id);
  }
}

export const storage = new MemStorage();
