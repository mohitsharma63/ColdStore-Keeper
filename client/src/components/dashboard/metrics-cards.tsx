import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Store, IndianRupee, Box, Thermometer } from "lucide-react";
import type { Vendor, Crate, ColdStorage } from "@shared/schema";

export default function MetricsCards() {
  const { data: vendors } = useQuery<Vendor[]>({
    queryKey: ["/api/vendors"],
  });

  const { data: crates } = useQuery<Crate[]>({
    queryKey: ["/api/crates"],
  });

  const { data: coldStorageUnits } = useQuery<ColdStorage[]>({
    queryKey: ["/api/cold-storage"],
  });

  const totalVendors = vendors?.length || 0;
  const activeCrates = crates?.filter(crate => crate.status === "available").length || 0;
  const inTransitCrates = crates?.filter(crate => crate.status === "in_transit").length || 0;
  const dailySales = vendors?.reduce((sum, vendor) => sum + parseFloat(vendor.dailySales || "0"), 0) || 0;
  const avgColdStorageCapacity = coldStorageUnits?.reduce((sum, unit) => {
    const capacity = parseFloat(unit.capacity);
    const currentLoad = parseFloat(unit.currentLoad || "0");
    return sum + (currentLoad / capacity * 100);
  }, 0) / (coldStorageUnits?.length || 1) || 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Vendors</p>
            <p className="text-2xl font-bold text-dark-grey">{totalVendors}</p>
          </div>
          <div className="w-12 h-12 bg-light-green rounded-lg flex items-center justify-center">
            <Store className="text-market-green h-5 w-5" />
          </div>
        </div>
        <div className="mt-2 flex items-center text-sm">
          <span className="text-green-500">+12%</span>
          <span className="text-gray-500 ml-1">vs last month</span>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Daily Sales</p>
            <p className="text-2xl font-bold text-dark-grey">₹{dailySales.toLocaleString()}</p>
          </div>
          <div className="w-12 h-12 bg-light-orange rounded-lg flex items-center justify-center">
            <IndianRupee className="text-market-orange h-5 w-5" />
          </div>
        </div>
        <div className="mt-2 flex items-center text-sm">
          <span className="text-green-500">+8%</span>
          <span className="text-gray-500 ml-1">vs yesterday</span>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Active Crates</p>
            <p className="text-2xl font-bold text-dark-grey">{activeCrates}</p>
          </div>
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Box className="text-blue-600 h-5 w-5" />
          </div>
        </div>
        <div className="mt-2 flex items-center text-sm">
          <span className="text-blue-500">{inTransitCrates}</span>
          <span className="text-gray-500 ml-1">in transit</span>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Cold Storage</p>
            <p className="text-2xl font-bold text-dark-grey">{Math.round(avgColdStorageCapacity)}%</p>
          </div>
          <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
            <Thermometer className="text-cyan-600 h-5 w-5" />
          </div>
        </div>
        <div className="mt-2 flex items-center text-sm">
          <span className="text-cyan-500">4°C</span>
          <span className="text-gray-500 ml-1">optimal temp</span>
        </div>
      </Card>
    </div>
  );
}
