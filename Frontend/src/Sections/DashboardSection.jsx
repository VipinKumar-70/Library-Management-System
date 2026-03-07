import StatsCard from "../components/StatsCard";
import TaskCard from "../components/TaskCard";

const DashboardSection = () => {
  return (
    <div className="space-y-6">
      
      <div className="grid md:grid-cols-4 gap-6">
        <StatsCard
          title="Pending Tasks"
          value="0"
          color="border-yellow-400"
        />
        <StatsCard
          title="Active Tasks"
          value="0"
          color="border-blue-500"
        />
        <StatsCard
          title="Completed"
          value="2"
          color="border-green-500"
        />
        <StatsCard
          title="Rejected"
          value="0"
          color="border-red-500"
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">My Tasks</h2>

        <TaskCard
          title="Library System UI"
          description="Build dashboard UI with Tailwind"
          status="Completed"
        />

        <TaskCard
          title="Borrow Feature"
          description="Allow students to borrow books"
          status="Pending"
        />
      </div>
    </div>
  );
};

export default DashboardSection;