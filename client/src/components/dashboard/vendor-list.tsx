import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Vendor } from "@shared/schema";

export default function VendorList() {
  const { data: vendors } = useQuery<Vendor[]>({
    queryKey: ["/api/vendors"],
  });

  const getTopVendors = () => {
    if (!vendors) return [];
    
    return vendors
      .sort((a, b) => parseFloat(b.dailySales || "0") - parseFloat(a.dailySales || "0"))
      .slice(0, 3);
  };

  const topVendors = getTopVendors();

  const getVendorInitials = (name: string) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase();
  };

  const getBorderColor = (index: number) => {
    const colors = ['border-market-green', 'border-market-orange', 'border-gray-300'];
    return colors[index] || 'border-gray-300';
  };

  const getBackgroundColor = (index: number) => {
    const colors = ['bg-light-green', 'bg-light-orange', 'bg-gray-50'];
    return colors[index] || 'bg-gray-50';
  };

  const getInitialsBackgroundColor = (index: number) => {
    const colors = ['bg-market-green', 'bg-market-orange', 'bg-gray-500'];
    return colors[index] || 'bg-gray-500';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-dark-grey">Top Performing Vendors</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topVendors.map((vendor, index) => (
            <div key={vendor.id} className={`flex items-center justify-between p-3 border-l-4 ${getBorderColor(index)} ${getBackgroundColor(index)} rounded`}>
              <div className="flex items-center">
                <div className={`w-10 h-10 ${getInitialsBackgroundColor(index)} rounded-full flex items-center justify-center mr-3`}>
                  <span className="text-white font-bold text-sm">
                    {getVendorInitials(vendor.name)}
                  </span>
                </div>
                <div>
                  <span className="font-medium">{vendor.name}</span>
                  <div className="text-sm text-gray-500">Shop #{vendor.shopNumber}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-dark-grey">₹{parseFloat(vendor.dailySales || "0").toLocaleString()}</div>
                <div className={`text-sm ${index === 0 ? 'text-green-600' : index === 1 ? 'text-orange-600' : 'text-gray-600'}`}>
                  Today's sales
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
