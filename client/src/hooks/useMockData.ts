import { useState, useEffect } from "react";

// Mock customer data
const mockCustomers = [
  {
    id: 1,
    ucc: "123456789012",
    pan: "ABCDE1234F",
    fullName: "Rajesh Kumar",
    fatherName: "Suresh Kumar",
    dateOfBirth: "1985-05-15",
    gender: "Male",
    maritalStatus: "Married",
    mobile: "9876543210",
    email: "rajesh.kumar@email.com",
    alternateMobile: "9876543211",
    accountType: "Individual",
    status: "Active",
    registrationDate: "2020-01-15",
    createdAt: new Date("2020-01-15"),
    updatedAt: new Date("2024-06-20"),
    details: [
      {
        id: 1,
        customerId: 1,
        detailType: "address",
        details: {
          current: "123 Main Street, Mumbai, Maharashtra 400001",
          permanent: "456 Oak Avenue, Delhi, Delhi 110001"
        }
      },
      {
        id: 2,
        customerId: 1,
        detailType: "bank",
        details: {
          bankName: "HDFC Bank",
          accountNumber: "1234567890",
          ifscCode: "HDFC0001234",
          accountType: "Savings"
        }
      }
    ]
  },
  {
    id: 2,
    ucc: "234567890123",
    pan: "BCDEF2345G",
    fullName: "Priya Sharma",
    fatherName: "Ramesh Sharma",
    dateOfBirth: "1990-08-22",
    gender: "Female",
    maritalStatus: "Single",
    mobile: "8765432109",
    email: "priya.sharma@email.com",
    alternateMobile: "8765432108",
    accountType: "Individual",
    status: "Active",
    registrationDate: "2021-03-10",
    createdAt: new Date("2021-03-10"),
    updatedAt: new Date("2024-06-19"),
    details: []
  },
  {
    id: 3,
    ucc: "345678901234",
    pan: "CDEFG3456H",
    fullName: "Amit Patel",
    fatherName: "Kiran Patel",
    dateOfBirth: "1988-12-03",
    gender: "Male",
    maritalStatus: "Married",
    mobile: "7654321098",
    email: "amit.patel@email.com",
    alternateMobile: "7654321097",
    accountType: "Individual",
    status: "Active",
    registrationDate: "2019-11-25",
    createdAt: new Date("2019-11-25"),
    updatedAt: new Date("2024-06-18"),
    details: []
  }
];

// Mock modification requests
const mockRequests = [
  {
    id: 1,
    requestId: "REQ-2024-001234",
    customerId: 1,
    requestType: "Name Modification",
    currentValue: { value: "Rajesh Kumar" },
    newValue: { value: "Rajesh Kumar Gupta" },
    reason: "Name change after marriage",
    status: "pending",
    createdBy: "operator1",
    approvedBy: null,
    documents: [],
    createdAt: new Date("2024-06-20"),
    updatedAt: new Date("2024-06-20")
  },
  {
    id: 2,
    requestId: "REQ-2024-001235",
    customerId: 2,
    requestType: "Email & Mobile Modification",
    currentValue: { value: "priya.sharma@email.com | 8765432109" },
    newValue: { value: "priya.new@email.com | 9876543210" },
    reason: "Email compromised, new mobile number",
    status: "approved",
    createdBy: "operator1",
    approvedBy: "supervisor1",
    documents: [],
    createdAt: new Date("2024-06-19"),
    updatedAt: new Date("2024-06-19")
  },
  {
    id: 3,
    requestId: "REQ-2024-001236",
    customerId: 3,
    requestType: "DOB Modification",
    currentValue: { value: "1988-12-03" },
    newValue: { value: "1988-12-05" },
    reason: "Error in birth certificate date",
    status: "rejected",
    createdBy: "operator1",
    approvedBy: "supervisor1",
    documents: [],
    createdAt: new Date("2024-06-18"),
    updatedAt: new Date("2024-06-18")
  }
];

export function useMockCustomers() {
  const [customers, setCustomers] = useState(mockCustomers);

  const searchCustomers = (searchTerm: string, searchType: string) => {
    if (!searchTerm) return [];
    
    const term = searchTerm.toLowerCase();
    return customers.filter(customer => {
      switch (searchType.toLowerCase()) {
        case 'ucc':
          return customer.ucc.includes(term);
        case 'pan':
          return customer.pan.toLowerCase().includes(term);
        case 'name':
          return customer.fullName.toLowerCase().includes(term);
        case 'mobile':
          return customer.mobile.includes(term) || customer.alternateMobile?.includes(term);
        case 'email':
          return customer.email.toLowerCase().includes(term);
        default:
          return customer.ucc.includes(term) ||
                 customer.pan.toLowerCase().includes(term) ||
                 customer.fullName.toLowerCase().includes(term) ||
                 customer.mobile.includes(term) ||
                 customer.email.toLowerCase().includes(term);
      }
    });
  };

  const getCustomerById = (id: number) => {
    return customers.find(customer => customer.id === id);
  };

  return {
    customers,
    searchCustomers,
    getCustomerById,
  };
}

export function useMockRequests() {
  const [requests, setRequests] = useState(mockRequests);

  const getRequests = (filters?: { customerId?: number; status?: string; userId?: string }) => {
    let filtered = [...requests];
    
    if (filters?.customerId) {
      filtered = filtered.filter(req => req.customerId === filters.customerId);
    }
    
    if (filters?.status) {
      filtered = filtered.filter(req => req.status === filters.status);
    }
    
    if (filters?.userId) {
      filtered = filtered.filter(req => req.createdBy === filters.userId);
    }
    
    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  const createRequest = (requestData: any) => {
    const newRequest = {
      id: requests.length + 1,
      requestId: `REQ-2024-${String(Date.now()).slice(-6)}`,
      ...requestData,
      status: "pending",
      approvedBy: null,
      documents: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setRequests(prev => [newRequest, ...prev]);
    return newRequest;
  };

  const updateRequestStatus = (id: number, status: string, approvedBy?: string) => {
    setRequests(prev => prev.map(req => 
      req.id === id 
        ? { ...req, status, approvedBy, updatedAt: new Date() }
        : req
    ));
  };

  const getPendingRequests = () => {
    return requests.filter(req => req.status === "pending");
  };

  return {
    requests,
    getRequests,
    createRequest,
    updateRequestStatus,
    getPendingRequests,
  };
}