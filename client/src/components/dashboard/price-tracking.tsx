import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Inventory } from "@shared/schema";

export default function PriceTracking() {
  const { data: inventory } = useQuery<Inventory[]>({
    queryKey: ["/api/inventory"],
  });

  const getFeaturedItems = () => {
    if (!inventory) return [];
    
    return inventory.slice(0, 3).map(item => ({
      name: item.itemName,
      price: parseFloat(item.unitPrice),
      quality: item.quality,
      change: Math.random() > 0.5 ? '+' : '-',
      changeAmount: Math.floor(Math.random() * 5) + 1,
      lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }));
  };

  const featuredItems = getFeaturedItems();

  const getQualityBadgeColor = (quality: string) => {
    switch (quality) {
      case 'excellent':
        return 'bg-market-green text-white';
      case 'good':
        return 'bg-market-orange text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-dark-grey">Today's Market Rates</CardTitle>
          <Button variant="ghost" className="text-market-green text-sm font-medium">
            View All Rates
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredItems.map((item, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{item.name}</span>
                <Badge className={getQualityBadgeColor(item.quality)}>
                  {item.quality}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-dark-grey">₹{item.price}/kg</span>
                <span className={`text-sm ${item.change === '+' ? 'text-green-500' : 'text-red-500'}`}>
                  {item.change}₹{item.changeAmount}
                </span>
              </div>
              <div className="text-sm text-gray-500 mt-1">
                Last updated: {item.lastUpdated}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
