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
import { Search, Plus, Box, MapPin } from "lucide-react";
import { useState } from "react";
import type { Crate, Vendor } from "@shared/schema";

export default function Crates() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const { data: crates } = useQuery<Crate[]>({
    queryKey: ["/api/crates"],
  });

  const { data: vendors } = useQuery<Vendor[]>({
    queryKey: ["/api/vendors"],
  });

  const getVendorName = (vendorId: number | null) => {
    if (!vendorId || !vendors) return "Unassigned";
    const vendor = vendors.find(v => v.id === vendorId);
    return vendor?.name || "Unknown Vendor";
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      available: 'bg-green-100 text-green-800',
      in_transit: 'bg-yellow-100 text-yellow-800',
      under_repair: 'bg-red-100 text-red-800'
    };
    
    const labels = {
      available: 'Available',
      in_transit: 'In Transit',
      under_repair: 'Under Repair'
    };
    
    return <Badge className={colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>
      {labels[status as keyof typeof labels] || status}
    </Badge>;
  };

  const filteredCrates = crates?.filter(crate => {
    const matchesSearch = crate.crateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (crate.lastLocation && crate.lastLocation.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = selectedStatus === "all" || crate.status === selectedStatus;
    return matchesSearch && matchesStatus;
  }) || [];

  const statuses = ["all", "available", "in_transit", "under_repair"];

  return (
    <>
      {/* Header */}
      <header className="bg-white shadow-sm p-4 lg:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-dark-grey">Crates Management</h1>
            <p className="text-gray-600">Track and manage storage crates and containers</p>
          </div>
          <Button className="bg-market-green hover:bg-green-600 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add Crate
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
                    placeholder="Search crates by number or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                {statuses.map((status) => (
                  <Button
                    key={status}
                    variant={selectedStatus === status ? "default" : "outline"}
                    onClick={() => setSelectedStatus(status)}
                    className={selectedStatus === status ? "bg-market-green hover:bg-green-600" : ""}
                  >
                    {status === "all" ? "All" : status.replace("_", " ").split(" ").map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(" ")}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Crates Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Box className="h-5 w-5 mr-2" />
              Crates Inventory ({filteredCrates.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Crate Number</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Current Load</TableHead>
                    <TableHead>Load Percentage</TableHead>
                    <TableHead>Assigned Vendor</TableHead>
                    <TableHead>Last Location</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCrates.map((crate) => {
                    const capacity = parseFloat(crate.capacity);
                    const currentLoad = parseFloat(crate.currentLoad || "0");
                    const loadPercentage = capacity > 0 ? Math.round((currentLoad / capacity) * 100) : 0;

                    return (
                      <TableRow key={crate.id}>
                        <TableCell className="font-medium font-mono">{crate.crateNumber}</TableCell>
                        <TableCell>{getStatusBadge(crate.status)}</TableCell>
                        <TableCell>{capacity.toFixed(1)} kg</TableCell>
                        <TableCell>{currentLoad.toFixed(1)} kg</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                              <div 
                                className={`h-2 rounded-full ${loadPercentage > 80 ? 'bg-red-500' : loadPercentage > 50 ? 'bg-yellow-500' : 'bg-green-500'}`}
                                style={{ width: `${Math.min(loadPercentage, 100)}%` }}
                              ></div>
                            </div>
                            <span className="text-sm">{loadPercentage}%</span>
                          </div>
                        </TableCell>
                        <TableCell>{getVendorName(crate.assignedVendor)}</TableCell>
                        <TableCell>
                          {crate.lastLocation ? (
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                              {crate.lastLocation}
                            </div>
                          ) : (
                            <span className="text-gray-400">Not set</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">Track</Button>
                            <Button variant="outline" size="sm">Edit</Button>
                            {crate.status === "under_repair" && (
                              <Button variant="outline" size="sm" className="text-green-600 hover:text-green-800">
                                Mark Fixed
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
