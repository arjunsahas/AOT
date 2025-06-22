import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

interface CustomerSearchProps {
  onCustomerSelect?: (customer: any) => void;
}

export default function CustomerSearch({ onCustomerSelect }: CustomerSearchProps) {
  const [searchType, setSearchType] = useState("ucc");
  const [searchValue, setSearchValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: searchResults, isLoading } = useQuery({
    queryKey: ["/api/customers/search", searchTerm, searchType],
    enabled: !!searchTerm,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      setSearchTerm(searchValue.trim());
    }
  };

  const quickSearchOptions = [
    { label: "UCC123456789", value: "123456789012", type: "ucc" },
    { label: "ABCDE1234F", value: "ABCDE1234F", type: "pan" },
    { label: "9876543210", value: "9876543210", type: "mobile" },
  ];

  const handleQuickSearch = (value: string, type: string) => {
    setSearchType(type);
    setSearchValue(value);
    setSearchTerm(value);
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Search</h3>
        
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2">Search Type</Label>
            <Select value={searchType} onValueChange={setSearchType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ucc">UCC</SelectItem>
                <SelectItem value="pan">PAN</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="mobile">Mobile</SelectItem>
                <SelectItem value="email">Email</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="lg:col-span-2">
            <Label className="text-sm font-medium text-gray-700 mb-2">Search Value</Label>
            <Input
              type="text"
              placeholder="Enter UCC, PAN, Name, Mobile or Email"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
          
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2">&nbsp;</Label>
            <Button type="submit" className="w-full" disabled={isLoading}>
              <Search className="mr-2 h-4 w-4" />
              {isLoading ? "Searching..." : "Search"}
            </Button>
          </div>
        </form>

        {/* Quick Search Options */}
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-gray-500">Quick Search:</span>
          {quickSearchOptions.map((option) => (
            <Button
              key={option.value}
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => handleQuickSearch(option.value, option.type)}
            >
              {option.label}
            </Button>
          ))}
        </div>

        {/* Search Results */}
        {searchResults && searchResults.length > 0 && (
          <div className="mt-4 border-t border-gray-200 pt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Search Results:</h4>
            <div className="space-y-2">
              {searchResults.map((customer: any) => (
                <div
                  key={customer.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
                  onClick={() => onCustomerSelect?.(customer)}
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">{customer.fullName}</p>
                    <p className="text-xs text-gray-500">UCC: {customer.ucc} | PAN: {customer.pan}</p>
                  </div>
                  <Button size="sm" variant="outline">Select</Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {searchResults && searchResults.length === 0 && searchTerm && (
          <div className="mt-4 border-t border-gray-200 pt-4">
            <p className="text-sm text-gray-500">No customers found matching your search criteria.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
