import jwt from "jsonwebtoken";
import type { Express, RequestHandler, Request, Response, NextFunction } from "express";
import { storage } from "./storage";

const JWT_SECRET = process.env.SESSION_SECRET || "dev_secret";
const JWT_EXPIRES_IN = "7d";

export function setupAuth(app: Express) {
  app.post("/api/login", async (req: Request, res: Response) => {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email and password required" });
    }
    const user = await storage.getUser(email);
    // For demo: assume user object has a 'password' field (plaintext, not for production)
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    res.json({ token });
  });

  app.post("/api/logout", (req: Request, res: Response) => {
    // For JWT, logout is handled client-side by deleting the token
    res.json({ message: "Logged out" });
  });
}

export const isAuthenticated: RequestHandler = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    (req as any).user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
