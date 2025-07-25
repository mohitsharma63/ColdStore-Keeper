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
import { Search, Plus, Thermometer, AlertTriangle, CheckCircle } from "lucide-react";
import { useState } from "react";
import type { ColdStorage } from "@shared/schema";

export default function ColdStoragePage() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: coldStorageUnits } = useQuery<ColdStorage[]>({
    queryKey: ["/api/cold-storage"],
  });

  const getStatusBadge = (status: string) => {
    const colors = {
      optimal: 'bg-green-100 text-green-800',
      warning: 'bg-yellow-100 text-yellow-800',
      critical: 'bg-red-100 text-red-800'
    };
    
    const icons = {
      optimal: <CheckCircle className="h-3 w-3 mr-1" />,
      warning: <AlertTriangle className="h-3 w-3 mr-1" />,
      critical: <AlertTriangle className="h-3 w-3 mr-1" />
    };
    
    return (
      <Badge className={colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>
        {icons[status as keyof typeof icons]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getTemperatureStatus = (temperature: string) => {
    const temp = parseFloat(temperature);
    if (temp <= 5) return { color: 'text-green-600', status: 'Optimal' };
    if (temp <= 8) return { color: 'text-yellow-600', status: 'Warning' };
    return { color: 'text-red-600', status: 'Critical' };
  };

  const filteredUnits = coldStorageUnits?.filter(unit =>
    unit.unitName.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getOverallStats = () => {
    if (!coldStorageUnits) return { total: 0, optimal: 0, warning: 0, critical: 0 };
    
    return coldStorageUnits.reduce((acc, unit) => {
      acc.total++;
      if (unit.status === 'optimal') acc.optimal++;
      else if (unit.status === 'warning') acc.warning++;
      else if (unit.status === 'critical') acc.critical++;
      return acc;
    }, { total: 0, optimal: 0, warning: 0, critical: 0 });
  };

  const stats = getOverallStats();

  return (
    <>
      {/* Header */}
      <header className="bg-white shadow-sm p-4 lg:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-dark-grey">Cold Storage Management</h1>
            <p className="text-gray-600">Monitor temperature, humidity, and storage conditions</p>
          </div>
          <Button className="bg-market-green hover:bg-green-600 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add Storage Unit
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="p-4 lg:p-6 space-y-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Units</p>
                <p className="text-2xl font-bold text-dark-grey">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Thermometer className="text-blue-600 h-5 w-5" />
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Optimal</p>
                <p className="text-2xl font-bold text-green-600">{stats.optimal}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="text-green-600 h-5 w-5" />
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Warning</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.warning}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="text-yellow-600 h-5 w-5" />
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Critical</p>
                <p className="text-2xl font-bold text-red-600">{stats.critical}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="text-red-600 h-5 w-5" />
              </div>
            </div>
          </Card>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search storage units..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Storage Units Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Thermometer className="h-5 w-5 mr-2" />
              Cold Storage Units ({filteredUnits.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Unit Name</TableHead>
                    <TableHead>Temperature</TableHead>
                    <TableHead>Humidity</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Current Load</TableHead>
                    <TableHead>Utilization</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Maintenance</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUnits.map((unit) => {
                    const capacity = parseFloat(unit.capacity);
                    const currentLoad = parseFloat(unit.currentLoad || "0");
                    const utilization = capacity > 0 ? Math.round((currentLoad / capacity) * 100) : 0;
                    const tempStatus = getTemperatureStatus(unit.temperature);

                    return (
                      <TableRow key={unit.id}>
                        <TableCell className="font-medium">{unit.unitName}</TableCell>
                        <TableCell>
                          <span className={`font-semibold ${tempStatus.color}`}>
                            {unit.temperature}°C
                          </span>
                        </TableCell>
                        <TableCell>{unit.humidity}%</TableCell>
                        <TableCell>{capacity.toLocaleString()} kg</TableCell>
                        <TableCell>{currentLoad.toLocaleString()} kg</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                              <div 
                                className={`h-2 rounded-full ${utilization > 90 ? 'bg-red-500' : utilization > 70 ? 'bg-yellow-500' : 'bg-green-500'}`}
                                style={{ width: `${Math.min(utilization, 100)}%` }}
                              ></div>
                            </div>
                            <span className="text-sm">{utilization}%</span>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(unit.status)}</TableCell>
                        <TableCell>
                          {unit.lastMaintenance ? 
                            new Date(unit.lastMaintenance).toLocaleDateString() : 
                            <span className="text-gray-400">Not recorded</span>
                          }
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">Monitor</Button>
                            <Button variant="outline" size="sm">Settings</Button>
                            <Button variant="outline" size="sm" className="text-blue-600 hover:text-blue-800">
                              Maintenance
                            </Button>
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
