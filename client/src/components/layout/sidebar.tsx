import { Link, useLocation } from "wouter";
import { 
  Home, 
  Package, 
  Store, 
  Users, 
  Box, 
  Thermometer, 
  Fan,
  BarChart3
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigationItems = [
  { path: "/", label: "Dashboard", icon: Home },
  { path: "/inventory", label: "Inventory", icon: Package },
  { path: "/vendors", label: "Vendors", icon: Store },
  { path: "/customers", label: "Customers", icon: Users },
  { path: "/crates", label: "Crates", icon: Box },
  { path: "/cold-storage", label: "Cold Storage", icon: Thermometer },
  { path: "/housekeeping", label: "Housekeeping", icon: Fan },
  { path: "/reports", label: "Reports", icon: BarChart3 },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="hidden lg:block fixed left-0 top-0 h-full w-64 bg-white shadow-lg z-40">
      <div className="p-6">
        <div className="flex items-center mb-8">
          <div className="w-10 h-10 bg-market-green rounded-lg flex items-center justify-center mr-3">
            <Store className="text-white h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-dark-grey">Market Master</h1>
            <p className="text-sm text-gray-500">Management System</p>
          </div>
        </div>

        <nav className="space-y-2">
          {navigationItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = location === item.path;
            
            return (
              <Link key={item.path} href={item.path}>
                <a className={cn(
                  "flex items-center p-3 rounded-lg transition-colors",
                  isActive 
                    ? "bg-light-green text-market-green" 
                    : "text-gray-600 hover:bg-gray-100"
                )}>
                  <IconComponent className="w-5 h-5 mr-3" />
                  <span>{item.label}</span>
                </a>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
