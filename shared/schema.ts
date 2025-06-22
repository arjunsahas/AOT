import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  boolean,
  integer,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (mandatory for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (mandatory for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").notNull().default("readonly"), // admin, supervisor, operator, readonly
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Customer profiles table
export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  ucc: varchar("ucc").unique().notNull(),
  pan: varchar("pan").unique(),
  fullName: varchar("full_name").notNull(),
  fatherName: varchar("father_name"),
  dateOfBirth: varchar("date_of_birth"),
  gender: varchar("gender"),
  maritalStatus: varchar("marital_status"),
  mobile: varchar("mobile"),
  email: varchar("email"),
  alternateMobile: varchar("alternate_mobile"),
  accountType: varchar("account_type").default("Individual"),
  status: varchar("status").default("Active"),
  registrationDate: varchar("registration_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Customer additional details (address, bank, etc.)
export const customerDetails = pgTable("customer_details", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").references(() => customers.id),
  detailType: varchar("detail_type").notNull(), // address, bank, fatca, income, nominee, poa, pricing, segment, consent
  details: jsonb("details").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Modification requests table
export const modificationRequests = pgTable("modification_requests", {
  id: serial("id").primaryKey(),
  requestId: varchar("request_id").unique().notNull(),
  customerId: integer("customer_id").references(() => customers.id),
  requestType: varchar("request_type").notNull(),
  currentValue: jsonb("current_value"),
  newValue: jsonb("new_value"),
  reason: text("reason"),
  status: varchar("status").default("pending"), // pending, approved, rejected, partial_success
  createdBy: varchar("created_by").references(() => users.id),
  approvedBy: varchar("approved_by").references(() => users.id),
  documents: jsonb("documents"), // array of document URLs
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const customersRelations = relations(customers, ({ many }) => ({
  details: many(customerDetails),
  requests: many(modificationRequests),
}));

export const customerDetailsRelations = relations(customerDetails, ({ one }) => ({
  customer: one(customers, {
    fields: [customerDetails.customerId],
    references: [customers.id],
  }),
}));

export const modificationRequestsRelations = relations(modificationRequests, ({ one }) => ({
  customer: one(customers, {
    fields: [modificationRequests.customerId],
    references: [customers.id],
  }),
  creator: one(users, {
    fields: [modificationRequests.createdBy],
    references: [users.id],
  }),
  approver: one(users, {
    fields: [modificationRequests.approvedBy],
    references: [users.id],
  }),
}));

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export type InsertCustomer = typeof customers.$inferInsert;
export type Customer = typeof customers.$inferSelect;

export type InsertCustomerDetails = typeof customerDetails.$inferInsert;
export type CustomerDetails = typeof customerDetails.$inferSelect;

export type InsertModificationRequest = typeof modificationRequests.$inferInsert;
export type ModificationRequest = typeof modificationRequests.$inferSelect;

// Schemas
export const insertCustomerSchema = createInsertSchema(customers);
export const insertModificationRequestSchema = createInsertSchema(modificationRequests).omit({ id: true, requestId: true });
