"use client";

import TaskCard from "@/components/TaskCard";
import { useState } from "react";


// Example user context (replace with actual auth context if available)
const currentUser = {
  id: "user-123",
  role: "manager" as "admin" | "manager" | "user",
};

// Example mock tasks
const mockTasks = [
  {
    id: "1",
    title: "Prepare meeting notes",
    description: "Summarize last week's meeting",
    dueDate: "2025-05-15",
    priority: "high" as const,
    status: "pending" as const,
    creatorId: "user-123",
    assigneeId: "user-456",
  },
  {
    id: "2",
    title: "Design homepage",
    description: "Create a draft for the homepage redesign",
    dueDate: "2025-05-18",
    priority: "medium" as const,
    status: "completed" as const,
    creatorId: "user-789",
    assigneeId: "user-123",
  },
  {
    id: "3",
    title: "Backend API setup",
    description: "Set up Express routes and controllers",
    dueDate: "2025-05-20",
    priority: "low" as const,
    status: "pending" as const,
    creatorId: "user-123",
    assigneeId: "",
  },
];


export default function DashboardPage() {
  const [tasks, setTasks] = useState(mockTasks);

  const handleUpdate = (id: string) => {
    alert(`Update task ${id}`);
  };

  const handleDelete = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const handleAssign = (id: string) => {
    alert(`Assign task ${id}`);
  };

// const handleComplete = (id: string) => {
//   setTasks((prev) =>
//     prev.map((task) =>
//       task.id === id ? { ...task, status: "completed" as Status } : task
//     )
//   );
// };

const handleComplete = () => {}




  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            currentUserId={currentUser.id}
            currentUserRole={currentUser.role}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            onAssign={handleAssign}
            onComplete={handleComplete}
          />
        ))}
      </div>
    </div>
  );
}
