import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Housekeeping } from "@shared/schema";

export default function HousekeepingSchedule() {
  const { data: tasks } = useQuery<Housekeeping[]>({
    queryKey: ["/api/housekeeping"],
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          bg: 'bg-green-50',
          border: 'border-green-500',
          dot: 'bg-green-500',
          text: 'text-green-600'
        };
      case 'active':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-500',
          dot: 'bg-blue-500',
          text: 'text-blue-600'
        };
      case 'pending':
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-300',
          dot: 'bg-gray-400',
          text: 'text-gray-600'
        };
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-300',
          dot: 'bg-gray-400',
          text: 'text-gray-600'
        };
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Done';
      case 'active':
        return 'Active';
      case 'pending':
        return 'Pending';
      default:
        return status;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-dark-grey">Today's Housekeeping Schedule</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {tasks?.slice(0, 3).map((task) => {
            const statusStyle = getStatusColor(task.status);

            return (
              <div key={task.id} className={`flex items-center p-3 ${statusStyle.bg} border-l-4 ${statusStyle.border} rounded`}>
                <div className={`w-3 h-3 ${statusStyle.dot} rounded-full mr-4`}></div>
                <div className="flex-1">
                  <div className="font-medium">{task.taskName}</div>
                  <div className="text-sm text-gray-600">{task.description || `${task.area} - ${task.assignedTo || 'Unassigned'}`}</div>
                </div>
                <div className={`text-sm font-medium ${statusStyle.text}`}>
                  {getStatusLabel(task.status)}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
