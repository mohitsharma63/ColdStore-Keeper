import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Box, Truck, Wrench, ArrowUp, ArrowRight, AlertTriangle } from "lucide-react";
import type { Crate } from "@shared/schema";

export default function CratesManagement() {
  const { data: crates } = useQuery<Crate[]>({
    queryKey: ["/api/crates"],
  });

  const getCrateStats = () => {
    if (!crates) return { available: 0, inTransit: 0, underRepair: 0 };

    return {
      available: crates.filter(crate => crate.status === "available").length,
      inTransit: crates.filter(crate => crate.status === "in_transit").length,
      underRepair: crates.filter(crate => crate.status === "under_repair").length,
    };
  };

  const stats = getCrateStats();

  const statusItems = [
    {
      label: "Available Crates",
      count: stats.available,
      icon: Box,
      bgColor: "bg-blue-50",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      statusIcon: ArrowUp,
      statusColor: "text-blue-600"
    },
    {
      label: "In Transit",
      count: stats.inTransit,
      icon: Truck,
      bgColor: "bg-yellow-50",
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
      statusIcon: ArrowRight,
      statusColor: "text-yellow-600"
    },
    {
      label: "Under Repair",
      count: stats.underRepair,
      icon: Wrench,
      bgColor: "bg-red-50",
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      statusIcon: AlertTriangle,
      statusColor: "text-red-600"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-dark-grey">Crates Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {statusItems.map((item) => {
            const IconComponent = item.icon;
            const StatusIcon = item.statusIcon;

            return (
              <div key={item.label} className={`flex items-center justify-between p-4 ${item.bgColor} rounded-lg`}>
                <div className="flex items-center">
                  <div className={`w-12 h-12 ${item.iconBg} rounded-lg flex items-center justify-center mr-4`}>
                    <IconComponent className={`h-5 w-5 ${item.iconColor}`} />
                  </div>
                  <div>
                    <div className="font-medium">{item.label}</div>
                    <div className="text-2xl font-bold text-dark-grey">{item.count}</div>
                  </div>
                </div>
                <div className={item.statusColor}>
                  <StatusIcon className="h-5 w-5" />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
