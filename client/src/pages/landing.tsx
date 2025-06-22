import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Users, Shield, FileCheck, User, Settings, CheckCheck, Eye } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function Landing() {
  const [selectedRole, setSelectedRole] = useState("operator");
  const { login } = useAuth();

  const roles = [
    {
      value: "admin",
      label: "Admin",
      icon: Settings,
      description: "Full system access, user management",
      permissions: ["Create users", "Assign roles", "All operations"]
    },
    {
      value: "supervisor", 
      label: "Supervisor",
      icon: CheckCheck,
      description: "Approve modification requests",
      permissions: ["Approve requests", "View all data", "Create requests"]
    },
    {
      value: "operator",
      label: "Operator", 
      icon: User,
      description: "Create modification requests",
      permissions: ["Create requests", "View customer data", "Search customers"]
    },
    {
      value: "readonly",
      label: "Read Only",
      icon: Eye,
      description: "View-only access to system",
      permissions: ["View customer data", "Search customers", "View requests"]
    }
  ];

  const selectedRoleData = roles.find(role => role.value === selectedRole);

  const handleLogin = () => {
    login(selectedRole);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-primary-600 rounded-lg flex items-center justify-center mb-6">
            <Users className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900">Customer Operations</h1>
          <p className="mt-2 text-xl text-gray-600">Management System - Demo</p>
          <p className="mt-1 text-sm text-gray-500">Frontend-only version with mock data</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* System Features */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">System Features</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-primary-600" />
                  <span className="text-sm text-gray-700">Role-based access control</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FileCheck className="h-5 w-5 text-primary-600" />
                  <span className="text-sm text-gray-700">Maker-checker workflow</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-primary-600" />
                  <span className="text-sm text-gray-700">Customer data management</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Settings className="h-5 w-5 text-primary-600" />
                  <span className="text-sm text-gray-700">Request modification tracking</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Role Selection & Login */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Your Role</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Login as:</label>
                  <Select value={selectedRole} onValueChange={setSelectedRole}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                          <div className="flex items-center space-x-2">
                            <role.icon className="h-4 w-4" />
                            <span>{role.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedRoleData && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <selectedRoleData.icon className="h-5 w-5 text-primary-600" />
                      <h4 className="font-medium text-gray-900">{selectedRoleData.label}</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{selectedRoleData.description}</p>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-gray-700">Permissions:</p>
                      <div className="flex flex-wrap gap-1">
                        {selectedRoleData.permissions.map((permission) => (
                          <Badge key={permission} variant="secondary" className="text-xs">
                            {permission}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <Button 
                  className="w-full"
                  onClick={handleLogin}
                >
                  <User className="mr-2 h-4 w-4" />
                  Login as {selectedRoleData?.label}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-500">
            This is a demo version with mock data. All functionality is simulated locally.
          </p>
        </div>
      </div>
    </div>
  );
}
