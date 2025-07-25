import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Inventory from "@/pages/inventory";
import Vendors from "@/pages/vendors";
import Customers from "@/pages/customers";
import Crates from "@/pages/crates";
import ColdStorage from "@/pages/cold-storage";
import Housekeeping from "@/pages/housekeeping";
import Reports from "@/pages/reports";
import Sidebar from "@/components/layout/sidebar";
import MobileNav from "@/components/layout/mobile-nav";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/inventory" component={Inventory} />
      <Route path="/vendors" component={Vendors} />
      <Route path="/customers" component={Customers} />
      <Route path="/crates" component={Crates} />
      <Route path="/cold-storage" component={ColdStorage} />
      <Route path="/housekeeping" component={Housekeeping} />
      <Route path="/reports" component={Reports} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-gray-50">
          <Sidebar />
          <MobileNav />
          <div className="lg:ml-64 pb-16 lg:pb-0">
            <Router />
          </div>
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
