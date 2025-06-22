import { useState } from "react";
import { useMockRequests } from "@/hooks/useMockData";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Filter, Plus, Eye, Check, X } from "lucide-react";

interface RequestManagementProps {
  activeTab: string;
}

export default function RequestManagement({ activeTab }: RequestManagementProps) {
  const [filters, setFilters] = useState({
    requestType: "",
    status: "",
    dateRange: "",
  });

  const { user } = useAuth();
  const { toast } = useToast();
  const { getRequests, updateRequestStatus, getPendingRequests } = useMockRequests();

  const getRequestsData = () => {
    switch (activeTab) {
      case "approvals":
        return getPendingRequests();
      case "history":
        return getRequests();
      case "modify":
        return getRequests({ userId: user?.id });
      default:
        return getRequests();
    }
  };

  const requests = getRequestsData();

  const handleApprove = (requestId: number) => {
    updateRequestStatus(requestId, "approved", user?.id);
    toast({
      title: "Success",
      description: "Request approved successfully",
    });
  };

  const handleReject = (requestId: number) => {
    updateRequestStatus(requestId, "rejected", user?.id);
    toast({
      title: "Success",
      description: "Request rejected successfully",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-warning text-white';
      case 'approved': return 'bg-success text-white';
      case 'rejected': return 'bg-error text-white';
      case 'partial_success': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRequestTypeColor = (type: string) => {
    const colors = [
      'bg-blue-100 text-blue-800',
      'bg-green-100 text-green-800',
      'bg-purple-100 text-purple-800',
      'bg-orange-100 text-orange-800',
      'bg-pink-100 text-pink-800',
    ];
    return colors[type.length % colors.length];
  };

  const canApprove = user?.role === "supervisor" || user?.role === "admin";
  const canCreateRequests = user?.role !== "readonly";

  const filteredRequests = requests?.filter((request: any) => {
    if (filters.requestType && request.requestType !== filters.requestType) return false;
    if (filters.status && request.status !== filters.status) return false;
    return true;
  });

  const getTitle = () => {
    switch (activeTab) {
      case "approvals":
        return "Pending Approvals";
      case "history":
        return "Request History";
      case "modify":
        return "My Modification Requests";
      default:
        return "Request Management";
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">{getTitle()}</h3>
          {canCreateRequests && activeTab === "modify" && (
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Request
            </Button>
          )}
        </div>

        {/* Filters */}
        <div className="p-6 border border-gray-200 rounded-lg bg-gray-50 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2">Request Type</Label>
              <Select value={filters.requestType} onValueChange={(value) => setFilters(prev => ({ ...prev, requestType: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">All Types</SelectItem>
                  <SelectItem value="Name Modification">Name Modification</SelectItem>
                  <SelectItem value="DOB Modification">DOB Modification</SelectItem>
                  <SelectItem value="Gender Modification">Gender Modification</SelectItem>
                  <SelectItem value="Email & Mobile Modification">Contact Update</SelectItem>
                  <SelectItem value="Bank Details">Bank Details</SelectItem>
                  <SelectItem value="Address Change">Address Change</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2">Status</Label>
              <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="partial_success">Partial Success</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2">Date Range</Label>
              <Input
                type="date"
                value={filters.dateRange}
                onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
              />
            </div>
            
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2">&nbsp;</Label>
              <Button variant="secondary" className="w-full">
                <Filter className="mr-2 h-4 w-4" />
                Apply Filter
              </Button>
            </div>
          </div>
        </div>

        {/* Requests Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Requested By</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    No requests found
                  </TableCell>
                </TableRow>
              ) : (
                filteredRequests?.map((request: any) => (
                  <TableRow key={request.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{request.requestId}</TableCell>
                    <TableCell>
                      <Badge className={getRequestTypeColor(request.requestType)}>
                        {request.requestType}
                      </Badge>
                    </TableCell>
                    <TableCell>{request.createdBy}</TableCell>
                    <TableCell>{new Date(request.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(request.status)}>
                        {request.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="space-x-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3" />
                      </Button>
                      {canApprove && request.status === 'pending' && activeTab === "approvals" && (
                        <>
                          <Button
                            size="sm"
                            className="bg-success hover:bg-green-600"
                            onClick={() => handleApprove(request.id)}
                          >
                            <Check className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleReject(request.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {filteredRequests && filteredRequests.length > 0 && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              Showing 1 to {filteredRequests.length} of {filteredRequests.length} results
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button size="sm">1</Button>
              <Button variant="outline" size="sm" disabled>
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
