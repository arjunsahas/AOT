import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertCustomerSchema, insertModificationRequestSchema } from "@shared/schema";
import { z } from "zod";

// Permission helpers
function hasPermission(userRole: string, requiredRole: string): boolean {
  const roleHierarchy = { admin: 4, supervisor: 3, operator: 2, readonly: 1 };
  return roleHierarchy[userRole as keyof typeof roleHierarchy] >= roleHierarchy[requiredRole as keyof typeof roleHierarchy];
}

function requireRole(role: string) {
  return async (req: any, res: any, next: any) => {
    const user = await storage.getUser(req.user.claims.sub);
    if (!user || !hasPermission(user.role, role)) {
      return res.status(403).json({ message: "Insufficient permissions" });
    }
    req.userRole = user.role;
    next();
  };
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Customer search and profile routes
  app.get('/api/customers/search', isAuthenticated, requireRole('readonly'), async (req: any, res) => {
    try {
      const { term, type } = req.query;
      if (!term) {
        return res.status(400).json({ message: "Search term is required" });
      }
      
      const customers = await storage.searchCustomers(term as string, type as string || 'all');
      res.json(customers);
    } catch (error) {
      console.error("Error searching customers:", error);
      res.status(500).json({ message: "Failed to search customers" });
    }
  });

  app.get('/api/customers/:id', isAuthenticated, requireRole('readonly'), async (req: any, res) => {
    try {
      const customerId = parseInt(req.params.id);
      const customer = await storage.getCustomerById(customerId);
      
      if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
      }

      const details = await storage.getCustomerDetails(customerId);
      res.json({ ...customer, details });
    } catch (error) {
      console.error("Error fetching customer:", error);
      res.status(500).json({ message: "Failed to fetch customer" });
    }
  });

  app.get('/api/customers/ucc/:ucc', isAuthenticated, requireRole('readonly'), async (req: any, res) => {
    try {
      const customer = await storage.getCustomerByUcc(req.params.ucc);
      
      if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
      }

      const details = await storage.getCustomerDetails(customer.id);
      res.json({ ...customer, details });
    } catch (error) {
      console.error("Error fetching customer:", error);
      res.status(500).json({ message: "Failed to fetch customer" });
    }
  });

  // Customer creation and update (admin only)
  app.post('/api/customers', isAuthenticated, requireRole('admin'), async (req: any, res) => {
    try {
      const validatedData = insertCustomerSchema.parse(req.body);
      const customer = await storage.createCustomer(validatedData);
      res.status(201).json(customer);
    } catch (error) {
      console.error("Error creating customer:", error);
      res.status(500).json({ message: "Failed to create customer" });
    }
  });

  // Modification request routes
  app.get('/api/requests', isAuthenticated, requireRole('readonly'), async (req: any, res) => {
    try {
      const { customerId, status, userId } = req.query;
      let requests;

      if (customerId) {
        requests = await storage.getModificationRequests(parseInt(customerId as string));
      } else if (status) {
        requests = await storage.getRequestsByStatus(status as string);
      } else if (userId) {
        requests = await storage.getRequestsByUser(userId as string);
      } else {
        requests = await storage.getModificationRequests();
      }

      res.json(requests);
    } catch (error) {
      console.error("Error fetching requests:", error);
      res.status(500).json({ message: "Failed to fetch requests" });
    }
  });

  app.get('/api/requests/:id', isAuthenticated, requireRole('readonly'), async (req: any, res) => {
    try {
      const requestId = parseInt(req.params.id);
      const request = await storage.getModificationRequestById(requestId);
      
      if (!request) {
        return res.status(404).json({ message: "Request not found" });
      }

      res.json(request);
    } catch (error) {
      console.error("Error fetching request:", error);
      res.status(500).json({ message: "Failed to fetch request" });
    }
  });

  app.post('/api/requests', isAuthenticated, requireRole('operator'), async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertModificationRequestSchema.parse({
        ...req.body,
        createdBy: userId,
      });
      
      const request = await storage.createModificationRequest(validatedData);
      res.status(201).json(request);
    } catch (error) {
      console.error("Error creating request:", error);
      res.status(500).json({ message: "Failed to create request" });
    }
  });

  app.patch('/api/requests/:id/approve', isAuthenticated, requireRole('supervisor'), async (req: any, res) => {
    try {
      const requestId = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      
      const request = await storage.updateModificationRequest(requestId, {
        status: 'approved',
        approvedBy: userId,
      });
      
      res.json(request);
    } catch (error) {
      console.error("Error approving request:", error);
      res.status(500).json({ message: "Failed to approve request" });
    }
  });

  app.patch('/api/requests/:id/reject', isAuthenticated, requireRole('supervisor'), async (req: any, res) => {
    try {
      const requestId = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      
      const request = await storage.updateModificationRequest(requestId, {
        status: 'rejected',
        approvedBy: userId,
      });
      
      res.json(request);
    } catch (error) {
      console.error("Error rejecting request:", error);
      res.status(500).json({ message: "Failed to reject request" });
    }
  });

  // Pending approvals for supervisors
  app.get('/api/pending-approvals', isAuthenticated, requireRole('supervisor'), async (req: any, res) => {
    try {
      const requests = await storage.getRequestsByStatus('pending');
      res.json(requests);
    } catch (error) {
      console.error("Error fetching pending approvals:", error);
      res.status(500).json({ message: "Failed to fetch pending approvals" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
