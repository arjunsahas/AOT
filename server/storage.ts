import {
  users,
  customers,
  customerDetails,
  modificationRequests,
  type User,
  type UpsertUser,
  type Customer,
  type InsertCustomer,
  type CustomerDetails,
  type InsertCustomerDetails,
  type ModificationRequest,
  type InsertModificationRequest,
} from "@shared/schema";
import { db } from "./db";
import { eq, or, ilike, desc } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Customer operations
  searchCustomers(searchTerm: string, searchType: string): Promise<Customer[]>;
  getCustomerById(id: number): Promise<Customer | undefined>;
  getCustomerByUcc(ucc: string): Promise<Customer | undefined>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  updateCustomer(id: number, customer: Partial<InsertCustomer>): Promise<Customer>;
  
  // Customer details operations
  getCustomerDetails(customerId: number): Promise<CustomerDetails[]>;
  createCustomerDetail(detail: InsertCustomerDetails): Promise<CustomerDetails>;
  updateCustomerDetail(id: number, detail: Partial<InsertCustomerDetails>): Promise<CustomerDetails>;
  
  // Modification request operations
  getModificationRequests(customerId?: number): Promise<ModificationRequest[]>;
  getModificationRequestById(id: number): Promise<ModificationRequest | undefined>;
  createModificationRequest(request: InsertModificationRequest): Promise<ModificationRequest>;
  updateModificationRequest(id: number, request: Partial<InsertModificationRequest>): Promise<ModificationRequest>;
  getRequestsByStatus(status: string): Promise<ModificationRequest[]>;
  getRequestsByUser(userId: string): Promise<ModificationRequest[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Customer operations
  async searchCustomers(searchTerm: string, searchType: string): Promise<Customer[]> {
    const searchValue = `%${searchTerm}%`;
    
    switch (searchType.toLowerCase()) {
      case 'ucc':
        return await db.select().from(customers).where(ilike(customers.ucc, searchValue));
      case 'pan':
        return await db.select().from(customers).where(ilike(customers.pan, searchValue));
      case 'name':
        return await db.select().from(customers).where(ilike(customers.fullName, searchValue));
      case 'mobile':
        return await db.select().from(customers).where(
          or(ilike(customers.mobile, searchValue), ilike(customers.alternateMobile, searchValue))
        );
      case 'email':
        return await db.select().from(customers).where(ilike(customers.email, searchValue));
      default:
        // Search across all fields
        return await db.select().from(customers).where(
          or(
            ilike(customers.ucc, searchValue),
            ilike(customers.pan, searchValue),
            ilike(customers.fullName, searchValue),
            ilike(customers.mobile, searchValue),
            ilike(customers.email, searchValue)
          )
        );
    }
  }

  async getCustomerById(id: number): Promise<Customer | undefined> {
    const [customer] = await db.select().from(customers).where(eq(customers.id, id));
    return customer;
  }

  async getCustomerByUcc(ucc: string): Promise<Customer | undefined> {
    const [customer] = await db.select().from(customers).where(eq(customers.ucc, ucc));
    return customer;
  }

  async createCustomer(customer: InsertCustomer): Promise<Customer> {
    const [newCustomer] = await db.insert(customers).values(customer).returning();
    return newCustomer;
  }

  async updateCustomer(id: number, customer: Partial<InsertCustomer>): Promise<Customer> {
    const [updatedCustomer] = await db
      .update(customers)
      .set({ ...customer, updatedAt: new Date() })
      .where(eq(customers.id, id))
      .returning();
    return updatedCustomer;
  }

  // Customer details operations
  async getCustomerDetails(customerId: number): Promise<CustomerDetails[]> {
    return await db.select().from(customerDetails).where(eq(customerDetails.customerId, customerId));
  }

  async createCustomerDetail(detail: InsertCustomerDetails): Promise<CustomerDetails> {
    const [newDetail] = await db.insert(customerDetails).values(detail).returning();
    return newDetail;
  }

  async updateCustomerDetail(id: number, detail: Partial<InsertCustomerDetails>): Promise<CustomerDetails> {
    const [updatedDetail] = await db
      .update(customerDetails)
      .set({ ...detail, updatedAt: new Date() })
      .where(eq(customerDetails.id, id))
      .returning();
    return updatedDetail;
  }

  // Modification request operations
  async getModificationRequests(customerId?: number): Promise<ModificationRequest[]> {
    if (customerId) {
      return await db.select().from(modificationRequests)
        .where(eq(modificationRequests.customerId, customerId))
        .orderBy(desc(modificationRequests.createdAt));
    }
    return await db.select().from(modificationRequests).orderBy(desc(modificationRequests.createdAt));
  }

  async getModificationRequestById(id: number): Promise<ModificationRequest | undefined> {
    const [request] = await db.select().from(modificationRequests).where(eq(modificationRequests.id, id));
    return request;
  }

  async createModificationRequest(request: InsertModificationRequest): Promise<ModificationRequest> {
    const requestId = `REQ-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;
    const [newRequest] = await db.insert(modificationRequests)
      .values({ ...request, requestId })
      .returning();
    return newRequest;
  }

  async updateModificationRequest(id: number, request: Partial<InsertModificationRequest>): Promise<ModificationRequest> {
    const [updatedRequest] = await db
      .update(modificationRequests)
      .set({ ...request, updatedAt: new Date() })
      .where(eq(modificationRequests.id, id))
      .returning();
    return updatedRequest;
  }

  async getRequestsByStatus(status: string): Promise<ModificationRequest[]> {
    return await db.select().from(modificationRequests)
      .where(eq(modificationRequests.status, status))
      .orderBy(desc(modificationRequests.createdAt));
  }

  async getRequestsByUser(userId: string): Promise<ModificationRequest[]> {
    return await db.select().from(modificationRequests)
      .where(eq(modificationRequests.createdBy, userId))
      .orderBy(desc(modificationRequests.createdAt));
  }
}

export const storage = new DatabaseStorage();
