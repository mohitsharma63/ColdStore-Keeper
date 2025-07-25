import { Link, useLocation } from "wouter";
import { 
  Home, 
  Package, 
  Store, 
  BarChart3,
  User
} from "lucide-react";
import { cn } from "@/lib/utils";

const mobileNavItems = [
  { path: "/", label: "Dashboard", icon: Home },
  { path: "/inventory", label: "Inventory", icon: Package },
  { path: "/vendors", label: "Vendors", icon: Store },
  { path: "/reports", label: "Reports", icon: BarChart3 },
  { path: "/profile", label: "Profile", icon: User },
];

export default function MobileNav() {
  const [location] = useLocation();

  return (
    <div className="lg:hidden bg-white shadow-md fixed bottom-0 left-0 right-0 z-50">
      <div className="flex justify-around py-2">
        {mobileNavItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = location === item.path;
          
          return (
            <Link key={item.path} href={item.path}>
              <a className={cn(
                "flex flex-col items-center p-2",
                isActive ? "text-market-green" : "text-gray-500"
              )}>
                <IconComponent className="h-5 w-5" />
                <span className="text-xs mt-1">{item.label}</span>
              </a>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
