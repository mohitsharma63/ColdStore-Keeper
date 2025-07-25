import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Plus, Package } from "lucide-react";
import { useState } from "react";
import type { Inventory, Vendor } from "@shared/schema";

export default function Inventory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const { data: inventory } = useQuery<Inventory[]>({
    queryKey: ["/api/inventory"],
  });

  const { data: vendors } = useQuery<Vendor[]>({
    queryKey: ["/api/vendors"],
  });

  const getVendorName = (vendorId: number | null) => {
    if (!vendorId || !vendors) return "Unassigned";
    const vendor = vendors.find(v => v.id === vendorId);
    return vendor?.name || "Unknown Vendor";
  };

  const getQualityBadge = (quality: string, percentage: number) => {
    const color = percentage >= 95 ? 'bg-green-100 text-green-800' :
                 percentage >= 85 ? 'bg-yellow-100 text-yellow-800' :
                 'bg-red-100 text-red-800';
    
    return <Badge className={color}>{quality} ({percentage}%)</Badge>;
  };

  const getCategoryBadge = (category: string) => {
    const colors = {
      vegetables: 'bg-green-100 text-green-800',
      fruits: 'bg-orange-100 text-orange-800',
      grains: 'bg-yellow-100 text-yellow-800',
      spices: 'bg-red-100 text-red-800'
    };
    
    return <Badge className={colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>
      {category}
    </Badge>;
  };

  const filteredInventory = inventory?.filter(item => {
    const matchesSearch = item.itemName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }) || [];

  const categories = ["all", "vegetables", "fruits", "grains", "spices"];

  return (
    <>
      {/* Header */}
      <header className="bg-white shadow-sm p-4 lg:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-dark-grey">Inventory Management</h1>
            <p className="text-gray-600">Manage your market inventory and stock levels</p>
          </div>
          <Button className="bg-market-green hover:bg-green-600 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="p-4 lg:p-6 space-y-6">
        {/* Filters and Search */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search inventory items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category)}
                    className={selectedCategory === category ? "bg-market-green hover:bg-green-600" : ""}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Inventory Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="h-5 w-5 mr-2" />
              Inventory Items ({filteredInventory.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Current Stock</TableHead>
                    <TableHead>Unit Price</TableHead>
                    <TableHead>Quality</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInventory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.itemName}</TableCell>
                      <TableCell>{getCategoryBadge(item.category)}</TableCell>
                      <TableCell>{parseFloat(item.currentStock).toLocaleString()} kg</TableCell>
                      <TableCell>₹{parseFloat(item.unitPrice).toFixed(2)}/kg</TableCell>
                      <TableCell>{getQualityBadge(item.quality, item.qualityPercentage)}</TableCell>
                      <TableCell>{getVendorName(item.vendorId)}</TableCell>
                      <TableCell>
                        {item.lastUpdated ? new Date(item.lastUpdated).toLocaleDateString() : "N/A"}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">Edit</Button>
                          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-800">
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
