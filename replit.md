# Customer Operations Management System

## Overview

This is a full-stack web application built for customer information management and modification request workflows. The system provides role-based access control for operations teams to search customer profiles, submit modification requests, and manage approval workflows through a maker-checker system.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens
- **State Management**: TanStack Query (React Query) for server state
- **Routing**: Wouter for client-side routing
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Authentication**: Replit Auth with OpenID Connect
- **Session Management**: Express sessions with PostgreSQL storage
- **Database ORM**: Drizzle ORM with type-safe schema definitions

## Key Components

### Authentication & Authorization
- **SSO Integration**: Replit Auth using OpenID Connect protocol
- **Session Storage**: PostgreSQL-backed sessions using connect-pg-simple
- **Role-Based Access**: Four-tier permission system (admin, supervisor, operator, readonly)
- **JWT Token Management**: Automatic token refresh and session validation

### Database Schema
- **Users Table**: Stores user profiles with role assignments
- **Customers Table**: Core customer information (UCC, PAN, demographics)
- **Customer Details Table**: Extended customer data (address, bank details, etc.)
- **Modification Requests Table**: Change request tracking with status workflow
- **Sessions Table**: Session persistence for authentication

### API Structure
- **Authentication Routes**: `/api/auth/*` for login/logout/user info
- **Customer Operations**: `/api/customers/*` for search and profile management
- **Request Management**: `/api/requests/*` for modification request CRUD operations
- **Role-based Middleware**: Permission validation for endpoint access

## Data Flow

### Customer Search Flow
1. User enters search criteria (UCC/PAN/Mobile/Email)
2. Backend queries customer database with fuzzy matching
3. Results returned with customer profile summary
4. User selects customer to view detailed profile

### Modification Request Flow
1. Operator creates modification request with supporting documents
2. Request stored in pending status
3. Supervisor/Admin reviews and approves/rejects request
4. Approved changes trigger profile update
5. Audit trail maintained for all modifications

### Authentication Flow
1. User redirected to Replit OAuth provider
2. Successful authentication creates session
3. User role determines available operations
4. Session validated on each API request

## External Dependencies

### Database
- **Primary Database**: PostgreSQL (configured for Neon serverless)
- **Connection Pool**: @neondatabase/serverless with WebSocket support
- **Migration Tool**: Drizzle Kit for schema management

### Authentication Provider
- **OAuth Provider**: Replit OpenID Connect
- **Session Store**: PostgreSQL with connect-pg-simple adapter
- **Token Management**: Passport.js with OpenID Client strategy

### UI Framework
- **Component Library**: Radix UI primitives
- **Icons**: Lucide React
- **Form Handling**: React Hook Form with Zod validation
- **Date Utilities**: date-fns for date manipulation

## Deployment Strategy

### Development Environment
- **Runtime**: Node.js 20 with Replit modules
- **Database**: PostgreSQL 16 container
- **Hot Reload**: Vite HMR with TSX execution
- **Port Configuration**: Frontend (5000) with proxy to backend

### Production Build
- **Frontend**: Vite build to static assets
- **Backend**: ESBuild compilation with Node.js target
- **Deployment**: Replit autoscale with health checks
- **Environment**: Production NODE_ENV with optimized builds

### Configuration Management
- **Database URL**: Environment variable for connection string
- **Session Secret**: Secure random key for session encryption
- **OAuth Credentials**: Replit-provided client credentials
- **CORS Policy**: Restricted to allowed domains

## Changelog
- June 22, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.