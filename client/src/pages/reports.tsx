import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  BarChart3, 
  Download, 
  TrendingUp, 
  TrendingDown, 
  IndianRupee,
  Package,
  Store,
  Users,
  FileText,
  Calendar
} from "lucide-react";
import type { Vendor, Inventory, Transaction, Customer } from "@shared/schema";

export default function Reports() {
  const { data: vendors } = useQuery<Vendor[]>({
    queryKey: ["/api/vendors"],
  });

  const { data: inventory } = useQuery<Inventory[]>({
    queryKey: ["/api/inventory"],
  });

  const { data: transactions } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
  });

  const { data: customers } = useQuery<Customer[]>({
    queryKey: ["/api/customers"],
  });

  // Calculate key reports and metrics
  const getReportData = () => {
    const totalSales = transactions?.reduce((sum, t) => sum + parseFloat(t.totalAmount), 0) || 0;
    const totalStock = inventory?.reduce((sum, item) => sum + parseFloat(item.currentStock), 0) || 0;
    const totalStockValue = inventory?.reduce((sum, item) => 
      sum + (parseFloat(item.currentStock) * parseFloat(item.unitPrice)), 0) || 0;
    
    const categoryBreakdown = inventory?.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + parseFloat(item.currentStock);
      return acc;
    }, {} as Record<string, number>) || {};

    const vendorPerformance = vendors?.map(vendor => ({
      ...vendor,
      salesAmount: parseFloat(vendor.dailySales || "0")
    })).sort((a, b) => b.salesAmount - a.salesAmount) || [];

    const completedTransactions = transactions?.filter(t => t.status === 'completed').length || 0;
    const pendingTransactions = transactions?.filter(t => t.status === 'pending').length || 0;

    return {
      totalSales,
      totalStock,
      totalStockValue,
      categoryBreakdown,
      vendorPerformance,
      completedTransactions,
      pendingTransactions
    };
  };

  const reportData = getReportData();

  const reportCategories = [
    {
      title: "Sales Report",
      description: "Daily sales and revenue analysis",
      icon: IndianRupee,
      color: "bg-green-100 text-green-800",
      action: () => console.log("Generate sales report")
    },
    {
      title: "Inventory Report",
      description: "Stock levels and inventory valuation",
      icon: Package,
      color: "bg-blue-100 text-blue-800",
      action: () => console.log("Generate inventory report")
    },
    {
      title: "Vendor Performance",
      description: "Vendor sales and performance metrics",
      icon: Store,
      color: "bg-purple-100 text-purple-800",
      action: () => console.log("Generate vendor report")
    },
    {
      title: "Customer Analysis",
      description: "Customer purchase patterns and demographics",
      icon: Users,
      color: "bg-orange-100 text-orange-800",
      action: () => console.log("Generate customer report")
    }
  ];

  return (
    <>
      {/* Header */}
      <header className="bg-white shadow-sm p-4 lg:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-dark-grey">Reports & Analytics</h1>
            <p className="text-gray-600">Generate reports and analyze market performance</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="text-market-green border-market-green hover:bg-light-green">
              <Calendar className="h-4 w-4 mr-2" />
              Custom Date Range
            </Button>
            <Button className="bg-market-green hover:bg-green-600 text-white">
              <Download className="h-4 w-4 mr-2" />
              Export All
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="p-4 lg:p-6 space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Sales</p>
                <p className="text-2xl font-bold text-dark-grey">₹{reportData.totalSales.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <IndianRupee className="text-green-600 h-5 w-5" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500">+8.2%</span>
              <span className="text-gray-500 ml-1">vs last month</span>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Stock Value</p>
                <p className="text-2xl font-bold text-dark-grey">₹{reportData.totalStockValue.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="text-blue-600 h-5 w-5" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500">+12.5%</span>
              <span className="text-gray-500 ml-1">vs last month</span>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Stock</p>
                <p className="text-2xl font-bold text-dark-grey">{reportData.totalStock.toLocaleString()} kg</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Package className="text-yellow-600 h-5 w-5" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
              <span className="text-red-500">-3.1%</span>
              <span className="text-gray-500 ml-1">vs last month</span>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Vendors</p>
                <p className="text-2xl font-bold text-dark-grey">{vendors?.filter(v => v.status === 'active').length || 0}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Store className="text-purple-600 h-5 w-5" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500">+5 new</span>
              <span className="text-gray-500 ml-1">this month</span>
            </div>
          </Card>
        </div>

        {/* Report Categories */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Available Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reportCategories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <Card key={category.title} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${category.color.replace('text-', 'bg-').replace('-800', '-100')}`}>
                          <IconComponent className={`h-5 w-5 ${category.color.replace('bg-', 'text-').replace('-100', '-600')}`} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-dark-grey">{category.title}</h3>
                          <p className="text-sm text-gray-600">{category.description}</p>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={category.action}
                        className="text-market-green border-market-green hover:bg-light-green"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Generate
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Vendor Performance Table */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Top Performing Vendors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportData.vendorPerformance.slice(0, 5).map((vendor, index) => (
                  <div key={vendor.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                        index === 0 ? 'bg-market-green text-white' :
                        index === 1 ? 'bg-market-orange text-white' :
                        'bg-gray-400 text-white'
                      }`}>
                        <span className="text-sm font-bold">#{index + 1}</span>
                      </div>
                      <div>
                        <div className="font-medium">{vendor.name}</div>
                        <div className="text-sm text-gray-500">Shop #{vendor.shopNumber}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-dark-grey">₹{vendor.salesAmount.toLocaleString()}</div>
                      <div className="text-sm text-gray-500">Daily sales</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Category Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(reportData.categoryBreakdown).map(([category, stock]) => {
                  const percentage = (stock / reportData.totalStock) * 100;
                  const colors = {
                    vegetables: 'bg-green-500',
                    fruits: 'bg-orange-500',
                    grains: 'bg-yellow-500',
                    spices: 'bg-red-500'
                  };

                  return (
                    <div key={category} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium capitalize">{category}</span>
                        <span>{stock.toLocaleString()} kg ({percentage.toFixed(1)}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${colors[category as keyof typeof colors] || 'bg-gray-500'}`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transaction Status */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{reportData.completedTransactions}</div>
                <div className="text-sm text-gray-600">Completed Transactions</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{reportData.pendingTransactions}</div>
                <div className="text-sm text-gray-600">Pending Transactions</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">₹{(reportData.totalSales / (reportData.completedTransactions || 1)).toFixed(0)}</div>
                <div className="text-sm text-gray-600">Average Transaction Value</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
