import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ColdStorage } from "@shared/schema";

export default function ColdStorageStatus() {
  const { data: coldStorageUnits } = useQuery<ColdStorage[]>({
    queryKey: ["/api/cold-storage"],
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'optimal':
        return <Badge className="bg-green-100 text-green-800">Optimal</Badge>;
      case 'warning':
        return <Badge className="bg-orange-100 text-orange-800">Warning</Badge>;
      case 'critical':
        return <Badge className="bg-red-100 text-red-800">Critical</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  const getStatusBackgroundColor = (status: string) => {
    switch (status) {
      case 'optimal':
        return 'bg-cyan-50';
      case 'warning':
        return 'bg-orange-50';
      case 'critical':
        return 'bg-red-50';
      default:
        return 'bg-gray-50';
    }
  };

  const getTemperatureColor = (temperature: string, status: string) => {
    if (status === 'warning' || status === 'critical') {
      return 'text-orange-600';
    }
    return 'text-gray-900';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-dark-grey">Cold Storage Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {coldStorageUnits?.map((unit) => {
            const capacityPercentage = Math.round((parseFloat(unit.currentLoad || "0") / parseFloat(unit.capacity)) * 100);

            return (
              <div key={unit.id} className={`p-4 ${getStatusBackgroundColor(unit.status)} rounded-lg`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium">{unit.unitName}</span>
                  {getStatusBadge(unit.status)}
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Temperature:</span>
                    <span className={`font-bold ml-1 ${getTemperatureColor(unit.temperature, unit.status)}`}>
                      {unit.temperature}°C
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Humidity:</span>
                    <span className="font-bold ml-1">{unit.humidity}%</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Capacity:</span>
                    <span className="font-bold ml-1">{capacityPercentage}%</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Items:</span>
                    <span className="font-bold ml-1">{parseFloat(unit.currentLoad || "0").toLocaleString()} kg</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
