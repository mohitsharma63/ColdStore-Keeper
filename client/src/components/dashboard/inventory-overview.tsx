import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, Apple, Wheat } from "lucide-react";
import type { Inventory } from "@shared/schema";

export default function InventoryOverview() {
  const { data: inventory } = useQuery<Inventory[]>({
    queryKey: ["/api/inventory"],
  });

  const getCategoryStats = () => {
    if (!inventory) return [];

    const categories = {
      vegetables: { icon: Leaf, color: 'green', items: [] as Inventory[] },
      fruits: { icon: Apple, color: 'orange', items: [] as Inventory[] },
      grains: { icon: Wheat, color: 'yellow', items: [] as Inventory[] }
    };

    inventory.forEach(item => {
      if (categories[item.category as keyof typeof categories]) {
        categories[item.category as keyof typeof categories].items.push(item);
      }
    });

    return Object.entries(categories).map(([category, data]) => {
      const totalStock = data.items.reduce((sum, item) => sum + parseFloat(item.currentStock), 0);
      const avgQuality = data.items.reduce((sum, item) => sum + item.qualityPercentage, 0) / data.items.length || 0;
      
      return {
        category: category.charAt(0).toUpperCase() + category.slice(1),
        totalStock: Math.round(totalStock),
        avgQuality: Math.round(avgQuality),
        icon: data.icon,
        color: data.color
      };
    });
  };

  const categoryStats = getCategoryStats();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-dark-grey">Inventory Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {categoryStats.map((category) => {
            const IconComponent = category.icon;
            const colorClasses = {
              green: 'bg-green-100 text-green-600',
              orange: 'bg-orange-100 text-orange-600',
              yellow: 'bg-yellow-100 text-yellow-600'
            };

            return (
              <div key={category.category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${colorClasses[category.color as keyof typeof colorClasses]}`}>
                    <IconComponent className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="font-medium">{category.category}</span>
                    <div className="text-sm text-gray-500">Fresh produce</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-dark-grey">{category.totalStock.toLocaleString()} kg</div>
                  <div className={`text-sm ${category.color === 'green' ? 'text-green-600' : category.color === 'orange' ? 'text-orange-600' : 'text-yellow-600'}`}>
                    {category.avgQuality}% quality
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
