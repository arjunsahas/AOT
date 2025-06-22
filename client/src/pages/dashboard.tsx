import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import Sidebar from "@/components/sidebar";
import CustomerSearch from "@/components/customer-search";
import CustomerProfile from "@/components/customer-profile";
import RequestManagement from "@/components/request-management";

export default function Dashboard() {
  const { user } = useAuth();
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [activeTab, setActiveTab] = useState("search");

  const userInitials = user?.firstName && user?.lastName 
    ? `${user.firstName[0]}${user.lastName[0]}` 
    : user?.email?.[0]?.toUpperCase() || "U";

  const renderContent = () => {
    switch (activeTab) {
      case "search":
        return (
          <>
            <CustomerSearch onCustomerSelect={setSelectedCustomer} />
            {selectedCustomer && <CustomerProfile selectedCustomer={selectedCustomer} />}
          </>
        );
      case "modify":
      case "history":
      case "approvals":
        return <RequestManagement activeTab={activeTab} />;
      case "settings":
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">System Settings</h3>
            <p className="text-gray-500">Settings panel would be implemented here.</p>
          </div>
        );
      default:
        return (
          <>
            <CustomerSearch onCustomerSelect={setSelectedCustomer} />
            {selectedCustomer && <CustomerProfile selectedCustomer={selectedCustomer} />}
          </>
        );
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Customer Information Management</h2>
              <p className="text-sm text-gray-500">Search and manage customer profiles and modification requests - Demo Mode</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Demo Mode</p>
                <p className="text-sm font-medium text-gray-900">Customer Operations System</p>
              </div>
              <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">{userInitials}</span>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 p-6 overflow-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
