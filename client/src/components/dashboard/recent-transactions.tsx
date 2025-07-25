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
import type { Transaction, Vendor } from "@shared/schema";

export default function RecentTransactions() {
  const { data: transactions } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
  });

  const { data: vendors } = useQuery<Vendor[]>({
    queryKey: ["/api/vendors"],
  });

  const getVendorName = (vendorId: number | null) => {
    if (!vendorId || !vendors) return "Unknown Vendor";
    const vendor = vendors.find(v => v.id === vendorId);
    return vendor?.name || "Unknown Vendor";
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  const formatTime = (date: Date | string | null) => {
    if (!date) return "N/A";
    const d = new Date(date);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const parseItems = (itemsJson: string) => {
    try {
      const items = JSON.parse(itemsJson);
      return items.map((item: any) => item.name).join(', ');
    } catch {
      return "Various items";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-dark-grey">Recent Transactions</CardTitle>
          <Button variant="ghost" className="text-market-green text-sm font-medium">
            View All Transactions
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="text-sm font-semibold text-gray-600">Transaction ID</TableHead>
                <TableHead className="text-sm font-semibold text-gray-600">Vendor</TableHead>
                <TableHead className="text-sm font-semibold text-gray-600">Items</TableHead>
                <TableHead className="text-sm font-semibold text-gray-600">Amount</TableHead>
                <TableHead className="text-sm font-semibold text-gray-600">Status</TableHead>
                <TableHead className="text-sm font-semibold text-gray-600">Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions?.slice(0, 3).map((transaction) => (
                <TableRow key={transaction.id} className="hover:bg-gray-50">
                  <TableCell className="text-sm font-mono">#{transaction.transactionId}</TableCell>
                  <TableCell className="text-sm">{getVendorName(transaction.vendorId)}</TableCell>
                  <TableCell className="text-sm">{parseItems(transaction.items)}</TableCell>
                  <TableCell className="text-sm font-semibold">₹{parseFloat(transaction.totalAmount).toLocaleString()}</TableCell>
                  <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                  <TableCell className="text-sm text-gray-600">{formatTime(transaction.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
