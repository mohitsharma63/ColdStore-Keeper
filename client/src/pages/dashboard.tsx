import { Bell, User } from "lucide-react";
import MetricsCards from "@/components/dashboard/metrics-cards";
import PriceTracking from "@/components/dashboard/price-tracking";
import InventoryOverview from "@/components/dashboard/inventory-overview";
import VendorList from "@/components/dashboard/vendor-list";
import CratesManagement from "@/components/dashboard/crates-management";
import ColdStorageStatus from "@/components/dashboard/cold-storage-status";
import HousekeepingSchedule from "@/components/dashboard/housekeeping-schedule";
import QuickActions from "@/components/dashboard/quick-actions";
import RecentTransactions from "@/components/dashboard/recent-transactions";

export default function Dashboard() {
  return (
    <>
      {/* Top Header */}
      <header className="bg-white shadow-sm p-4 lg:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-dark-grey">Market Dashboard</h1>
            <p className="text-gray-600">Welcome back, Market Manager</p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-gray-600 hover:text-market-green">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-market-green rounded-full flex items-center justify-center">
                <User className="text-white h-4 w-4" />
              </div>
              <span className="text-sm font-medium text-gray-700 hidden sm:block">Admin User</span>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="p-4 lg:p-6 space-y-6">
        <MetricsCards />
        <PriceTracking />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <InventoryOverview />
          <VendorList />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CratesManagement />
          <ColdStorageStatus />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <HousekeepingSchedule />
          </div>
          <QuickActions />
        </div>

        <RecentTransactions />
      </main>

      {/* Floating Action Button (Mobile) */}
      <button className="lg:hidden fixed bottom-20 right-4 w-14 h-14 bg-market-green text-white rounded-full shadow-lg flex items-center justify-center z-40">
        <span className="text-lg">+</span>
      </button>
    </>
  );
}
