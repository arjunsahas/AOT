import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Search, 
  Edit, 
  List, 
  CheckCheck, 
  Settings, 
  LogOut 
} from "lucide-react";

export default function Sidebar() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("search");

  const { data: pendingCount } = useQuery({
    queryKey: ["/api/pending-approvals"],
    enabled: user?.role === "supervisor" || user?.role === "admin",
  });

  const userInitials = user?.firstName && user?.lastName 
    ? `${user.firstName[0]}${user.lastName[0]}` 
    : user?.email?.[0]?.toUpperCase() || "U";

  const canApprove = user?.role === "supervisor" || user?.role === "admin";
  const canCreateRequests = user?.role !== "readonly";

  return (
    <aside className="w-64 bg-white shadow-sm border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <Users className="text-white text-sm" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Customer Ops</h1>
            <p className="text-xs text-gray-500">Management System</p>
          </div>
        </div>
      </div>

      {/* User Info & Role */}
      <div className="p-4 border-b border-gray-200">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-primary-700 text-sm font-medium">{userInitials}</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {user?.firstName && user?.lastName 
                  ? `${user.firstName} ${user.lastName}`
                  : user?.email || "User"
                }
              </p>
              <p className="text-xs text-gray-500 capitalize">{user?.role || "readonly"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        <button
          onClick={() => setActiveTab("search")}
          className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg font-medium ${
            activeTab === "search" 
              ? "bg-primary-50 text-primary-700" 
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          }`}
        >
          <Search className="text-sm" />
          <span>Customer Search</span>
        </button>
        
        {canCreateRequests && (
          <button
            onClick={() => setActiveTab("modify")}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg font-medium ${
              activeTab === "modify" 
                ? "bg-primary-50 text-primary-700" 
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <Edit className="text-sm" />
            <span>Modify Requests</span>
          </button>
        )}
        
        <button
          onClick={() => setActiveTab("history")}
          className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg font-medium ${
            activeTab === "history" 
              ? "bg-primary-50 text-primary-700" 
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          }`}
        >
          <List className="text-sm" />
          <span>Request History</span>
        </button>
        
        {canApprove && (
          <button
            onClick={() => setActiveTab("approvals")}
            className={`w-full flex items-center justify-between space-x-3 px-3 py-2 rounded-lg font-medium ${
              activeTab === "approvals" 
                ? "bg-primary-50 text-primary-700" 
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <div className="flex items-center space-x-3">
              <CheckCheck className="text-sm" />
              <span>Pending Approvals</span>
            </div>
            {pendingCount && pendingCount.length > 0 && (
              <Badge variant="secondary" className="bg-warning text-white">
                {pendingCount.length}
              </Badge>
            )}
          </button>
        )}
        
        <button
          onClick={() => setActiveTab("settings")}
          className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg font-medium ${
            activeTab === "settings" 
              ? "bg-primary-50 text-primary-700" 
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          }`}
        >
          <Settings className="text-sm" />
          <span>Settings</span>
        </button>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200">
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-600 hover:bg-gray-50 hover:text-red-600"
          onClick={() => window.location.href = '/api/logout'}
        >
          <LogOut className="mr-3 h-4 w-4" />
          Logout
        </Button>
      </div>
    </aside>
  );
}
