# Customer Operations Management System - Frontend Demo

A simplified frontend-only demonstration of a customer operations management system built with React and TypeScript.

## Features

- **Customer Search**: Search customers by UCC, PAN, name, mobile, or email
- **Customer Profile Management**: View detailed customer information with tabbed interface
- **Modification Requests**: Create and manage customer data modification requests
- **Request Workflow**: View request history and manage approvals (demo simulation)
- **Responsive Design**: Modern UI built with Tailwind CSS and shadcn/ui components

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **UI Framework**: shadcn/ui components built on Radix UI
- **Styling**: Tailwind CSS
- **State Management**: Local state with React hooks
- **Build Tool**: Vite
- **Data**: Mock data stored in local state (no backend required)

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to the application

## Demo Data

The application includes sample customer data:
- **Rajesh Kumar** (UCC: 123456789012, PAN: ABCDE1234F)
- **Priya Sharma** (UCC: 234567890123, PAN: BCDEF2345G)
- **Amit Patel** (UCC: 345678901234, PAN: CDEFG3456H)

## Key Components

- **Customer Search**: Search functionality with filters and quick search options
- **Customer Profile**: Detailed customer information with multiple tabs
- **Request Management**: Create and track modification requests
- **Mock Data Layer**: Simulates backend functionality with local state

## Project Structure

```
client/src/
├── components/          # Reusable UI components
├── hooks/              # Custom React hooks and mock data
├── pages/              # Main application pages
├── lib/                # Utility functions
└── App.tsx             # Main application component
```

## Demo Features

- Search customers using the quick search buttons or custom search
- View detailed customer profiles with personal, contact, and account information
- Create modification requests for customer data changes
- View request history and status tracking
- Experience role-based interface elements

This is a demonstration application with simulated functionality and mock data.