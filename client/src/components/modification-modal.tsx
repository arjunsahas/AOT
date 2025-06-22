import { useState } from "react";
import { useMockRequests } from "@/hooks/useMockData";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Upload, Send } from "lucide-react";

interface ModificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: any;
}

export default function ModificationModal({ isOpen, onClose, customer }: ModificationModalProps) {
  const [formData, setFormData] = useState({
    requestType: "",
    currentValue: "",
    newValue: "",
    reason: "",
  });

  const { toast } = useToast();
  const { user } = useAuth();
  const { createRequest } = useMockRequests();

  const requestTypes = [
    "Name Modification",
    "DOB Modification",
    "Gender Modification",
    "Marital Status Modification",
    "Father/Spouse Name Modification",
    "DDPI/EDIS Updation and Modification",
    "Brokerage Details Modification",
    "Email & Mobile Modification",
    "Bank Delink Request",
    "Additional Demat Details Updation",
    "Proof Details Updation/Modification",
    "Exchange Details Modification",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.requestType || !formData.newValue || !formData.reason) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    createRequest({
      customerId: customer.id,
      requestType: formData.requestType,
      currentValue: { value: formData.currentValue },
      newValue: { value: formData.newValue },
      reason: formData.reason,
      createdBy: user?.id || "unknown",
    });

    toast({
      title: "Success",
      description: "Modification request created successfully",
    });
    
    onClose();
    setFormData({
      requestType: "",
      currentValue: "",
      newValue: "",
      reason: "",
    });
  };

  const getCurrentValue = (requestType: string) => {
    switch (requestType) {
      case "Name Modification":
        return customer.fullName;
      case "DOB Modification":
        return customer.dateOfBirth;
      case "Gender Modification":
        return customer.gender;
      case "Marital Status Modification":
        return customer.maritalStatus;
      case "Father/Spouse Name Modification":
        return customer.fatherName;
      case "Email & Mobile Modification":
        return `${customer.email} | ${customer.mobile}`;
      default:
        return "";
    }
  };

  const handleRequestTypeChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      requestType: value,
      currentValue: getCurrentValue(value),
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Modification Request</DialogTitle>
          <DialogDescription>
            Submit a new modification request for customer {customer?.fullName}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Request Type Selection */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2">Request Type</Label>
            <Select value={formData.requestType} onValueChange={handleRequestTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select request type..." />
              </SelectTrigger>
              <SelectContent>
                {requestTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Fields to Modify */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2">Current Value</Label>
              <Input
                type="text"
                value={formData.currentValue}
                onChange={(e) => setFormData(prev => ({ ...prev, currentValue: e.target.value }))}
                className="bg-gray-50"
                readOnly
                placeholder="Current information will appear here"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2">New Value *</Label>
              <Input
                type="text"
                value={formData.newValue}
                onChange={(e) => setFormData(prev => ({ ...prev, newValue: e.target.value }))}
                placeholder="Enter new value"
                required
              />
            </div>
          </div>

          {/* Reason for Change */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2">Reason for Change *</Label>
            <Textarea
              rows={3}
              value={formData.reason}
              onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
              placeholder="Provide reason for this modification..."
              required
            />
          </div>

          {/* Document Upload */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2">Supporting Documents</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400">
              <Upload className="mx-auto text-gray-400 text-3xl mb-2" />
              <p className="text-sm text-gray-500 mb-2">Drag and drop files here, or click to select</p>
              <input type="file" multiple className="hidden" />
              <Button type="button" variant="outline" size="sm">
                Choose Files
              </Button>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              <Send className="mr-2 h-4 w-4" />
              Submit Request
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
