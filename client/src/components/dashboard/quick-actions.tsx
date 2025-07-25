import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, FileText, Calendar } from "lucide-react";

export default function QuickActions() {
  const actions = [
    {
      label: "Add New Vendor",
      icon: Plus,
      color: "bg-market-green hover:bg-green-600",
      action: () => console.log("Add new vendor")
    },
    {
      label: "Update Prices",
      icon: Edit,
      color: "bg-market-orange hover:bg-orange-600",
      action: () => console.log("Update prices")
    },
    {
      label: "Generate Report",
      icon: FileText,
      color: "bg-blue-600 hover:bg-blue-700",
      action: () => console.log("Generate report")
    },
    {
      label: "Schedule Task",
      icon: Calendar,
      color: "bg-purple-600 hover:bg-purple-700",
      action: () => console.log("Schedule task")
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-dark-grey">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {actions.map((action) => {
            const IconComponent = action.icon;

            return (
              <Button
                key={action.label}
                onClick={action.action}
                className={`w-full ${action.color} text-white transition-colors flex items-center justify-center`}
              >
                <IconComponent className="h-4 w-4 mr-2" />
                {action.label}
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
