import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Shield, FileCheck } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-primary-600 rounded-lg flex items-center justify-center mb-4">
            <Users className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Customer Operations</h1>
          <p className="mt-2 text-gray-600">Management System</p>
        </div>

        <Card>
          <CardContent className="pt-6">
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
            </div>

            <Button 
              className="w-full mt-6" 
              onClick={() => window.location.href = '/api/login'}
            >
              Login to Continue
            </Button>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-gray-500">
          Secure access to customer modification requests
        </p>
      </div>
    </div>
  );
}
