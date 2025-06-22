import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Edit, Phone, Mail } from "lucide-react";
import ModificationModal from "./modification-modal";

interface CustomerProfileProps {
  selectedCustomer?: any;
}

export default function CustomerProfile({ selectedCustomer }: CustomerProfileProps) {
  const [showModificationModal, setShowModificationModal] = useState(false);
  const [selectedCustomerState, setSelectedCustomerState] = useState(selectedCustomer);

  const { data: customer } = useQuery({
    queryKey: ["/api/customers", selectedCustomerState?.id],
    enabled: !!selectedCustomerState?.id,
  });

  const { data: recentRequests } = useQuery({
    queryKey: ["/api/requests", { customerId: selectedCustomerState?.id }],
    enabled: !!selectedCustomerState?.id,
  });

  if (!selectedCustomerState && !customer) {
    return null;
  }

  const customerData = customer || selectedCustomerState;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-success text-white';
      case 'pending': return 'bg-warning text-white';
      case 'approved': return 'bg-success text-white';
      case 'rejected': return 'bg-error text-white';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        {/* Customer Overview Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Customer Overview</h3>
              <Badge className={getStatusColor(customerData.status)}>
                {customerData.status}
              </Badge>
            </div>
            
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <User className="text-primary-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{customerData.fullName}</h4>
                <p className="text-sm text-gray-500">UCC: {customerData.ucc}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">PAN</span>
                <span className="text-sm font-medium">{customerData.pan}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Mobile</span>
                <span className="text-sm font-medium">{customerData.mobile}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Email</span>
                <span className="text-sm font-medium">{customerData.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">DOB</span>
                <span className="text-sm font-medium">{customerData.dateOfBirth}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Gender</span>
                <span className="text-sm font-medium">{customerData.gender}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <Button 
                className="w-full"
                onClick={() => setShowModificationModal(true)}
              >
                <Edit className="mr-2 h-4 w-4" />
                Create Modification Request
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Requests */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Requests</h3>
            <div className="space-y-4">
              {recentRequests?.slice(0, 3).map((request: any) => (
                <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{request.requestType}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge className={getStatusColor(request.status)}>
                    {request.status}
                  </Badge>
                </div>
              ))}
              
              {(!recentRequests || recentRequests.length === 0) && (
                <p className="text-sm text-gray-500">No recent requests</p>
              )}
              
              <Button variant="ghost" className="w-full text-primary-600">
                View All Requests
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Edit className="mr-3 h-4 w-4 text-primary-600" />
                <div className="text-left">
                  <p className="text-sm font-medium">Name Modification</p>
                  <p className="text-xs text-gray-500">Update customer name</p>
                </div>
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Phone className="mr-3 h-4 w-4 text-primary-600" />
                <div className="text-left">
                  <p className="text-sm font-medium">Contact Update</p>
                  <p className="text-xs text-gray-500">Email & mobile change</p>
                </div>
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Mail className="mr-3 h-4 w-4 text-primary-600" />
                <div className="text-left">
                  <p className="text-sm font-medium">Bank Details</p>
                  <p className="text-xs text-gray-500">Update banking info</p>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Customer Info */}
      <Card className="mb-6">
        <Tabs defaultValue="basic" className="w-full">
          <div className="border-b border-gray-200">
            <TabsList className="h-auto p-0 bg-transparent">
              <TabsTrigger value="basic" className="data-[state=active]:border-b-2 data-[state=active]:border-primary-600 data-[state=active]:text-primary-600 rounded-none">
                Basic Details
              </TabsTrigger>
              <TabsTrigger value="address" className="data-[state=active]:border-b-2 data-[state=active]:border-primary-600 data-[state=active]:text-primary-600 rounded-none">
                Address
              </TabsTrigger>
              <TabsTrigger value="bank" className="data-[state=active]:border-b-2 data-[state=active]:border-primary-600 data-[state=active]:text-primary-600 rounded-none">
                Bank Details
              </TabsTrigger>
              <TabsTrigger value="fatca" className="data-[state=active]:border-b-2 data-[state=active]:border-primary-600 data-[state=active]:text-primary-600 rounded-none">
                FATCA
              </TabsTrigger>
              <TabsTrigger value="income" className="data-[state=active]:border-b-2 data-[state=active]:border-primary-600 data-[state=active]:text-primary-600 rounded-none">
                Income
              </TabsTrigger>
              <TabsTrigger value="nominee" className="data-[state=active]:border-b-2 data-[state=active]:border-primary-600 data-[state=active]:text-primary-600 rounded-none">
                Nominee
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="basic" className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Personal Information</h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-500">Full Name</label>
                    <p className="text-sm font-medium text-gray-900">{customerData.fullName}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Father's Name</label>
                    <p className="text-sm font-medium text-gray-900">{customerData.fatherName}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Date of Birth</label>
                    <p className="text-sm font-medium text-gray-900">{customerData.dateOfBirth}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Gender</label>
                    <p className="text-sm font-medium text-gray-900">{customerData.gender}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Marital Status</label>
                    <p className="text-sm font-medium text-gray-900">{customerData.maritalStatus}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-4">Contact Information</h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-500">Mobile Number</label>
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium text-gray-900">{customerData.mobile}</p>
                      <Badge className="bg-success text-white text-xs">Verified</Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Email Address</label>
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium text-gray-900">{customerData.email}</p>
                      <Badge className="bg-success text-white text-xs">Verified</Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Alternate Mobile</label>
                    <p className="text-sm font-medium text-gray-900">{customerData.alternateMobile}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-4">Account Information</h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-500">UCC</label>
                    <p className="text-sm font-medium text-gray-900">{customerData.ucc}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">PAN</label>
                    <p className="text-sm font-medium text-gray-900">{customerData.pan}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Account Type</label>
                    <p className="text-sm font-medium text-gray-900">{customerData.accountType}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Account Status</label>
                    <Badge className={getStatusColor(customerData.status)}>
                      {customerData.status}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Registration Date</label>
                    <p className="text-sm font-medium text-gray-900">{customerData.registrationDate}</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="address" className="p-6">
            <p className="text-gray-500">Address information will be displayed here.</p>
          </TabsContent>

          <TabsContent value="bank" className="p-6">
            <p className="text-gray-500">Bank details will be displayed here.</p>
          </TabsContent>

          <TabsContent value="fatca" className="p-6">
            <p className="text-gray-500">FATCA information will be displayed here.</p>
          </TabsContent>

          <TabsContent value="income" className="p-6">
            <p className="text-gray-500">Income details will be displayed here.</p>
          </TabsContent>

          <TabsContent value="nominee" className="p-6">
            <p className="text-gray-500">Nominee information will be displayed here.</p>
          </TabsContent>
        </Tabs>
      </Card>

      <ModificationModal
        isOpen={showModificationModal}
        onClose={() => setShowModificationModal(false)}
        customer={customerData}
      />
    </>
  );
}
